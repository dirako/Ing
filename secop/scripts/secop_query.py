#!/usr/bin/env python3
"""Motor de consulta SECOP Intelligence.

Consulta datos oficiales de SECOP I y SECOP II mediante la API SODA de datos.gov.co.
No requiere dependencias externas para las búsquedas HTTP.
"""

from __future__ import annotations

import argparse
import json
import os
import re
import unicodedata
from datetime import datetime, timedelta, timezone
from typing import Any
from urllib.parse import urlencode
from urllib.request import Request, urlopen

BASE_URL = "https://www.datos.gov.co/resource"
DATASETS = {
    "secop1_procesos": "f789-7hwg",
    "secop2_procesos": "p6dx-8zbt",
    "secop2_contratos": "jbjy-vk9h",
    "secop2_proveedores": "qmzu-gj57",
    "paa": "b6m4-qgqv",
    "adiciones": "cb9c-h8sn",
    "facturas": "ibyt-yi2f",
    "ejecucion": "mfmm-jqmq",
}

DEFAULT_LIMIT = 25
MAX_LIMIT = 100
BOGOTA_TZ = timezone(timedelta(hours=-5))


def _escape_soql(value: str) -> str:
    return value.replace("'", "''")


def _clean_text(value: Any) -> str:
    if value is None:
        return ""
    if isinstance(value, dict):
        return str(value.get("url") or value.get("description") or "")
    return str(value).strip()


def _fold(value: str) -> str:
    value = unicodedata.normalize("NFKD", value or "")
    value = "".join(ch for ch in value if not unicodedata.combining(ch))
    return re.sub(r"\s+", " ", value).strip().lower()


def _pick(row: dict[str, Any], *names: str) -> Any:
    for name in names:
        if name in row and row[name] not in (None, ""):
            return row[name]
    return ""


def query_dataset(dataset: str, params: dict[str, Any], timeout: int = 45) -> list[dict[str, Any]]:
    dataset_id = DATASETS.get(dataset, dataset)
    url = f"{BASE_URL}/{dataset_id}.json?{urlencode(params)}"
    headers = {"Accept": "application/json", "User-Agent": "SECOP-Intelligence/1.0"}
    token = os.getenv("SOCRATA_APP_TOKEN", "").strip()
    if token:
        headers["X-App-Token"] = token
    request = Request(url, headers=headers)
    with urlopen(request, timeout=timeout) as response:
        payload = json.loads(response.read().decode("utf-8"))
    if not isinstance(payload, list):
        raise RuntimeError(f"Respuesta inesperada de datos.gov.co: {type(payload).__name__}")
    return payload


def _parse_date(value: Any) -> datetime | None:
    text = _clean_text(value)
    if not text:
        return None
    text = text.replace("Z", "+00:00")
    try:
        dt = datetime.fromisoformat(text)
        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=timezone.utc)
        return dt
    except ValueError:
        return None


def _vigencia_secop2(row: dict[str, Any]) -> str:
    cierre = _parse_date(_pick(row, "fecha_de_recepcion_de", "fecha_de_recepcion_de_respuestas"))
    if cierre:
        now = datetime.now(timezone.utc)
        delta = cierre - now
        if delta.total_seconds() < 0:
            return "CERRADA"
        if delta.total_seconds() <= 3 * 86400:
            return "PROXIMA_A_CERRAR"
        return "ABIERTA"

    estado = _fold(_clean_text(_pick(row, "estado_del_procedimiento", "estado")))
    if any(x in estado for x in ("adjudicado", "seleccionado", "cerrado", "cancelado", "terminado")):
        return "CERRADA"
    return "REVISAR"


def normalize_secop1(row: dict[str, Any]) -> dict[str, Any]:
    return {
        "fuente": "SECOP I",
        "id_proceso": _clean_text(_pick(row, "numero_de_proceso", "numero_proceso")),
        "referencia": _clean_text(_pick(row, "numero_de_proceso", "numero_de_contrato")),
        "entidad": _clean_text(_pick(row, "nombre_entidad")),
        "objeto": _clean_text(_pick(row, "detalle_del_objeto_a_contratar", "objeto_a_contratar")),
        "proveedor": _clean_text(_pick(row, "nom_razon_social_contratista")),
        "documento_proveedor": _clean_text(_pick(row, "identificacion_del_contratista")),
        "departamento": _clean_text(_pick(row, "departamento_entidad")),
        "modalidad": _clean_text(_pick(row, "modalidad_de_contratacion")),
        "estado": _clean_text(_pick(row, "estado_del_proceso")),
        "valor": _clean_text(_pick(row, "cuantia_contrato", "cuantia_proceso")),
        "fecha_publicacion": _clean_text(_pick(row, "fecha_de_cargue_en_el_secop")),
        "fecha_cierre": "",
        "vigencia": "HISTORICO",
        "url": _clean_text(_pick(row, "ruta_proceso_en_secop_i", "url")),
    }


def normalize_secop2(row: dict[str, Any]) -> dict[str, Any]:
    return {
        "fuente": "SECOP II",
        "id_proceso": _clean_text(_pick(row, "id_del_proceso", "id_proceso")),
        "referencia": _clean_text(_pick(row, "referencia_del_proceso")),
        "entidad": _clean_text(_pick(row, "entidad")),
        "objeto": _clean_text(_pick(row, "descripci_n_del_procedimiento", "nombre_del_procedimiento")),
        "proveedor": _clean_text(_pick(row, "nombre_del_proveedor", "proveedor_adjudicado")),
        "documento_proveedor": _clean_text(_pick(row, "nit_del_proveedor_adjudicado", "documento_proveedor")),
        "departamento": _clean_text(_pick(row, "departamento_entidad", "departamento")),
        "modalidad": _clean_text(_pick(row, "modalidad_de_contratacion")),
        "estado": _clean_text(_pick(row, "estado_del_procedimiento", "estado_contrato")),
        "valor": _clean_text(_pick(row, "precio_base", "valor_total_adjudicacion", "valor_del_contrato")),
        "fecha_publicacion": _clean_text(_pick(row, "fecha_de_publicacion_del", "fecha_de_publicacion_del_proceso")),
        "fecha_cierre": _clean_text(_pick(row, "fecha_de_recepcion_de", "fecha_de_recepcion_de_respuestas")),
        "vigencia": _vigencia_secop2(row),
        "url": _clean_text(_pick(row, "urlproceso", "url_proceso")),
    }


def buscar_secop1(
    query: str = "",
    departamento: str = "",
    entidad: str = "",
    limite: int = DEFAULT_LIMIT,
) -> list[dict[str, Any]]:
    clauses: list[str] = []
    if departamento:
        clauses.append(
            f"upper(departamento_entidad) like upper('%{_escape_soql(departamento)}%')"
        )
    if entidad:
        clauses.append(f"upper(nombre_entidad) like upper('%{_escape_soql(entidad)}%')")

    params: dict[str, Any] = {"$limit": min(max(limite, 1), MAX_LIMIT)}
    if query:
        params["$q"] = query
    if clauses:
        params["$where"] = " AND ".join(clauses)

    return [normalize_secop1(row) for row in query_dataset("secop1_procesos", params)]


def buscar_secop2(
    query: str = "",
    departamento: str = "",
    entidad: str = "",
    solo_vigentes: bool = False,
    limite: int = DEFAULT_LIMIT,
) -> list[dict[str, Any]]:
    clauses: list[str] = []
    if departamento:
        clauses.append(
            f"upper(departamento_entidad) like upper('%{_escape_soql(departamento)}%')"
        )
    if entidad:
        clauses.append(f"upper(entidad) like upper('%{_escape_soql(entidad)}%')")
    if solo_vigentes:
        today = datetime.now(BOGOTA_TZ).strftime("%Y-%m-%dT00:00:00.000")
        clauses.append(f"fecha_de_recepcion_de >= '{today}'")

    params: dict[str, Any] = {
        "$limit": min(max(limite, 1), MAX_LIMIT),
        "$order": "fecha_de_recepcion_de ASC" if solo_vigentes else "fecha_de_publicacion_del DESC",
    }
    if query:
        params["$q"] = query
    if clauses:
        params["$where"] = " AND ".join(clauses)

    return [normalize_secop2(row) for row in query_dataset("secop2_procesos", params)]


def buscar_contratos_secop2(
    query: str = "",
    departamento: str = "",
    entidad: str = "",
    limite: int = DEFAULT_LIMIT,
) -> list[dict[str, Any]]:
    clauses: list[str] = []
    if departamento:
        clauses.append(f"upper(departamento) like upper('%{_escape_soql(departamento)}%')")
    if entidad:
        clauses.append(f"upper(nombre_entidad) like upper('%{_escape_soql(entidad)}%')")

    params: dict[str, Any] = {
        "$limit": min(max(limite, 1), MAX_LIMIT),
        "$order": "fecha_de_firma DESC",
    }
    if query:
        params["$q"] = query
    if clauses:
        params["$where"] = " AND ".join(clauses)

    rows = query_dataset("secop2_contratos", params)
    return [normalize_secop2(row) for row in rows]


def buscar_paa(query: str = "", limite: int = DEFAULT_LIMIT) -> list[dict[str, Any]]:
    params: dict[str, Any] = {"$limit": min(max(limite, 1), MAX_LIMIT)}
    if query:
        params["$q"] = query
    return query_dataset("paa", params)


def _score(item: dict[str, Any], query: str) -> int:
    terms = [t for t in re.split(r"\W+", _fold(query)) if len(t) >= 3]
    haystack = _fold(
        " ".join(
            [
                _clean_text(item.get("objeto")),
                _clean_text(item.get("entidad")),
                _clean_text(item.get("modalidad")),
                _clean_text(item.get("proveedor")),
            ]
        )
    )
    score = sum(2 for term in terms if term in haystack)
    if item.get("vigencia") == "ABIERTA":
        score += 5
    elif item.get("vigencia") == "PROXIMA_A_CERRAR":
        score += 4
    elif item.get("vigencia") == "HISTORICO":
        score += 1
    return score


def _dedupe(items: list[dict[str, Any]]) -> list[dict[str, Any]]:
    seen: set[str] = set()
    output: list[dict[str, Any]] = []
    for item in items:
        ident = _fold(_clean_text(item.get("id_proceso")) or _clean_text(item.get("referencia")))
        if ident:
            key = ident
        else:
            key = "|".join(
                [
                    _fold(_clean_text(item.get("entidad"))),
                    _fold(_clean_text(item.get("objeto")))[:120],
                    _fold(_clean_text(item.get("valor"))),
                ]
            )
        if key and key in seen:
            continue
        if key:
            seen.add(key)
        output.append(item)
    return output


def buscar_unificado(
    query: str = "",
    departamento: str = "",
    entidad: str = "",
    solo_vigentes: bool = False,
    limite: int = DEFAULT_LIMIT,
) -> dict[str, Any]:
    # SECOP I se conserva como inteligencia histórica aun cuando solo_vigentes=True.
    historicos = buscar_secop1(query, departamento, entidad, limite)
    actuales = buscar_secop2(query, departamento, entidad, solo_vigentes, limite)

    combinados = _dedupe(historicos + actuales)
    for item in combinados:
        item["relevancia"] = _score(item, query)

    combinados.sort(
        key=lambda x: (
            x.get("vigencia") not in ("ABIERTA", "PROXIMA_A_CERRAR"),
            -int(x.get("relevancia", 0)),
            _clean_text(x.get("fecha_cierre")),
        )
    )

    return {
        "consulta": {
            "query": query,
            "departamento": departamento,
            "entidad": entidad,
            "solo_vigentes_secop2": solo_vigentes,
        },
        "resumen": {
            "secop1_historicos": len(historicos),
            "secop2": len(actuales),
            "total_consolidado": len(combinados),
        },
        "resultados": combinados,
    }


def _print_json(data: Any) -> None:
    print(json.dumps(data, ensure_ascii=False, indent=2, default=str))


def main() -> None:
    parser = argparse.ArgumentParser(description="Consulta unificada SECOP I + SECOP II")
    sub = parser.add_subparsers(dest="command", required=True)

    p = sub.add_parser("unificado", help="Busca simultáneamente en SECOP I y SECOP II")
    p.add_argument("--query", default="")
    p.add_argument("--departamento", default="")
    p.add_argument("--entidad", default="")
    p.add_argument("--solo-vigentes", action="store_true")
    p.add_argument("--limite", type=int, default=DEFAULT_LIMIT)

    p1 = sub.add_parser("secop1", help="Busca SECOP I")
    p1.add_argument("--query", default="")
    p1.add_argument("--departamento", default="")
    p1.add_argument("--entidad", default="")
    p1.add_argument("--limite", type=int, default=DEFAULT_LIMIT)

    p2 = sub.add_parser("secop2", help="Busca procesos SECOP II")
    p2.add_argument("--query", default="")
    p2.add_argument("--departamento", default="")
    p2.add_argument("--entidad", default="")
    p2.add_argument("--solo-vigentes", action="store_true")
    p2.add_argument("--limite", type=int, default=DEFAULT_LIMIT)

    args = parser.parse_args()
    if args.command == "unificado":
        _print_json(
            buscar_unificado(
                args.query, args.departamento, args.entidad, args.solo_vigentes, args.limite
            )
        )
    elif args.command == "secop1":
        _print_json(buscar_secop1(args.query, args.departamento, args.entidad, args.limite))
    elif args.command == "secop2":
        _print_json(
            buscar_secop2(
                args.query, args.departamento, args.entidad, args.solo_vigentes, args.limite
            )
        )


if __name__ == "__main__":
    main()
