/* ============================================================
   MÓDULO 1 · APERTURA
   Portada y pregunta de arranque.
   ============================================================ */
(function () {
  "use strict";
  window.PANTALLAS = window.PANTALLAS || [];

  /* ---------------------------------------------------------
     P01 · PORTADA
     --------------------------------------------------------- */
  window.PANTALLAS.push({
    id: "portada",
    tema: "origenes",
    sinCabecera: true,
    marcoClase: "marco--pleno",
    html: function () {
      return `
      <div class="portada">
        <canvas class="portada-red" id="red-portada" aria-hidden="true"></canvas>
        <div class="portada-txt">
          <span class="kicker" data-rev="60">Capacitación institucional · Sector salud</span>
          <h1 class="titulo portada-titulo" data-rev="180">
            INTELIGENCIA<br /><span class="brillo">ARTIFICIAL</span>
          </h1>
          <p class="portada-sub" data-rev="420">
            Del concepto a su aplicación en el sector salud colombiano
          </p>
          <p class="portada-cita" data-rev="640">
            «Una tecnología que está transformando la manera en que analizamos información,
            tomamos decisiones y administramos organizaciones.»
          </p>
          <div class="portada-pie" data-rev="860">
            <span class="chip chip--acento">Qué es</span>
            <span class="chip">Cómo surgió</span>
            <span class="chip">Cómo funciona</span>
            <span class="chip">Cómo se aplica en clínicas y hospitales</span>
          </div>
        </div>
      </div>`;
    },
    nota: 'Recorra la capacitación con los botones <strong>Atrás</strong> y <strong>Siguiente</strong> de la parte inferior.',
    init: function (raiz) {
      return window.FX.redNeuronal(raiz.querySelector("#red-portada"), { capas: [4, 7, 7, 5, 3] });
    }
  });

  /* ---------------------------------------------------------
     P02 · PREGUNTA DE APERTURA
     --------------------------------------------------------- */
  var IDEAS = [
    "ChatGPT", "Robots", "Algoritmos", "Datos", "Automatización",
    "Reconocimiento de imágenes", "Predicciones", "Chatbots",
    "Ciencia ficción", "Análisis", "Asistentes de voz", "Recomendaciones"
  ];

  window.PANTALLAS.push({
    id: "pregunta-apertura",
    tema: "origenes",
    modulo: "Punto de partida",
    titulo: "¿Qué creen ustedes que es<br />la Inteligencia Artificial?",
    pregunta: "Antes de una sola definición técnica, vale la pena mirar lo que ya viene a la mente cuando se escucha el término.",
    html: function () {
      var chips = IDEAS.map(function (t, i) {
        return '<span class="idea" style="--id:' + (i * 210 + 400) + '">' + t + "</span>";
      }).join("");
      return `
      <div class="apertura">
        <div class="nube-ideas">${chips}</div>
        <div class="revelacion">
          <p class="revelacion-txt">
            La Inteligencia Artificial es <span class="brillo">mucho más</span> que una herramienta de conversación.
          </p>
          <p class="revelacion-sub">
            Todas esas ideas son piezas de algo más amplio: una familia de técnicas para
            <b>encontrar patrones en los datos</b> y usarlos para clasificar, predecir, generar y recomendar.
          </p>
        </div>
      </div>`;
    },
    nota: 'Durante el recorrido, cada pantalla responde <strong>una sola pregunta</strong>.',
    init: function (raiz, api) {
      var rev = raiz.querySelector(".revelacion");
      var t = setTimeout(function () {
        rev.classList.add("on");
        if (api && api.ajustar) api.ajustar();
      }, window.FX.reducido ? 200 : 3600);
      return function () { clearTimeout(t); };
    }
  });
})();
