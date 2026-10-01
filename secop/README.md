# SECOP Intelligence

Búsqueda multisectorial SECOP I + II, documentación pública, requisitos citados y borradores técnicos/económicos/comerciales editables. Sin preferencias de salud ni filtros sectoriales implícitos.

## Instalación

Python 3.11+ y uv para el inicio MCP configurado. Desde la raíz del repositorio:

```powershell
uv sync --project secop/mcp
uv run --project secop/mcp python secop/mcp/server.py
```

Alternativa sin uv para scripts y pruebas:

```powershell
python -m venv secop/mcp/.venv
secop/mcp/.venv/Scripts/python -m pip install "mcp[cli]>=1,<2" "pypdf>=5,<7" "openpyxl>=3.1,<4"
secop/mcp/.venv/Scripts/python secop/scripts/secop_query.py unificado --query "software"
```

MCP sin uv: cambia `command` a la ruta absoluta del Python del entorno y `args` a la ruta absoluta de `secop/mcp/server.py`. `.codex/config.toml` inicia desde la raíz del repositorio; abre Codex allí usando el proyecto de confianza. `secop/mcp.json` portable debe ejecutarse con directorio de trabajo **secop/**. Si el cliente no resuelve rutas relativas, configura `cwd` y argumentos absolutos. Verifica con `codex.cmd mcp list`. No se modifica configuración global.

Búsqueda usa biblioteca estándar; PDF requiere pypdf, XLSX openpyxl, DOCX usa XML estándar. Variables opcionales (no se carga `.env` automáticamente):

```powershell
$env:SOCRATA_APP_TOKEN = "token opcional"
$env:SECOP_OUTPUT_DIR = "C:/ruta/privada/expedientes"
```

Por defecto se escribe en `secop/expedientes/`, excluido de Git. Cada expediente y borrador tiene ID único. No versionar ofertas, datos del proponente ni tokens. `config/profile.json` define límites y dominios oficiales; las preferencias vacías son contexto para la skill, no filtros automáticos del motor.

## Búsqueda y vigencia

```powershell
python secop/scripts/secop_query.py unificado --query "mantenimiento vial" --departamento "Valle del Cauca" --solo-vigentes
python secop/scripts/secop_query.py secop1 --query "dotacion escolar"
python secop/scripts/secop_query.py contratos --query "licencias software"
```

- SECOP I (`f789-7hwg`): antecedentes históricos, nunca oportunidad vigente.
- SECOP II (`p6dx-8zbt`): estado y fecha de recepción. Cancelados, suspendidos, cerrados, adjudicados y desiertos no se presentan abiertos aunque tengan fecha futura. Cierre inválido/ausente: REVISAR. Fechas sin zona se interpretan en Bogotá.
- Contratos II (`jbjy-vk9h`): normalización específica, HISTORICO_CONTRACTUAL; ejecución contractual no equivale a recepción de ofertas.
- `solo_vigentes` filtra solo SECOP II. Unificado conserva SECOP I diferenciado. Límite 1–100 por fuente; no es descarga masiva.
- Fallo de una fuente queda en `errores` y `consulta_completa=false`, conservando la otra fuente.

Datos abiertos no garantizan vigencia actual: verificar cronograma, estado y adendas en el portal.

## Documentos → requisitos → propuesta

Guarda un resultado seleccionado como `proceso.json` (objeto, no lista). Incluye `fuente` y `id_proceso`, `id_contrato` o `url`; conserva entidad, objeto, vigencia y URL real.

```powershell
python secop/scripts/secop_documents.py obtener --proceso proceso.json
python secop/scripts/secop_documents.py analizar --expediente ID_DEVUELTO
python secop/scripts/secop_documents.py propuesta --expediente ID_DEVUELTO --oferta secop/examples/oferta.json
```

El ejemplo de oferta es una estructura vacía para completar con información real. `--oferta` es opcional: sin ella genera base documental con pendientes. En la skill, Codex redacta automáticamente la narrativa fundamentada y la pasa al generador; no requiere clave/API LLM adicional. La extracción por palabras clave no sustituye lectura exhaustiva.

Para añadir archivos observados en el portal, repite `--url-documento URL_REAL`. El descubrimiento es estático, limitado a la página dada: no ejecuta JavaScript ni navega árboles dinámicos. No garantiza encontrar todos los anexos. Puedes obtener enlaces directos en la vista pública. No hay importación automática de archivos locales.

Archivos generados:

| Archivo | Contenido |
| --- | --- |
| manifest.json | Proceso, descubrimiento, URLs, fechas, estados, motivos, tamaño y SHA256 |
| D001.pdf / otros | Bytes originales descargados |
| textos.json | Texto extraído con página/párrafo/fila |
| analisis.json | Requisitos/criterios candidatos citados y carencias |
| borrador-*/propuesta.md | Propuesta técnica/económica/comercial editable |
| borrador-*/matriz_requisitos.csv | Requisitos, fuentes y respuestas |
| borrador-*/presupuesto.csv | Ítems y cálculos económicos |
| borrador-*/oferta.json | Entrada para regenerar |

Esquema `oferta`: proponente, enfoque_tecnico, respuestas (mapa ID R0001 a texto), moneda, items, plazo, forma_pago, validez_oferta, garantias. Cada ítem: descripcion, unidad, cantidad, precio_unitario, impuesto_porcentaje, fuente. No proporcionar respuestas a IDs que no existan en el análisis.

Presupuesto usa decimales con dos posiciones por línea. Impuesto omitido no es cero. Si falta cantidad, precio o impuesto, total queda pendiente. Total cubre solo ítems aportados, no acredita todos los conceptos exigidos. No asume moneda ni precio del presupuesto oficial. CSV neutraliza texto que podría ejecutarse como fórmula.

## Restricciones

Solo HTTPS en dominios configurados y sus subdominios; también se validan redirecciones. Máximo 30 documentos, 25 MiB por archivo, timeout 30 s. Enlaces externos rechazados quedan registrados. HTTP 401/403/429: RESTRINGIDO; otros errores HTTP por separado. HTML de sesión/CAPTCHA/página intermedia no se guarda como PDF. No elude controles.

PDF con texto, DOCX (incluye párrafos de tablas), XLSX y texto UTF-8 son analizables. PDF escaneado/cifrado, DOC, XLS, ZIP y otros formatos quedan pendientes de OCR/conversión/revisión. XLSX conserva fórmulas como texto: no ejecuta ni recalcula. Imágenes, notas, encabezados especiales y disposición visual pueden perderse. La extracción detecta candidatos: no certifica cumplimiento. Revisar contexto, anexos y precedencia de adendas; no se resuelven contradicciones automáticamente. Ausencia de una categoría no demuestra que no sea exigida.

Cada salida es **BORRADOR — REQUIERE REVISIÓN**. No inventa experiencia, certificaciones, precios, plazos ni requisitos. No firma, radica ni envía.

## MCP y validación

Conserva buscar_secop_unificado, buscar_secop1, buscar_secop2, buscar_contratos_secop2, buscar_paa. Añade obtener_documentos_secop(proceso, urls_documentos), analizar_requisitos_secop(expediente), generar_propuesta_secop(expediente, oferta). IDs de expediente evitan aceptar rutas arbitrarias.

```powershell
uv run --project secop/mcp python -m unittest discover -s secop/tests -v
uv run --project secop/mcp python -m compileall -q secop/scripts secop/mcp
```

Pruebas sin red verifican vigencia, contratos, fallos parciales, restricciones, citas, huellas, presupuesto y MCP. Acceso a portales se verifica aparte con URLs reales; no se afirma accesibilidad universal.

Comprobación del 2026-10-01: consultas reales a las tres fuentes; conexión MCP stdio
con ocho herramientas; ambas skills validadas; PDF público oficial de 31 páginas
descargado y extraído. Un portal SECOP I devolvió restricción, un enlace SECOP II
inicio de sesión y otro agotó tiempo de conexión: se conservaron como limitaciones.
La descarga real comprobada corresponde a una guía oficial, no prueba acceso a
todos los anexos de un expediente. Los documentos contractuales y el flujo completo
se cubren con archivos simulados en las pruebas automatizadas.

## Fuentes oficiales

- [Datos abiertos SECOP](https://operaciones.colombiacompra.gov.co/transparencia/conjuntos-de-datos-abiertos)
- [SECOP II y vista pública](https://www.colombiacompra.gov.co/secop/secop-ii)
- [Configuración MCP Codex](https://developers.openai.com/codex/mcp)
