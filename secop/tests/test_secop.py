import asyncio
import io
import json
import os
import subprocess
from pathlib import Path
import sys
import tempfile
import unittest
from unittest.mock import patch
from urllib.error import HTTPError
import zipfile

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))
sys.path.insert(0, str(ROOT / "mcp"))
import secop_query as q
import secop_documents as d


class SearchTests(unittest.TestCase):
    def test_cancelled_future_and_missing_deadline(self):
        self.assertEqual(q._vigencia_secop2({"estado_del_procedimiento": "Cancelado", "fecha_de_recepcion_de": "2099-01-01"}), "CERRADA")
        self.assertEqual(q._vigencia_secop2({}), "REVISAR")
        self.assertEqual(q._parse_date("2026-01-01T12:00:00").utcoffset().total_seconds(), -18000)

    def test_only_current_filters_cancelled_and_expired(self):
        rows = [{"id_del_proceso": "open", "fecha_de_recepcion_de": "2099-01-01"},
                {"id_del_proceso": "cancel", "fecha_de_recepcion_de": "2099-01-01", "estado_del_procedimiento": "Cancelado"},
                {"id_del_proceso": "old", "fecha_de_recepcion_de": "2000-01-01"}]
        with patch.object(q, "query_dataset", return_value=rows):
            self.assertEqual([r["id_proceso"] for r in q.buscar_secop2(solo_vigentes=True)], ["open"])

    def test_evaluation_is_not_open_even_with_future_deadline(self):
        for estado in ("Evaluación", "En evaluación"):
            row = {"estado_del_procedimiento": estado, "fecha_de_recepcion_de": "2099-01-01"}
            self.assertEqual(q._vigencia_secop2(row), "EN_EVALUACION")
            with patch.object(q, "query_dataset", return_value=[row]):
                self.assertEqual(q.buscar_secop2(solo_vigentes=True), [])
                self.assertEqual(q.buscar_secop2()[0]["vigencia"], "EN_EVALUACION")

    def test_contract_fields_and_history(self):
        item = q.normalize_contrato_secop2({"id_contrato": "C", "proceso_de_compra": "P", "nombre_entidad": "Entidad", "objeto_del_contrato": "Software", "referencia_del_contrato": "REF", "estado_contrato": "En ejecución"})
        self.assertEqual((item["id_contrato"], item["id_proceso"], item["objeto"], item["entidad"]), ("C", "P", "Software", "Entidad"))
        self.assertEqual(item["vigencia"], "HISTORICO_CONTRACTUAL")

    def test_partial_failure_is_visible(self):
        with patch.object(q, "buscar_secop1", side_effect=OSError("offline")), patch.object(q, "buscar_secop2", return_value=[{"fuente": "SECOP II", "id_proceso": "1"}]):
            result = q.buscar_unificado("obras")
        self.assertFalse(result["consulta_completa"])
        self.assertEqual(len(result["resultados"]), 1)
        self.assertEqual(result["errores"][0]["fuente"], "SECOP I")

    def test_source_aware_dedupe(self):
        self.assertEqual(len(q._dedupe([{"fuente": f, "id_proceso": "1"} for f in ("SECOP I", "SECOP II")])), 2)
        self.assertEqual(len(q._dedupe([{"fuente": "SECOP I", "id_proceso": "001", "entidad": e} for e in ("A", "B")])), 2)


class DocumentTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.env = patch.dict(os.environ, {"SECOP_OUTPUT_DIR": self.temp.name})
        self.env.start()

    def tearDown(self):
        self.env.stop()
        self.temp.cleanup()

    def obtain_text(self, text="El proponente deberá entregar equipos. Precio unitario por equipo. Evaluación: experiencia 30 puntos."):
        with patch.object(d, "fetch", return_value=(text.encode(), "text/plain", "https://www.contratos.gov.co/a.txt")):
            return d.obtain({"fuente": "SECOP II", "id_proceso": "TEST"}, ["https://www.contratos.gov.co/a.txt"])

    def test_flow_citations_pending_and_economics(self):
        manifest = self.obtain_text()
        analysis = d.analyze(manifest["expediente"])
        self.assertTrue(analysis["requisitos"])
        req = analysis["requisitos"][0]
        self.assertEqual(req["documento"], "D001")
        self.assertTrue(req["sha256"])
        result = d.generate(manifest["expediente"], {"items": [{"cantidad": "2", "precio_unitario": "100.10", "impuesto_porcentaje": "19"}], "respuestas": {req["id"]: "Plan sujeto a soportes"}})
        self.assertEqual(result["total_items_aportados"], "238.24")
        text = (Path(result["directorio"]) / "propuesta.md").read_text(encoding="utf-8")
        self.assertIn(d.PENDING, text)
        self.assertIn(req["cita"], text)
        self.assertIn("Plan sujeto a soportes", text)
        second = d.generate(manifest["expediente"])
        self.assertNotEqual(result["directorio"], second["directorio"])
        self.assertTrue(Path(result["directorio"]).exists())

    def test_restricted_and_html_are_not_downloads(self):
        url = "https://www.contratos.gov.co/a.pdf"
        with patch.object(d, "fetch", side_effect=HTTPError(url, 403, "Forbidden", {}, None)):
            manifest = d.obtain({"fuente": "SECOP I", "id_proceso": "1"}, [url])
        self.assertEqual(manifest["documentos"][0]["estado"], "RESTRINGIDO")
        result = d.generate(manifest["expediente"])
        self.assertIn("Forbidden", (Path(result["directorio"]) / "propuesta.md").read_text(encoding="utf-8"))
        with patch.object(d, "fetch", return_value=(b"<html>login</html>", "application/pdf", url)):
            record = d.download(url, Path(self.temp.name), 1)
        self.assertEqual(record["estado"], "NO_DESCARGADO")
        self.assertFalse((Path(self.temp.name) / "D001.pdf").exists())

    def test_links_and_limit(self):
        data = b'<a href="/pliego.pdf">P</a><a href="/pliego.pdf">P</a><a href="javascript:void(0)">x</a>'
        with patch.object(d, "fetch", return_value=(data, "text/html", "https://www.contratos.gov.co/p")):
            result = d.discover("https://www.contratos.gov.co/p")
        self.assertEqual(result["documentos"], ["https://www.contratos.gov.co/pliego.pdf"])
        with patch.object(d, "MAX_DOCUMENTS", 1), patch.object(d, "fetch", return_value=(b"requisito", "text/plain", "https://www.contratos.gov.co/a.txt")):
            result = d.obtain({"fuente": "SECOP I", "id_proceso": "1"}, ["https://www.contratos.gov.co/a.txt", "https://www.contratos.gov.co/b.txt"])
        self.assertEqual(result["documentos"][1]["estado"], "OMITIDO_LIMITE")

    def test_url_redirect_and_path_boundaries(self):
        self.assertEqual(d.validate_url("https://community.secop.gov.co/Public/a"), "https://community.secop.gov.co/Public/a")
        for url in ("file:///etc/passwd", "http://www.contratos.gov.co/a", "https://contratos.gov.co.evil.example/a", "https://127.0.0.1/a", "https://user:secret@contratos.gov.co/a"):
            with self.assertRaises(ValueError):
                d.validate_url(url)
        with self.assertRaises(ValueError):
            d.PublicRedirect().redirect_request(None, None, 302, "", {}, "https://127.0.0.1/")
        with self.assertRaises(ValueError):
            d.folder("../outside")

    def test_tamper_cannot_be_used_as_evidence(self):
        manifest = self.obtain_text()
        (d.folder(manifest["expediente"]) / "D001.txt").write_text("requisito falso")
        result = d.analyze(manifest["expediente"])
        self.assertFalse(result["requisitos"])
        self.assertIn("SHA256", result["faltantes"][0]["motivo"])

    def test_decimal_missing_and_invalid(self):
        self.assertEqual(d.economic([{"cantidad": 2, "precio_unitario": 100}])[1], d.PENDING)
        self.assertEqual(d.economic([])[1], d.PENDING)
        self.assertEqual(d.economic([{"cantidad": 2, "precio_unitario": 100, "impuesto_porcentaje": 0}])[1], "200.00")
        for value in ("NaN", "Infinity", "-1"):
            with self.assertRaises(ValueError):
                d.money(value)
        self.assertTrue(d.csv_cell("=1+1").startswith("'"))

    def test_cli_no_documents_produces_explicit_pending_draft(self):
        process = Path(self.temp.name) / "proceso.json"
        process.write_text(json.dumps({"fuente": "SECOP I", "id_proceso": "TEST"}), encoding="utf-8")
        script = str(ROOT / "scripts/secop_documents.py")
        def run(*args):
            result = subprocess.run([sys.executable, script, *args], check=True, capture_output=True, encoding="utf-8", env={**os.environ, "PYTHONIOENCODING": "utf-8"})
            return json.loads(result.stdout)
        manifest = run("obtener", "--proceso", str(process))
        analysis = run("analizar", "--expediente", manifest["expediente"])
        self.assertFalse(analysis["requisitos"])
        proposal = run("propuesta", "--expediente", manifest["expediente"])
        self.assertEqual(proposal["total_items_aportados"], d.PENDING)
        self.assertIn("SIN_URL", (Path(proposal["directorio"]) / "propuesta.md").read_text(encoding="utf-8"))

    def test_http_statuses_and_no_automatic_false_success(self):
        for code, status in [(401, "RESTRINGIDO"), (429, "RESTRINGIDO"), (404, "ERROR_HTTP")]:
            result = d.failure(HTTPError("https://www.contratos.gov.co/a", code, "status", {}, None))
            self.assertEqual(result["estado"], status)
            self.assertEqual(result["http_status"], code)

    def test_unknown_requirement_rejected(self):
        manifest = self.obtain_text()
        with self.assertRaises(ValueError):
            d.generate(manifest["expediente"], {"respuestas": {"R9999": "Inventado"}})

    def test_docx_table_and_xlsx(self):
        path = Path(self.temp.name) / "test.docx"
        with zipfile.ZipFile(path, "w") as archive:
            archive.writestr("word/document.xml", '<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body><w:tbl><w:tr><w:tc><w:p><w:r><w:t>Requisito técnico</w:t></w:r></w:p></w:tc></w:tr></w:tbl></w:body></w:document>')
        self.assertIn("Requisito técnico", d.extract(path)[0]["texto"])
        from openpyxl import Workbook
        book = Workbook()
        book.active.append(["Precio unitario", "=2+2"])
        path = path.with_suffix(".xlsx")
        book.save(path)
        self.assertIn("=2+2", d.extract(path)[0]["texto"])

    def test_blank_pdf_pending_ocr(self):
        from pypdf import PdfWriter
        writer = PdfWriter()
        writer.add_blank_page(width=100, height=100)
        data = io.BytesIO()
        writer.write(data)
        with patch.object(d, "fetch", return_value=(data.getvalue(), "application/pdf", "https://www.contratos.gov.co/a.pdf")):
            manifest = d.obtain({"fuente": "SECOP II", "id_proceso": "1"}, ["https://www.contratos.gov.co/a.pdf"])
        analysis = d.analyze(manifest["expediente"])
        self.assertFalse(analysis["requisitos"])
        self.assertTrue(any("OCR" in item["motivo"] for item in analysis["faltantes"]))

    def test_mcp_tools_and_flow(self):
        import server
        tools = asyncio.run(server.mcp.list_tools())
        names = {t.name for t in tools}
        self.assertEqual(len(names), 8)
        with patch.object(d, "fetch", return_value=(b"Requisito tecnico: entregar equipos", "text/plain", "https://www.contratos.gov.co/a.txt")):
            result = asyncio.run(server.mcp.call_tool("obtener_documentos_secop", {"proceso": {"fuente": "SECOP II", "id_proceso": "TEST"}, "urls_documentos": ["https://www.contratos.gov.co/a.txt"]}))
        # FastMCP returns (content blocks, structured result) for dictionary results.
        manifest = result[1] if isinstance(result, tuple) else json.loads(result[0].text)
        analysis = server.analizar_requisitos_secop(manifest["expediente"])
        self.assertTrue(analysis["requisitos"])
        self.assertEqual(server.generar_propuesta_secop(manifest["expediente"])["estado"], "BORRADOR_REQUIERE_REVISION")


if __name__ == "__main__":
    unittest.main()
