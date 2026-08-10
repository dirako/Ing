#!/usr/bin/env python3
"""Empaqueta toda la experiencia en un único archivo HTML autocontenido.

Genera dos salidas a partir de los mismos archivos fuente:

  capacitacion-ia-salud.html   documento completo, listo para abrir con doble
                               clic, copiar a una USB o proyectar sin conexión.
  build/pagina.html            solo el contenido (sin <html>/<head>/<body>),
                               para publicarlo en un servicio que aporta su
                               propio esqueleto HTML.

Uso:  python3 herramientas/generar-version-unica.py
"""
import os
import re

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

CSS = [
    "assets/css/base.css",
    "assets/css/componentes.css",
    "assets/css/pantallas.css",
]

JS = [
    "assets/js/datos/geo-colombia.js",
    "assets/js/datos/fuentes.js",
    "assets/js/fx.js",
    "assets/js/personajes.js",
    "assets/js/pantallas/01-apertura.js",
    "assets/js/pantallas/02-fundamentos.js",
    "assets/js/pantallas/03-motor.js",
    "assets/js/pantallas/04-salud.js",
    "assets/js/pantallas/05-administrativo.js",
    "assets/js/pantallas/06-colombia.js",
    "assets/js/pantallas/07-riesgos-futuro.js",
    "assets/js/motor.js",   # el motor va de último: lee window.PANTALLAS ya completo
]

TITULO = "Inteligencia Artificial · Del concepto a su aplicación en el sector salud colombiano"

FAVICON = (
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E"
    "%3Ccircle cx='32' cy='32' r='30' fill='%23070b1a'/%3E"
    "%3Ccircle cx='32' cy='32' r='9' fill='%2338e1c8'/%3E"
    "%3Cg stroke='%235b8cff' stroke-width='2' fill='none'%3E%3Ccircle cx='32' cy='32' r='19'/%3E"
    "%3Cpath d='M32 13v10M32 41v10M13 32h10M41 32h10'/%3E%3C/g%3E%3C/svg%3E"
)


def leer(ruta):
    with open(os.path.join(RAIZ, ruta), encoding="utf-8") as f:
        return f.read()


def cuerpo_de_index():
    """Extrae del index.html todo lo que va dentro de <body>, sin las etiquetas
    <script> ni <link>, que se reemplazan por el contenido embebido."""
    html = leer("index.html")
    cuerpo = re.search(r"<body>(.*)</body>", html, re.S).group(1)
    cuerpo = re.sub(r"\s*<script src=[^>]*></script>", "", cuerpo)
    cuerpo = re.sub(r"\s*<!--[^>]*-->", "", cuerpo)
    return cuerpo.strip()


def bloques():
    estilos = "\n".join(
        "/* ===== %s ===== */\n%s" % (r, leer(r)) for r in CSS
    )
    guiones = "\n".join(
        "/* ===== %s ===== */\n%s" % (r, leer(r)) for r in JS
    )
    return estilos, guiones


def main():
    estilos, guiones = bloques()
    cuerpo = cuerpo_de_index()

    pagina = (
        "<title>%s</title>\n"
        "<style>\n%s\n</style>\n\n%s\n\n<script>\n%s\n</script>\n"
        % (TITULO, estilos, cuerpo, guiones)
    )

    completo = (
        "<!DOCTYPE html>\n"
        '<html lang="es">\n<head>\n'
        '<meta charset="UTF-8" />\n'
        '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />\n'
        '<meta name="theme-color" content="#04060f" />\n'
        '<meta name="description" content="Experiencia interactiva de capacitación: '
        'Inteligencia Artificial, del concepto a su aplicación en el sector salud colombiano." />\n'
        '<link rel="icon" href="%s" />\n'
        "%s"
        "</head>\n<body>\n%s\n</body>\n</html>\n"
        % (FAVICON, pagina[: pagina.index("\n\n")] + "\n", pagina[pagina.index("\n\n") + 2:])
    )

    destino = os.path.join(RAIZ, "capacitacion-ia-salud.html")
    with open(destino, "w", encoding="utf-8") as f:
        f.write(completo)

    build = os.path.join(RAIZ, "build")
    os.makedirs(build, exist_ok=True)
    with open(os.path.join(build, "pagina.html"), "w", encoding="utf-8") as f:
        f.write(pagina)

    print("capacitacion-ia-salud.html  %6.1f KB" % (len(completo) / 1024))
    print("build/pagina.html           %6.1f KB" % (len(pagina) / 1024))


if __name__ == "__main__":
    main()
