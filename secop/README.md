# SECOP Intelligence

Proyecto para consultar y analizar contratación pública colombiana usando datos oficiales de SECOP I y SECOP II publicados en datos.gov.co.

## Qué quedó instalado

- Skill de Codex: `.codex/skills/secop-intelligence/SKILL.md`
- Configuración MCP del proyecto: `.codex/config.toml`
- Motor de consulta: `secop/scripts/secop_query.py`
- Servidor MCP: `secop/mcp/server.py`
- Dependencias MCP: `secop/mcp/pyproject.toml`
- Perfil de búsqueda: `secop/config/profile.json`
- Plugin portable: `secop/plugin.json` + `secop/mcp.json` + `secop/skills/`

## Fuentes

- SECOP I - Procesos: `f789-7hwg`
- SECOP II - Procesos: `p6dx-8zbt`
- SECOP II - Contratos: `jbjy-vk9h`
- Proveedores: `qmzu-gj57`
- PAA: `b6m4-qgqv`
- Adiciones: `cb9c-h8sn`
- Facturas: `ibyt-yi2f`
- Ejecución: `mfmm-jqmq`

## Cómo funciona la búsqueda unificada

1. Recibe una consulta en lenguaje natural o palabras clave.
2. Consulta SECOP I para antecedentes históricos.
3. Consulta SECOP II para procesos vigentes y recientes.
4. En SECOP II valida `fecha_de_recepcion_de` para determinar si todavía se reciben ofertas.
5. Normaliza ambas fuentes a campos comunes.
6. Deduplica registros.
7. Calcula relevancia temática.
8. Prioriza oportunidades abiertas o próximas a cerrar.
9. Devuelve siempre el campo `fuente` para distinguir SECOP I de SECOP II.

SECOP I se trata como histórico y nunca se presenta como una oportunidad vigente.

## Uso directo sin MCP

Desde la raíz del repositorio:

```bash
python secop/scripts/secop_query.py unificado \
  --query "auditoria cuentas medicas RIPS" \
  --departamento "Valle del Cauca" \
  --solo-vigentes
```

## Uso con MCP en Codex

El repositorio incluye `.codex/config.toml`. Cuando el proyecto sea de confianza, Codex puede iniciar el servidor mediante `uv`.

El primer arranque resuelve la dependencia `mcp[cli]` declarada en `secop/mcp/pyproject.toml`.

Para verificar en Codex CLI:

```bash
codex mcp list
```

El servidor debe aparecer como `secop-intelligence`.

Herramientas expuestas:

- `buscar_secop_unificado`
- `buscar_secop1`
- `buscar_secop2`
- `buscar_contratos_secop2`
- `buscar_paa`

## Token de datos.gov.co

Es opcional. Sin token las consultas funcionan, pero pueden tener un límite de peticiones menor.

Si deseas usar uno, define:

```bash
export SOCRATA_APP_TOKEN="TU_TOKEN"
```

No almacenes tokens reales en GitHub.

## Ejemplos

- "Busca oportunidades vigentes sobre auditoría de cuentas médicas en Valle del Cauca."
- "Consulta SECOP I y II sobre RIPS desde 2018."
- "Busca contratos de facturación en salud de la ESE."
- "Busca en el PAA compras relacionadas con analítica de datos y Power BI."
