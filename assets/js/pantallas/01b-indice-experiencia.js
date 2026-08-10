/* ============================================================
   PANTALLAS 3 y 4 · ÍNDICE Y EXPERIENCIA
   Se insertan justo después de la portada, sin alterar el resto
   del recorrido.
   ============================================================ */
(function () {
  "use strict";
  window.PANTALLAS = window.PANTALLAS || [];

  var A = window.AUTOR || {};

  /* ---------------------------------------------------------
     TABLA DE CONTENIDO
     Es un índice de lectura, no un menú: no lleva enlaces ni
     permite saltar de capítulo.
     --------------------------------------------------------- */
  var MODULOS = [
    { n: "01", t: "Fundamentos", d: "Qué es, qué no es, de dónde viene y cómo evolucionó." },
    { n: "02", t: "Cómo funciona", d: "Aprendizaje, redes neuronales, Transformers, IA generativa y agentes." },
    { n: "03", t: "IA en la atención clínica", d: "Apoyo diagnóstico, riesgo, seguimiento y un ejemplo completo." },
    { n: "04", t: "IA en la administración", d: "Facturación, RIPS, glosas, cartera, farmacia, PQRS y gerencia." },
    { n: "05", t: "Colombia", d: "Cifras verificables, territorio, casos y marco normativo vigente." },
    { n: "06", t: "Riesgos y personas", d: "Alucinaciones, sesgos, control humano y el efecto sobre el trabajo." }
  ];

  var indice = {
    id: "indice",
    tema: "origenes",
    modulo: "Recorrido",
    titulo: "Lo que veremos",
    pregunta: "Seis bloques, de lo más simple a lo más aplicado. Cada pantalla responde una sola pregunta.",
    html: function () {
      return (
        '<div class="indice">' +
        MODULOS.map(function (m, i) {
          return '<div class="indice-item" data-rev="' + (140 + i * 110) + '">' +
            '<span class="indice-n">' + m.n + "</span>" +
            '<div class="indice-txt"><h3>' + m.t + "</h3><p>" + m.d + "</p></div></div>";
        }).join("") +
        "</div>"
      );
    },
    nota: 'El recorrido avanza de lo conceptual a lo aplicado. No hace falta conocimiento previo de tecnología.'
  };

  /* ---------------------------------------------------------
     EXPERIENCIA Y CASOS
     --------------------------------------------------------- */
  var experiencia = {
    id: "experiencia",
    tema: "origenes",
    modulo: "Quién presenta",
    titulo: "Experiencia y casos en modelos de Inteligencia Artificial",
    pregunta: "Cuatro procesos del sector salud donde estos modelos ya se aplican en el día a día.",
    html: function () {
      var lista = Array.isArray(A.experiencia) ? A.experiencia : [];
      if (!lista.length) return '<p class="sin-dato">Defina sus áreas en assets/js/datos/autor.js</p>';

      var tarjetas = lista.map(function (e, i) {
        var caso = (typeof e.caso === "string" && e.caso.trim() !== "")
          ? '<p class="exp-caso"><b>Caso</b>' + e.caso.trim() + "</p>"
          : '<p class="exp-pendiente">Escriba aquí su caso y su resultado ' +
            '<span class="mono">(autor.js → experiencia)</span></p>';
        return '<div class="exp" data-rev="' + (140 + i * 120) + '">' +
          '<span class="exp-i">' + (e.icono || "◆") + "</span>" +
          "<h3>" + e.area + "</h3>" +
          '<p class="exp-trabajo">' + e.trabajo + "</p>" +
          caso + "</div>";
      }).join("");

      var quien = "";
      if (A.nombre) {
        quien = '<p class="exp-quien" data-rev>' +
          "<b>" + A.nombre + "</b>" +
          (A.cargo ? '<span>' + A.cargo + "</span>" : "") + "</p>";
      }

      return '<div class="columna">' + quien +
        '<div class="rejilla" data-col="4">' + tarjetas + "</div></div>";
    },
    nota: 'Las cuatro áreas comparten un requisito previo: <strong>información estructurada y confiable</strong>. Sin eso, no hay modelo que funcione.'
  };

  /* Se insertan inmediatamente después de la portada */
  var pos = 0;
  for (var i = 0; i < window.PANTALLAS.length; i++) {
    if (window.PANTALLAS[i].id === "portada") { pos = i + 1; break; }
  }
  window.PANTALLAS.splice(pos, 0, indice, experiencia);
})();
