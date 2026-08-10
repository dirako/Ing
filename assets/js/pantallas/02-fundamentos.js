/* ============================================================
   MÓDULO 2 · FUNDAMENTOS
   Qué es, qué puede hacer, qué no es, de dónde viene y cómo evolucionó.
   ============================================================ */
(function () {
  "use strict";
  window.PANTALLAS = window.PANTALLAS || [];

  /* ---------------------------------------------------------
     P03 · ¿QUÉ ES LA INTELIGENCIA ARTIFICIAL?
     --------------------------------------------------------- */
  var CADENA = [
    { t: "DATOS", s: "Registros, textos, imágenes, mediciones" },
    { t: "ALGORITMOS", s: "Reglas matemáticas de aprendizaje" },
    { t: "PROCESAMIENTO", s: "Entrenamiento y cálculo" },
    { t: "PATRONES", s: "Regularidades que se repiten" },
    { t: "RESULTADOS", s: "Clasificación, predicción, generación" }
  ];

  window.PANTALLAS.push({
    id: "que-es",
    tema: "motor",
    modulo: "Fundamentos · 01",
    titulo: "¿Qué es la Inteligencia Artificial?",
    pregunta: "Primero en palabras sencillas. Después, con precisión técnica.",
    html: function () {
      var pasos = CADENA.map(function (p, i) {
        return (
          '<div class="paso' + (i === CADENA.length - 1 ? " paso--ia" : "") + '">' +
          "<span>" + p.t + "</span><small>" + p.s + "</small></div>" +
          (i < CADENA.length - 1
            ? '<div class="conector"><i class="pulso" style="--pd:' + i * 340 + '"></i></div>'
            : "")
        );
      }).join("");

      return `
      <div class="columna">
        <div class="rejilla" data-col="2" data-rev>
          <div class="tarjeta tarjeta--dest">
            <h3><span class="icono">🗣️</span> En palabras sencillas</h3>
            <p>Es un conjunto de programas que <b>aprenden de ejemplos</b> en lugar de recibir todas las
            instrucciones escritas por una persona. Al ver muchos casos, encuentran regularidades y las
            usan para responder ante casos nuevos.</p>
          </div>
          <div class="tarjeta">
            <h3><span class="icono">📐</span> En términos técnicos</h3>
            <p>Campo de la computación que construye <b>sistemas capaces de ejecutar tareas que
            requieren inferencia</b>: a partir de datos de entrada, un modelo ajustado estadísticamente
            produce salidas —clasificaciones, predicciones o contenido— con un grado de incertidumbre asociado.</p>
          </div>
        </div>

        <div class="flujo-marco" data-rev>
          <div class="flujo">${pasos}</div>
        </div>

        <div class="aviso aviso--clave" data-rev>
          <span class="marca">🔑</span>
          <p style="margin:0">Sin <b>datos</b> no hay inteligencia artificial. La calidad de la salida
          nunca es mejor que la calidad de la información que entró.</p>
        </div>
      </div>`;
    }
  });

  /* ---------------------------------------------------------
     P04 · QUÉ PUEDE HACER
     --------------------------------------------------------- */
  var CAPACIDADES = [
    { i: "🗂️", t: "Clasificación", d: "Asignar una categoría: urgente / no urgente, riesgo alto / bajo." },
    { i: "🔎", t: "Reconocimiento", d: "Identificar objetos, textos, voces o hallazgos en una imagen." },
    { i: "📈", t: "Predicción", d: "Estimar un valor o un evento futuro a partir del histórico." },
    { i: "✍️", t: "Generación", d: "Producir texto, imágenes, audio, código o documentos nuevos." },
    { i: "🎯", t: "Recomendación", d: "Sugerir la siguiente acción más pertinente según el contexto." },
    { i: "💬", t: "Lenguaje", d: "Leer, resumir, traducir y estructurar texto no estructurado." },
    { i: "🧮", t: "Análisis", d: "Detectar anomalías, agrupar casos y explicar comportamientos." }
  ];

  window.PANTALLAS.push({
    id: "capacidades",
    tema: "motor",
    modulo: "Fundamentos · 02",
    titulo: "¿Qué tipo de tareas puede realizar?",
    pregunta: "No es una sola habilidad: es una familia de capacidades que se combinan según el problema.",
    html: function () {
      return (
        '<div class="rejilla" data-col="auto">' +
        CAPACIDADES.map(function (c) {
          return (
            '<div class="tarjeta" data-rev><h3><span class="icono">' + c.i + "</span>" + c.t + "</h3>" +
            "<p>" + c.d + "</p></div>"
          );
        }).join("") +
        "</div>" +
        '<div class="aviso" data-rev><span class="marca">🏥</span><p style="margin:0">' +
        "En una institución de salud rara vez se usa una sola: una alerta de riesgo combina " +
        "<b>análisis + predicción + recomendación</b>, y una respuesta a PQRS combina " +
        "<b>lenguaje + clasificación + generación</b>.</p></div>"
      );
    }
  });

  /* ---------------------------------------------------------
     P05 · QUÉ NO ES INTELIGENCIA ARTIFICIAL
     --------------------------------------------------------- */
  var NOES = [
    { t: "magia", d: "Todo lo que hace se puede explicar con datos, matemáticas y cómputo." },
    { t: "conciencia", d: "No tiene intenciones, voluntad ni comprensión de sí misma." },
    { t: "inteligencia humana", d: "No razona ni entiende el mundo como una persona." },
    { t: "verdad absoluta", d: "Produce respuestas probables, no respuestas verificadas." },
    { t: "automatización simple", d: "La automatización sigue reglas fijas; la IA infiere a partir de datos." }
  ];

  window.PANTALLAS.push({
    id: "que-no-es",
    tema: "motor",
    modulo: "Fundamentos · 03",
    titulo: "¿Qué <span class=\"brillo\">no</span> es Inteligencia Artificial?",
    pregunta: "Despejar los malentendidos es tan importante como aprender la definición.",
    html: function () {
      return (
        '<div class="noes">' +
        NOES.map(function (n) {
          return (
            '<div class="noe" data-rev><span class="noe-eq">IA <b>≠</b> ' + n.t + "</span>" +
            "<p>" + n.d + "</p></div>"
          );
        }).join("") +
        "</div>" +
        '<div class="aviso aviso--alerta" data-rev><span class="marca">⚠️</span><p style="margin:0">' +
        "Un sistema de IA <b>puede producir resultados incorrectos y sonar convincente al hacerlo</b>. " +
        "Cuando inventa información que parece cierta, hablamos de <b>alucinación</b>: lo veremos con un ejemplo.</p></div>"
      );
    }
  });

  /* ---------------------------------------------------------
     P06 · ORÍGENES · LÍNEA DE TIEMPO
     --------------------------------------------------------- */
  window.PANTALLAS.push({
    id: "origenes",
    tema: "origenes",
    modulo: "Fundamentos · 04",
    titulo: "¿De dónde surge la Inteligencia Artificial?",
    pregunta: "No nació en 2022. Es el resultado de setenta años de investigación, con avances, frenos y reinicios.",
    html: function () {
      var h = window.FUENTES.hitos;
      var mitad = Math.ceil(h.length / 2);
      function fila(items, base) {
        return (
          '<div class="rail">' +
          '<div class="rail-linea"><i class="rail-pulso"></i></div>' +
          '<div class="rail-hitos">' +
          items.map(function (x, i) {
            return (
              '<div class="rail-hito' + (x.fuerte ? " rail-hito--fuerte" : "") +
              '" data-rev="' + (base + i * 85) + '">' +
              '<span class="punto"></span>' +
              '<span class="anio">' + x.anio + "</span>" +
              '<span class="txt">' + x.txt + "</span></div>"
            );
          }).join("") +
          "</div></div>"
        );
      }
      return (
        '<div class="tiempo-doble">' +
        fila(h.slice(0, mitad), 150) +
        fila(h.slice(mitad), 150 + mitad * 85) +
        "</div>"
      );
    },
    nota: 'Los hitos marcados en color son <strong>puntos de inflexión</strong>: cambian lo que la tecnología puede hacer, no solo su velocidad.'
  });

  /* ---------------------------------------------------------
     P07 · EVOLUCIÓN CONCEPTUAL
     --------------------------------------------------------- */
  var ESCALONES = [
    { t: "Programación tradicional", d: "Una persona escribe todas las reglas. El programa hace exactamente lo indicado.", e: "Si el valor es mayor a X, rechace." },
    { t: "Automatización", d: "Esas reglas se ejecutan solas, a gran escala y sin intervención.", e: "Radicar 5.000 facturas cada noche." },
    { t: "Machine Learning", d: "El sistema aprende las reglas a partir de ejemplos históricos.", e: "Aprender qué facturas se devolvieron." },
    { t: "Deep Learning", d: "Redes de muchas capas aprenden representaciones complejas: imagen, voz, texto.", e: "Detectar un hallazgo en una radiografía." },
    { t: "Transformers", d: "Una arquitectura que pesa el contexto completo de una secuencia.", e: "Entender una evolución clínica larga." },
    { t: "IA generativa", d: "Modelos que producen contenido nuevo a partir de una instrucción.", e: "Redactar un borrador de respuesta." },
    { t: "Agentes de IA", d: "Reciben un objetivo, planean, usan herramientas y ejecutan pasos con verificación.", e: "Revisar un lote de cuentas y priorizarlo." }
  ];

  window.PANTALLAS.push({
    id: "evolucion",
    tema: "motor",
    modulo: "Fundamentos · 05",
    titulo: "¿Cómo evolucionó hasta lo que usamos hoy?",
    pregunta: "Cada escalón no reemplaza al anterior: lo incorpora. Hoy conviven los siete en una misma institución.",
    html: function () {
      return (
        '<div class="escalera">' +
        ESCALONES.map(function (s, i) {
          return (
            '<div class="escalon" style="--n:' + i + '" data-rev="' + (140 + i * 150) + '">' +
            '<span class="escalon-num">' + (i + 1) + "</span>" +
            '<h3>' + s.t + "</h3>" +
            "<p>" + s.d + "</p>" +
            '<span class="escalon-ej">' + s.e + "</span>" +
            "</div>"
          );
        }).join("") +
        "</div>"
      );
    },
    nota: 'La diferencia clave: <strong>de ejecutar reglas escritas</strong> a <strong>inferir reglas desde los datos</strong> y, finalmente, a <strong>encadenar acciones hacia un objetivo</strong>.'
  });
})();
