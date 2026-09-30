"""Servidor MCP para SECOP Intelligence."""

from __future__ import annotations

import json
import sys
from pathlib import Path

from mcp.server.fastmcp import FastMCP

ROOT = Path(__file__).resolve().parents[1]
SCRIPTS = ROOT / "scripts"
sys.path.insert(0, str(SCRIPTS))

from secop_query import (  # noqa: E402
    buscar_contratos_secop2,
    buscar_paa,
    buscar_secop1,
    buscar_secop2,
    buscar_unificado,
)

mcp = FastMCP(
    "secop-intelligence",
    instructions=(
        "Consulta contratación pública colombiana. Para búsquedas generales usa "
        "buscar_secop_unificado, que combina SECOP I (histórico) y SECOP II. "
        "Valida oportunidades actuales de SECOP II mediante la fecha de recepción "
        "de respuestas. Nunca presentes SECOP I como oportunidad vigente."
    ),
)


@mcp.tool()
def buscar_secop_unificado(
    query: str = "",
    departamento: str = "",
    entidad: str = "",
    solo_vigentes: bool = False,
    limite: int = 25,
) -> str:
    """Busca simultáneamente en SECOP I y SECOP II y consolida resultados."""
    data = buscar_unificado(query, departamento, entidad, solo_vigentes, limite)
    return json.dumps(data, ensure_ascii=False, indent=2)


@mcp.tool()
def buscar_secop1(
    query: str = "",
    departamento: str = "",
    entidad: str = "",
    limite: int = 25,
) -> str:
    """Busca antecedentes históricos en SECOP I."""
    data = globals()["buscar_secop1"](query, departamento, entidad, limite)
    return json.dumps(data, ensure_ascii=False, indent=2)


@mcp.tool()
def buscar_secop2(
    query: str = "",
    departamento: str = "",
    entidad: str = "",
    solo_vigentes: bool = False,
    limite: int = 25,
) -> str:
    """Busca procesos en SECOP II, opcionalmente solo con fecha de recepción futura."""
    data = globals()["buscar_secop2"](query, departamento, entidad, solo_vigentes, limite)
    return json.dumps(data, ensure_ascii=False, indent=2)


@mcp.tool()
def buscar_contratos_secop2_tool(
    query: str = "",
    departamento: str = "",
    entidad: str = "",
    limite: int = 25,
) -> str:
    """Busca contratos electrónicos de SECOP II."""
    data = buscar_contratos_secop2(query, departamento, entidad, limite)
    return json.dumps(data, ensure_ascii=False, indent=2)


@mcp.tool()
def buscar_paa_tool(query: str = "", limite: int = 25) -> str:
    """Busca en el Plan Anual de Adquisiciones."""
    data = buscar_paa(query, limite)
    return json.dumps(data, ensure_ascii=False, indent=2)


if __name__ == "__main__":
    mcp.run()
