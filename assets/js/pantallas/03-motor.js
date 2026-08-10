/* ============================================================
   MÓDULO 3 · CÓMO FUNCIONA
   Aprendizaje, redes neuronales, Transformers, IA generativa,
   agentes y usos actuales.
   ============================================================ */
(function () {
  "use strict";
  window.PANTALLAS = window.PANTALLAS || [];

  /* ---------------------------------------------------------
     P08 · ¿CÓMO APRENDE UNA IA?
     --------------------------------------------------------- */
  window.PANTALLAS.push({
    id: "como-aprende",
    tema: "motor",
    modulo: "Cómo funciona · 01",
    titulo: "¿Cómo aprende una Inteligencia Artificial?",
    pregunta: "Con ejemplos. Muchos. Y con una respuesta que nunca es un “sí” rotundo, sino una probabilidad.",
    html: function () {
      var ejemplos = ["🐕", "🐩", "🐕‍🦺", "🦮", "🐈", "🐇", "🐦", "🐈‍⬛", "🐕", "🐎", "🐕", "🐿️"];
      var etiquetas = [1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 1, 0];
      var galeria = ejemplos.map(function (e, i) {
        return '<span class="muestra ' + (etiquetas[i] ? "muestra--si" : "muestra--no") +
          '" style="--md:' + (i * 90) + '">' + e + "</span>";
      }).join("");

      return `
      <div class="aprende">
        <div class="aprende-col">
          <h3 class="sub">1 · Entrenamiento</h3>
          <p class="txt">Se muestran miles de ejemplos <b>ya etiquetados</b>: esto es un perro, esto no lo es.</p>
          <div class="galeria">${galeria}</div>
          <div class="flujo flujo--mini">
            <div class="paso">Datos<small>ejemplos</small></div><div class="conector"><i class="pulso"></i></div>
            <div class="paso">Características<small>formas, texturas</small></div><div class="conector"><i class="pulso" style="--pd:300"></i></div>
            <div class="paso">Patrones<small>lo que se repite</small></div>
          </div>
        </div>

        <div class="aprende-col">
          <h3 class="sub">2 · Uso sobre un caso nuevo</h3>
          <div class="consulta">
            <span class="consulta-img">🐕</span>
            <p class="consulta-q">«¿Esto es un perro?»</p>
          </div>
          <div class="barras">
            <div class="barra barra--principal"><span>Perro</span>
              <span class="pista"><b class="relleno" data-pct="97"></b></span><span class="pct">97 %</span></div>
            <div class="barra"><span>Gato</span>
              <span class="pista"><b class="relleno" data-pct="2"></b></span><span class="pct">2 %</span></div>
            <div class="barra"><span>Otro</span>
              <span class="pista"><b class="relleno" data-pct="1"></b></span><span class="pct">1 %</span></div>
          </div>
          <div class="aviso aviso--clave">
            <span class="marca">📊</span>
            <p style="margin:0">La IA <b>no afirma</b>: estima. Muchos sistemas de IA trabajan con
            <b>modelos matemáticos y probabilísticos</b>, y por eso siempre existe un margen de error.</p>
          </div>
        </div>
      </div>`;
    },
    nota: 'Cambie “perro” por “hallazgo en una imagen” o “factura con riesgo de devolución” y tendrá el mismo mecanismo aplicado a salud.',
    init: function (raiz) {
      window.FX.activarBarras(raiz, 900);
    }
  });

  /* ---------------------------------------------------------
     P09 · REDES NEURONALES
     --------------------------------------------------------- */
  window.PANTALLAS.push({
    id: "redes-neuronales",
    tema: "motor",
    modulo: "Cómo funciona · 02",
    titulo: "¿Qué es una red neuronal artificial?",
    pregunta: "Una estructura matemática por capas donde cada conexión tiene un peso que se ajusta durante el entrenamiento.",
    html: function () {
      var capas = [4, 6, 6, 3];
      var W = 620, H = 260, mx = 70, my = 26;
      var paso = (W - mx * 2) / (capas.length - 1);
      var pos = [], svg = "", idx = 0;

      for (var c = 0; c < capas.length; c++) {
        var n = capas[c], col = [];
        for (var i = 0; i < n; i++) {
          col.push({ x: mx + paso * c, y: my + ((H - my * 2) * (n === 1 ? 0.5 : i / (n - 1))), id: idx++ });
        }
        pos.push(col);
      }
      /* conexiones */
      var d = 0;
      for (var c2 = 0; c2 < pos.length - 1; c2++) {
        for (var a = 0; a < pos[c2].length; a++) {
          for (var b = 0; b < pos[c2 + 1].length; b++) {
            svg += '<line x1="' + pos[c2][a].x + '" y1="' + pos[c2][a].y.toFixed(1) +
              '" x2="' + pos[c2 + 1][b].x + '" y2="' + pos[c2 + 1][b].y.toFixed(1) +
              '" stroke="var(--acento)" stroke-width="0.7" opacity="0.28" class="trazo-anim" style="--td:' +
              (200 + d * 9) + '"/>';
            d++;
          }
        }
      }
      /* nodos */
      for (var c3 = 0; c3 < pos.length; c3++) {
        for (var k = 0; k < pos[c3].length; k++) {
          var esBorde = c3 === 0 || c3 === pos.length - 1;
          svg += '<circle cx="' + pos[c3][k].x + '" cy="' + pos[c3][k].y.toFixed(1) + '" r="7" fill="' +
            (c3 === 0 ? "var(--acento)" : c3 === pos.length - 1 ? "var(--acento-3)" : "var(--acento-2)") +
            '" opacity="' + (esBorde ? 0.95 : 0.8) + '"><animate attributeName="opacity" values="' +
            (esBorde ? "0.95;0.6;0.95" : "0.8;0.35;0.8") + '" dur="' + (2.4 + k * 0.3).toFixed(1) +
            's" repeatCount="indefinite"/></circle>';
        }
      }
      /* rótulos */
      svg += '<text x="' + mx + '" y="' + (H - 2) + '" class="rn-rotulo" text-anchor="middle">Capa de entrada</text>';
      svg += '<text x="' + (mx + paso * 1.5) + '" y="' + (H - 2) + '" class="rn-rotulo" text-anchor="middle">Capas intermedias</text>';
      svg += '<text x="' + (W - mx) + '" y="' + (H - 2) + '" class="rn-rotulo" text-anchor="middle">Capa de salida</text>';

      return `
      <div class="redes">
        <div class="redes-graf">
          <svg class="svg-lienzo" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet" aria-label="Diagrama de una red neuronal con capa de entrada, capas intermedias y capa de salida">${svg}</svg>
        </div>
        <div class="rejilla" data-col="3">
          <div class="tarjeta" data-rev><h3>Entrada</h3><p>Los datos del caso: valores de laboratorio, píxeles de una imagen, campos de una factura.</p></div>
          <div class="tarjeta" data-rev><h3>Capas intermedias</h3><p>Cada capa combina la anterior y detecta rasgos cada vez más abstractos. Los <b>pesos</b> se ajustan con los errores cometidos durante el entrenamiento.</p></div>
          <div class="tarjeta" data-rev><h3>Salida</h3><p>Un valor o una distribución de probabilidades sobre las categorías posibles.</p></div>
        </div>
        <div class="aviso aviso--alerta" data-rev><span class="marca">🧠</span><p style="margin:0">
          El nombre viene de una <b>analogía</b> con las neuronas biológicas. Una red neuronal artificial
          <b>no funciona como un cerebro humano</b>: es álgebra lineal y optimización, no biología.</p></div>
      </div>`;
    }
  });

  /* ---------------------------------------------------------
     P10 · TRANSFORMERS
     --------------------------------------------------------- */
  var FRASE = ["Paciente", "con", "dolor", "torácico", "y", "antecedente", "de", "hipertensión"];
  /* pares de atención: [origen, destino, peso] */
  var ATENCION = [[3, 2, 1], [5, 7, 1], [7, 2, 0.6], [2, 0, 0.5], [5, 0, 0.4]];

  window.PANTALLAS.push({
    id: "transformers",
    tema: "motor",
    modulo: "Cómo funciona · 03",
    titulo: "¿Qué es un <span class=\"brillo\">Transformer</span>?",
    pregunta: "La arquitectura que permitió a las máquinas tener en cuenta el contexto completo de una frase, no solo la palabra anterior.",
    html: function () {
      var toks = FRASE.map(function (t, i) {
        return '<span class="token" data-tok="' + i + '" style="--td:' + (i * 110) + '">' + t +
          '<i class="token-n">' + (i + 1) + "</i></span>";
      }).join("");
      return `
      <div class="transformer">
        <div class="tokens-marco">
          <svg class="atencion" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"></svg>
          <div class="tokens">${toks}</div>
        </div>

        <div class="rejilla" data-col="4">
          <div class="tarjeta" data-rev><h3>1 · Tokens</h3><p>El texto se corta en piezas mínimas. No siempre coinciden con palabras completas.</p></div>
          <div class="tarjeta" data-rev><h3>2 · Contexto</h3><p>Cada token se representa junto con su posición dentro de la secuencia.</p></div>
          <div class="tarjeta tarjeta--dest" data-rev><h3>3 · Atención</h3><p>El modelo calcula <b>cuánto debe mirar cada token a los demás</b>. «Torácico» pesa sobre «dolor»; «hipertensión» sobre «antecedente».</p></div>
          <div class="tarjeta" data-rev><h3>4 · Predicción</h3><p>Con ese contexto ponderado, estima el siguiente token más probable. Repitiendo el paso, construye la respuesta.</p></div>
        </div>

        <div class="aviso" data-rev><span class="marca">📄</span><p style="margin:0">
          <b>«Attention Is All You Need» (2017)</b> introdujo esta arquitectura. Es el hito que hizo
          posibles los grandes modelos de lenguaje que se usan hoy.</p></div>
      </div>`;
    },
    nota: 'Por eso un modelo puede relacionar un síntoma del primer renglón con un antecedente escrito diez líneas después.',
    init: function (raiz) {
      var marco = raiz.querySelector(".tokens-marco");
      var svg = raiz.querySelector(".atencion");
      var toks = raiz.querySelectorAll(".token");

      function dibujar() {
        if (!marco || !toks.length) return;
        var mb = marco.getBoundingClientRect();
        if (!mb.width) return;
        svg.setAttribute("viewBox", "0 0 " + mb.width + " " + mb.height);
        var d = "";
        ATENCION.forEach(function (par, k) {
          var a = toks[par[0]].getBoundingClientRect();
          var b = toks[par[1]].getBoundingClientRect();
          var x1 = a.left - mb.left + a.width / 2, y1 = a.top - mb.top;
          var x2 = b.left - mb.left + b.width / 2, y2 = b.top - mb.top;
          var alto = Math.min(mb.height * 0.85, 22 + Math.abs(x2 - x1) * 0.36);
          d += '<path d="M' + x1 + " " + y1 + " C" + x1 + " " + (y1 - alto) + " " + x2 + " " +
            (y2 - alto) + " " + x2 + " " + y2 + '" fill="none" stroke="var(--acento-2)" ' +
            'stroke-width="' + (1 + par[2] * 1.8).toFixed(1) + '" opacity="' + (0.25 + par[2] * 0.45).toFixed(2) +
            '" class="trazo-anim" style="--td:' + (900 + k * 260) + '"/>';
        });
        svg.innerHTML = d;
      }

      var t1 = setTimeout(dibujar, 220);
      var t2 = setTimeout(dibujar, 900);
      window.addEventListener("resize", dibujar);
      return function () {
        clearTimeout(t1); clearTimeout(t2);
        window.removeEventListener("resize", dibujar);
      };
    }
  });

  /* ---------------------------------------------------------
     P11 · IA GENERATIVA
     --------------------------------------------------------- */
  var GENERA = [
    { i: "📝", t: "Texto", d: "Resúmenes, borradores, respuestas" },
    { i: "🖼️", t: "Imágenes", d: "Ilustraciones y material visual" },
    { i: "🎧", t: "Audio", d: "Voz sintética y transcripción" },
    { i: "🎬", t: "Video", d: "Piezas cortas y animaciones" },
    { i: "💻", t: "Código", d: "Consultas, scripts, automatizaciones" },
    { i: "📊", t: "Análisis", d: "Interpretación de un conjunto de datos" },
    { i: "📄", t: "Documentos", d: "Actas, informes, comunicaciones" },
    { i: "🧾", t: "Datos estructurados", d: "Tablas y formatos normalizados" }
  ];

  window.PANTALLAS.push({
    id: "generativa",
    tema: "generativa",
    modulo: "Cómo funciona · 04",
    titulo: "¿Qué es la IA generativa?",
    pregunta: "Modelos que, a partir de una instrucción, producen contenido nuevo en distintos formatos.",
    html: function () {
      return `
      <div class="columna">
        <div class="rejilla" data-col="4">
          ${GENERA.map(function (g) {
            return '<div class="tarjeta tarjeta--gen" data-rev><h3><span class="icono">' + g.i + "</span>" +
              g.t + "</h3><p>" + g.d + "</p></div>";
          }).join("")}
        </div>

        <div class="consola" data-rev>
          <div class="consola-cab"><span class="punto-rojo"></span><span class="punto-amb"></span><span class="punto-verd"></span>
            <span class="consola-tit">Instrucción</span></div>
          <p class="consola-in mono">«Resume en tres líneas la evolución del paciente y señale los datos faltantes.»</p>
          <p class="consola-out mono" id="salida-gen"></p>
        </div>

        <div class="aviso aviso--alerta" data-rev><span class="marca">🚩</span><p style="margin:0">
          <b>Generar no es comprender.</b> El modelo produce la continuación más probable según su
          entrenamiento; no verifica si lo que dice es cierto ni conoce a ese paciente.</p></div>
      </div>`;
    },
    init: function (raiz) {
      var el = raiz.querySelector("#salida-gen");
      return window.FX.tipear(
        el,
        "▸ Paciente con evolución favorable en las últimas 24 horas.\n" +
        "▸ Persiste control de cifras tensionales dentro de metas.\n" +
        "▸ Faltan: resultado de laboratorio de control y nota de egreso.",
        { velocidad: 22, retardo: 1200 }
      );
    }
  });

  /* ---------------------------------------------------------
     P12 · AUTOMATIZACIÓN vs IA vs AGENTE
     --------------------------------------------------------- */
  var AGENTE = ["Objetivo", "Análisis", "Plan", "Herramienta", "Acción", "Verificación"];

  window.PANTALLAS.push({
    id: "agente",
    tema: "generativa",
    modulo: "Cómo funciona · 05",
    titulo: "Automatización, IA y agentes: ¿cuál es la diferencia?",
    pregunta: "Se confunden a diario, y confundirlos lleva a comprar la herramienta equivocada.",
    html: function () {
      var flujo = AGENTE.map(function (p, i) {
        return '<div class="paso paso--ia">' + p + "</div>" +
          (i < AGENTE.length - 1 ? '<div class="conector"><i class="pulso" style="--pd:' + i * 300 + '"></i></div>' : "");
      }).join("");

      return `
      <div class="columna">
        <div class="comparativa rejilla" data-col="3">
          <div class="col" data-rev>
            <h3>⚙️ Automatización</h3>
            <p class="txt">Ejecuta <b>reglas definidas previamente</b> por una persona.</p>
            <ul><li>Siempre hace lo mismo ante la misma entrada</li><li>Es predecible y auditable</li><li>No aprende</li></ul>
            <span class="ej">Enviar el reporte todos los lunes a las 7:00.</span>
          </div>
          <div class="col" data-rev>
            <h3>🧠 Inteligencia Artificial</h3>
            <p class="txt">Analiza datos y <b>genera inferencias</b> o contenido.</p>
            <ul><li>Responde con probabilidades</li><li>Mejora al reentrenarse con más datos</li><li>Puede equivocarse</li></ul>
            <span class="ej">Estimar qué cuentas tienen riesgo de devolución.</span>
          </div>
          <div class="col col--dest" data-rev>
            <h3>🤖 Agente de IA</h3>
            <p class="txt">Recibe un <b>objetivo</b>, analiza el contexto, <b>usa herramientas</b> y ejecuta una secuencia de acciones bajo restricciones.</p>
            <ul><li>Decide los pasos, no solo el resultado</li><li>Consulta sistemas y documentos</li><li>Requiere límites y supervisión explícitos</li></ul>
            <span class="ej">Revisar un lote de cuentas, cruzar soportes y entregar el listado priorizado.</span>
          </div>
        </div>

        <div class="flujo-marco" data-rev>
          <span class="flujo-rotulo">Ciclo de trabajo de un agente</span>
          <div class="flujo">${flujo}</div>
        </div>

        <div class="aviso aviso--alerta" data-rev><span class="marca">🔒</span><p style="margin:0">
          Un agente actúa. Por eso, en una institución de salud, debe operar con
          <b>permisos limitados, trazabilidad de cada acción y aprobación humana</b> en los pasos que
          generan efectos jurídicos, clínicos o financieros.</p></div>
      </div>`;
    }
  });

  /* ---------------------------------------------------------
     P13 · ¿DÓNDE SE USA HOY?
     --------------------------------------------------------- */
  var SECTORES = [
    { i: "🏦", t: "Banca" }, { i: "🏭", t: "Industria" }, { i: "📦", t: "Logística" },
    { i: "🚦", t: "Transporte" }, { i: "🎓", t: "Educación" }, { i: "🛒", t: "Comercio" },
    { i: "🌾", t: "Agricultura" }, { i: "🛡️", t: "Seguridad" }, { i: "📡", t: "Comunicaciones" },
    { i: "🔬", t: "Investigación" }, { i: "🩺", t: "Medicina" }, { i: "🌍", t: "Salud pública" },
    { i: "🏛️", t: "Administración" }
  ];

  window.PANTALLAS.push({
    id: "usos-actuales",
    tema: "generativa",
    modulo: "Cómo funciona · 06",
    titulo: "¿Dónde se está utilizando hoy?",
    pregunta: "Está funcionando en sectores completos, muchas veces sin que el usuario lo note.",
    html: function () {
      /* Las posiciones se calculan aquí (elipse) para que el diagrama nunca
         se salga del área disponible, sea cual sea la proporción de pantalla. */
      var n = SECTORES.length;
      var RX = 41, RY = 40;
      var orbes = SECTORES.map(function (s, i) {
        var a = (Math.PI * 2 * i) / n - Math.PI / 2;
        var x = 50 + Math.cos(a) * RX;
        var y = 50 + Math.sin(a) * RY;
        return '<div class="orbe" style="left:' + x.toFixed(2) + "%; top:" + y.toFixed(2) +
          "%; --od:" + (i * 105) + '">' +
          '<span class="orbe-i">' + s.i + '</span><span class="orbe-t">' + s.t + "</span></div>";
      }).join("");
      return `
      <div class="ecosistema">
        <div class="orbita">
          <span class="orbita-anillo" aria-hidden="true"></span>
          <div class="orbita-centro">${window.PERSONAJES.novaSVG("eco")}<span class="orbita-nom">NOVA</span></div>
          ${orbes}
        </div>
      </div>`;
    },
    nota: 'De aquí en adelante nos concentramos en uno solo de estos mundos: <strong>la salud</strong>.'
  });
})();
