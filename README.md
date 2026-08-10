# Inteligencia Artificial: del concepto a su aplicación en el sector salud

Experiencia web interactiva de capacitación sobre inteligencia artificial aplicada
al sector salud colombiano. Funciona como una presentación por pantallas completas:
sin menús, sin barra de navegación, sin scroll y con solo dos controles visibles.

**Subtítulo:** *Qué es, cómo surgió, cómo funciona y cómo puede transformar clínicas,
hospitales y procesos administrativos en Colombia.*

---

## Cómo verla

No requiere compilación, servidor ni conexión a internet.

**La forma más simple.** Descargue `capacitacion-ia-salud.html` y ábralo con doble clic.
Es un único archivo con todo adentro —estilos, código, mapa e ilustraciones— así que
funciona desde una USB, sin instalar nada y sin red. Es la opción recomendada para
proyectar en una sala.

**Desde el repositorio completo.**

```bash
git clone -b claude/ia-salud-colombia-platform-55d410 https://github.com/dirako/Ing.git
cd Ing

# abrir directamente
xdg-open index.html            # macOS: open index.html · Windows: start index.html

# o con un servidor local
npx http-server . -p 8080
```

**Regenerar el archivo único** después de editar cualquier pantalla:

```bash
python3 herramientas/generar-version-unica.py
```

Todo el código es HTML, CSS y JavaScript sin dependencias externas ni CDN, de modo
que la capacitación puede dictarse en una sala sin red.

---

## Navegación

La única navegación visible son los dos botones inferiores:

| Control | Comportamiento |
|---|---|
| **← Atrás** | Deshabilitado en la primera pantalla |
| **Siguiente →** | Se oculta en la última pantalla |
| `Pantalla X de 38` | Contador discreto |
| Barra de progreso | **No es interactiva** (`pointer-events: none`) |

La sesión abre con una **pantalla de aviso previo** —carácter educativo del espacio,
responsabilidad individual en el uso de la IA en el trabajo, manejo de información
reservada y verificación obligatoria— y cierra con los **datos de contacto** del expositor.

No hay menú lateral, ni menú hamburguesa, ni enlaces de capítulo, ni scroll para
cambiar de pantalla.

Como apoyo para proyección existe un **espejo de teclado** (`←` `→` `espacio`), que no
añade ningún elemento a la interfaz. Se desactiva con una sola línea:
`assets/js/motor.js` → `var TECLADO = false;`

---

## Diseño responsive sin scroll

Cada pantalla ocupa el área disponible del dispositivo. El motor:

1. calcula un tamaño tipográfico raíz en función del viewport (`calcularRaiz`);
2. las rejillas se recomponen por *media queries* en tableta y celular;
3. si aun así el contenido excede el alto disponible, `ajustar()` aplica una
   reducción proporcional al marco, de forma que **nada se recorta y nunca aparece scroll**.

La reducción es una red de seguridad, no el mecanismo principal: el contenido está
distribuido en 38 pantallas precisamente para no depender de ella. Verificación
automatizada en 1920×1080, 1366×768, 1024×768 y 390×844: sin scroll vertical ni
horizontal, sin desbordes y sin errores de JavaScript en ninguna de las 38 pantallas.

---

## Estructura

```
index.html
assets/
  css/
    base.css          tokens, layout, navegación (identidad oscura original)
    claro.css         identidad clara: fondo blanco, títulos y negrilla en azul
    componentes.css   tarjetas, flujos, líneas de tiempo, barras, avisos
    pantallas.css     estilos propios de cada pantalla + responsive
  js/
    motor.js          motor de pantallas, transiciones, ajuste y navegación
    fx.js             partículas, contadores, escritura progresiva, red neuronal
    personajes.js     NOVA y las siluetas de los personajes recurrentes
    datos/
      fuentes.js      indicadores, normas, casos e hitos con año y fuente
      autor.js        datos de contacto de la pantalla final
      geo-colombia.js geometría real de Colombia (generada, no dibujada a mano)
    pantallas/
      00-aviso.js … 08-contacto.js (01b añade índice y experiencia)
herramientas/
  generar-mapa-colombia.py
```

Cada archivo de `pantallas/` empuja objetos a `window.PANTALLAS`. Añadir una pantalla
es añadir un objeto; el motor se encarga del resto.

```js
window.PANTALLAS.push({
  id: "mi-pantalla",
  tema: "salud",            // origenes | motor | generativa | salud | admin | colombia | riesgo | futuro
  modulo: "Salud · 04",
  titulo: "¿Pregunta que responde esta pantalla?",
  pregunta: "Bajada breve.",
  html: function () { return "<div>…</div>"; },
  nota: "Pie de pantalla.",
  init: function (raiz, api) { /* animaciones; puede devolver una función de limpieza */ }
});
```

---

## Recorrido (38 pantallas)

| # | Pantalla | Módulo |
|---|---|---|
| 1 | Antes de comenzar (aviso previo) | Encuadre |
| 2 | Portada | Apertura |
| 3-4 | Lo que veremos (índice) · Experiencia y casos del expositor | Apertura |
| 5 | ¿Qué creen que es la IA? | Apertura |
| 6-10 | Qué es · Qué puede hacer · Qué no es · Orígenes · Evolución | Fundamentos |
| 11-16 | Cómo aprende · Redes neuronales · Transformers · IA generativa · Automatización vs IA vs agente · Usos actuales | Cómo funciona |
| 17-19 | Los dos mundos del hospital · IA asistencial · Ejemplo clínico | Salud |
| 20-27 | Procesos administrativos · Facturación · RIPS · Glosas · Cartera · Farmacia · PQRS · Gerencia | Administración |
| 28-31 | Colombia en cifras · Mapa · Casos · Marco normativo | Colombia |
| 32-37 | Riesgos · Alucinación · ¿Reemplazará a las personas? · Ruta de adopción · Cierre · Fuentes | Riesgos y futuro |
| 38 | Contacto | Cierre |

Son 38 y no 30 porque el temario cubre 26 procesos administrativos y cuatro bloques
normativos: comprimirlos habría significado saturar pantallas o reducir la tipografía,
que es justamente lo que se debía evitar.

---

## Datos, normas y verificación

Toda cifra o norma se presenta con **valor, año, fuente y fecha de consulta**, y está
centralizada en `assets/js/datos/fuentes.js`. Para actualizar la capacitación se edita
ese archivo únicamente.

Cuando no fue posible identificar un dato oficial suficientemente actualizado, la
pantalla lo declara como **«Dato oficial actualizado no identificado»** en lugar de
estimarlo. Los casos de uso se clasifican en *implementado*, *piloto*, *investigación*
o *propuesta*, y no se atribuye ninguna tecnología a una institución sin respaldo documental.

**Fecha de consulta del bloque de fuentes: 9 de agosto de 2026.** La normatividad del
RIPS y de la historia clínica interoperable ha cambiado varias veces en pocos años:
revalide la vigencia antes de cada sesión.

Advertencias declaradas dentro de la propia experiencia:

- las cifras de tableros, cartera y ejemplos clínicos son **ilustrativas**;
- la resolución citada en el ejemplo de alucinación es **ficticia por diseño**;
- el material es pedagógico y **no constituye asesoría jurídica**.

---

## Mapa de Colombia

La silueta **no está dibujada a mano**. Se genera a partir de
*Natural Earth 1:10m Admin 1 – States, Provinces* (dominio público), filtrando los
34 polígonos de Colombia, simplificándolos con Douglas–Peucker y proyectándolos en
Mercator a coordenadas SVG:

```bash
cd herramientas
curl -sSL -o ne10_admin1.geojson \
  https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_10m_admin_1_states_provinces.geojson
python3 generar-mapa-colombia.py    # produce geo-colombia.js
```

El mapa muestra únicamente geografía: **no incluye indicadores departamentales**.

---

## Datos de contacto de la pantalla final

Se editan en un solo lugar, `assets/js/datos/autor.js`. Los campos que se dejen
vacíos no se muestran, de modo que la tarjeta se adapta a lo que quiera exponer:

```js
window.AUTOR = {
  nombre: "", cargo: "", institucion: "", ciudad: "",
  correo: "", telefono: "", linkedin: "", web: "",
  mensaje: "…"
};
```

---

## Identidad visual

La presentación usa fondo **blanco** en todas las pantallas, **títulos y negrilla en
azul**, **texto corrido en negro** y **texto blanco sobre los bloques de fondo azul**.
Las animaciones se conservan íntegras; el contraste lo dan el color del texto, los
bordes y las sombras.

La identidad oscura original sigue disponible sin borrar nada: basta cambiar la
primera línea de `index.html` por

```html
<html lang="es" data-aspecto="oscuro">
```

y toda la hoja `claro.css` deja de aplicar.

---

## Accesibilidad

- Respeta `prefers-reduced-motion`: desactiva partículas y transiciones.
- Botones con `:focus-visible`, estados `disabled` reales y etiquetas ARIA por pantalla.
- Contraste alto sobre fondos oscuros en los ocho temas cromáticos.
