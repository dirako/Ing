#!/usr/bin/env python3
"""Genera paths SVG de los departamentos de Colombia a partir de Natural Earth
(ne_10m_admin_1_states_provinces, dominio publico) usando proyeccion Mercator.
Salida: JS con {codigo, nombre, d} listo para inyectar en el SVG del mapa."""
import json, math, sys

SRC = "ne10_admin1.geojson"
TOL = 0.012          # grados (~1.3 km) para Douglas-Peucker
MIN_RING_AREA = 3e-4 # descarta islotes irrelevantes a escala de pantalla

NOMBRES = {
    "Bogota": "Bogotá D.C.",
    "San Andrés y Providencia": "San Andrés, Providencia y Santa Catalina",
}
# La fuente marca este poligono como "COL-99 (Colombia minor island)" sin nombre:
# corresponde a la isla de Malpelo (jurisdiccion de Valle del Cauca).
POR_ISO = {"CO-X01~": "Isla de Malpelo"}


def perp(p, a, b):
    (x, y), (x1, y1), (x2, y2) = p, a, b
    dx, dy = x2 - x1, y2 - y1
    if dx == 0 and dy == 0:
        return math.hypot(x - x1, y - y1)
    t = max(0.0, min(1.0, ((x - x1) * dx + (y - y1) * dy) / (dx * dx + dy * dy)))
    return math.hypot(x - (x1 + t * dx), y - (y1 + t * dy))


def dp(pts, tol):
    if len(pts) < 3:
        return pts
    dmax, idx = 0.0, 0
    for i in range(1, len(pts) - 1):
        d = perp(pts[i], pts[0], pts[-1])
        if d > dmax:
            dmax, idx = d, i
    if dmax > tol:
        return dp(pts[: idx + 1], tol)[:-1] + dp(pts[idx:], tol)
    return [pts[0], pts[-1]]


def ring_area(ring):
    s = 0.0
    for i in range(len(ring) - 1):
        s += ring[i][0] * ring[i + 1][1] - ring[i + 1][0] * ring[i][1]
    return abs(s) / 2.0


def mercator(lon, lat):
    x = lon
    lat = max(-85.0, min(85.0, lat))
    y = math.degrees(math.log(math.tan(math.pi / 4 + math.radians(lat) / 2)))
    return x, y


def polygons(geom):
    if geom["type"] == "Polygon":
        return [geom["coordinates"]]
    if geom["type"] == "MultiPolygon":
        return geom["coordinates"]
    return []


def main():
    data = json.load(open(SRC))
    feats = [f for f in data["features"] if f["properties"].get("admin") == "Colombia"]

    prepared = []
    for f in feats:
        p = f["properties"]
        name = p.get("name") or p.get("name_es") or p.get("gn_name")
        iso = p.get("iso_3166_2") or ""
        rings_out = []
        for poly in polygons(f["geometry"]):
            for k, ring in enumerate(poly):
                if ring_area(ring) < MIN_RING_AREA:
                    continue
                pts = [mercator(c[0], c[1]) for c in ring]
                simp = dp(pts, TOL)
                if len(simp) < 4:
                    continue
                rings_out.append(simp)
        if not rings_out:
            continue
        if iso in POR_ISO:
            name = POR_ISO[iso]
        prepared.append({"iso": iso, "name": NOMBRES.get(name, name), "rings": rings_out})

    xs = [x for d in prepared for r in d["rings"] for x, y in r]
    ys = [y for d in prepared for r in d["rings"] for x, y in r]
    minx, maxx, miny, maxy = min(xs), max(xs), min(ys), max(ys)
    W = 1000.0
    scale = W / (maxx - minx)
    H = (maxy - miny) * scale

    def tosvg(rings):
        out = []
        for r in rings:
            seg = []
            for i, (x, y) in enumerate(r):
                px = (x - minx) * scale
                py = (maxy - y) * scale
                seg.append(("M" if i == 0 else "L") + f"{px:.1f} {py:.1f}")
            out.append("".join(seg) + "Z")
        return "".join(out)

    deps = []
    for d in sorted(prepared, key=lambda z: z["name"]):
        deps.append({"iso": d["iso"], "nombre": d["name"], "d": tosvg(d["rings"])})

    payload = {
        "viewBox": f"0 0 {W:.0f} {H:.1f}",
        "fuente": "Natural Earth 1:10m Admin 1 – States, Provinces (dominio público)",
        "departamentos": deps,
    }
    js = "window.GEO_COLOMBIA = " + json.dumps(payload, ensure_ascii=False, separators=(",", ":")) + ";\n"
    open("geo-colombia.js", "w", encoding="utf-8").write(js)
    print("departamentos:", len(deps), "viewBox:", payload["viewBox"], "bytes:", len(js))


if __name__ == "__main__":
    sys.setrecursionlimit(100000)
    main()
