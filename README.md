# Inteligencia Artificial: del concepto a su aplicación en el sector salud

Experiencia web interactiva de capacitación sobre inteligencia artificial aplicada
al sector salud colombiano. Funciona como una presentación por pantallas completas:
sin menús, sin barra de navegación, sin scroll y con solo dos controles visibles.

**Subtítulo:** *Qué es, cómo surgió, cómo funciona y cómo puede transformar clínicas,
hospitales y procesos administrativos en Colombia.*

---

## Cómo se ejecuta

No requiere compilación, servidor ni conexión a internet.

```bash
# Opción 1 · abrir directamente
xdg-open index.html          # (o doble clic en el archivo)

# Opción 2 · servidor local, recomendado para proyección
npx http-server . -p 8080
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
| `Pantalla X de 34` | Contador discreto |
| Barra de progreso | **No es interactiva** (`pointer-events: none`) |

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
distribuido en 34 pantallas precisamente para no depender de ella. Verificación
automatizada en 1920×1080, 1366×768, 1024×768 y 390×844: sin scroll vertical ni
horizontal, sin desbordes y sin errores de JavaScript en ninguna de las 34 pantallas.

---

## Estructura

```
index.html
assets/
  css/
    base.css          tokens, temas cromáticos por módulo, layout, navegación
    componentes.css   tarjetas, flujos, líneas de tiempo, barras, avisos
    pantallas.css     estilos propios de cada pantalla + responsive
  js/
    motor.js          motor de pantallas, transiciones, ajuste y navegación
    fx.js             partículas, contadores, escritura progresiva, red neuronal
    personajes.js     NOVA y las siluetas de los personajes recurrentes
    datos/
      fuentes.js      indicadores, normas, casos e hitos con año y fuente
      geo-colombia.js geometría real de Colombia (generada, no dibujada a mano)
    pantallas/
      01-apertura.js … 07-riesgos-futuro.js
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

## Recorrido (34 pantallas)

| # | Pantalla | Módulo |
|---|---|---|
| 1-2 | Portada · ¿Qué creen que es la IA? | Apertura |
| 3-7 | Qué es · Qué puede hacer · Qué no es · Orígenes · Evolución | Fundamentos |
| 8-13 | Cómo aprende · Redes neuronales · Transformers · IA generativa · Automatización vs IA vs agente · Usos actuales | Cómo funciona |
| 14-16 | Los dos mundos del hospital · IA asistencial · Ejemplo clínico | Salud |
| 17-24 | Procesos administrativos · Facturación · RIPS · Glosas · Cartera · Farmacia · PQRS · Gerencia | Administración |
| 25-28 | Colombia en cifras · Mapa · Casos · Marco normativo | Colombia |
| 29-34 | Riesgos · Alucinación · ¿Reemplazará a las personas? · Ruta de adopción · Cierre · Fuentes | Riesgos y futuro |

Son 34 y no 30 porque el temario cubre 26 procesos administrativos y cuatro bloques
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

## Accesibilidad

- Respeta `prefers-reduced-motion`: desactiva partículas y transiciones.
- Botones con `:focus-visible`, estados `disabled` reales y etiquetas ARIA por pantalla.
- Contraste alto sobre fondos oscuros en los ocho temas cromáticos.
