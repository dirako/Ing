/* ============================================================
   MÓDULO 5 · LA IA EN LA ADMINISTRACIÓN DE UNA CLÍNICA U HOSPITAL
   Núcleo de la capacitación: procesos, ciclo de ingresos, RIPS,
   glosas, cartera, farmacia, PQRS y tablero gerencial.
   ============================================================ */
(function () {
  "use strict";
  window.PANTALLAS = window.PANTALLAS || [];

  /* ---------------------------------------------------------
     P17 · EL HOSPITAL ADMINISTRATIVO
     --------------------------------------------------------- */
  var ALAS = [
    {
      t: "Ciclo de ingresos", i: "🧾", items: [
        ["Admisiones", 2], ["Autorizaciones", 3], ["Contratación con pagadores", 2],
        ["Facturación", 3], ["RIPS", 3], ["Validación de información", 3],
        ["Radicación", 2], ["Auditoría de cuentas", 3], ["Glosas", 3]
      ]
    },
    {
      t: "Finanzas y riesgo", i: "💰", items: [
        ["Devoluciones", 3], ["Cartera", 3], ["Tesorería", 2],
        ["Contabilidad", 1], ["Gestión de riesgos", 2]
      ]
    },
    {
      t: "Logística y personas", i: "📦", items: [
        ["Compras", 2], ["Inventarios", 3], ["Farmacia", 3],
        ["Talento humano", 2], ["Mantenimiento", 2]
      ]
    },
    {
      t: "Gestión institucional", i: "🏛️", items: [
        ["PQRS", 3], ["Calidad", 2], ["Infraestructura", 1],
        ["Gestión documental", 3], ["Planeación", 2], ["Indicadores", 3],
        ["Contratación", 2]
      ]
    }
  ];

  window.PANTALLAS.push({
    id: "hospital-admin",
    tema: "admin",
    modulo: "Administración · 01",
    titulo: "El hospital que no se ve",
    pregunta: "Veintiséis procesos administrativos sostienen cada atención. La IA no entra en todos al mismo tiempo ni con el mismo impacto.",
    html: function () {
      function puntos(n) {
        var s = "";
        for (var i = 1; i <= 3; i++) s += '<i class="pt' + (i <= n ? " pt--on" : "") + '"></i>';
        return '<span class="pot" title="Potencial de aplicación de IA">' + s + "</span>";
      }
      return `
      <div class="columna">
        <div class="rejilla" data-col="4">
          ${ALAS.map(function (a) {
            return '<div class="ala" data-rev><h3><span class="icono">' + a.i + "</span>" + a.t + "</h3>" +
              '<ul class="ala-lista">' + a.items.map(function (it) {
                return "<li><span>" + it[0] + "</span>" + puntos(it[1]) + "</li>";
              }).join("") + "</ul></div>";
          }).join("")}
        </div>
        <div class="leyenda" data-rev>
          <span class="leyenda-t">Potencial de aplicación de IA hoy:</span>
          <span class="leyenda-i"><i class="pt pt--on"></i><i class="pt"></i><i class="pt"></i> Bajo</span>
          <span class="leyenda-i"><i class="pt pt--on"></i><i class="pt pt--on"></i><i class="pt"></i> Medio</span>
          <span class="leyenda-i"><i class="pt pt--on"></i><i class="pt pt--on"></i><i class="pt pt--on"></i> Alto</span>
          <span class="leyenda-n">Valoración pedagógica de esta capacitación, no un indicador oficial.</span>
        </div>
      </div>`;
    },
    nota: 'Los procesos con mayor potencial comparten tres rasgos: <strong>alto volumen</strong>, <strong>información estructurada</strong> y <strong>errores costosos y repetitivos</strong>.'
  });

  /* ---------------------------------------------------------
     P18 · CICLO DE FACTURACIÓN EN SALUD
     --------------------------------------------------------- */
  var CICLO = [
    { t: "Atención", s: "Se presta el servicio" },
    { t: "Historia clínica", s: "Se documenta" },
    { t: "Codificación", s: "CIE / CUPS / IUM" },
    { t: "Factura", s: "Factura electrónica de venta" },
    { t: "RIPS", s: "Información estructurada" },
    { t: "Validaciones", s: "Reglas del mecanismo único" },
    { t: "Radicación", s: "Entrega al pagador" },
    { t: "Auditoría", s: "Revisión de la cuenta" },
    { t: "Resultado", s: "Pago · glosa · devolución" }
  ];
  var PUNTOS_IA = [2, 4, 5, 7];

  window.PANTALLAS.push({
    id: "facturacion",
    tema: "admin",
    modulo: "Administración · 02",
    titulo: "El ciclo de facturación en salud, paso a paso",
    pregunta: "Cada eslabón que falla se paga dos veces: en reprocesos y en dinero que no entra.",
    html: function () {
      var flujo = CICLO.map(function (p, i) {
        var esIA = PUNTOS_IA.indexOf(i) >= 0;
        return '<div class="paso' + (esIA ? " paso--ia" : "") + '" data-rev="' + (120 + i * 90) + '">' +
          "<span>" + p.t + "</span><small>" + p.s + "</small>" +
          (esIA ? '<span class="marca-ia">IA</span>' : "") + "</div>" +
          (i < CICLO.length - 1 ? '<div class="conector"><i class="pulso" style="--pd:' + i * 260 + '"></i></div>' : "");
      }).join("");

      var acciones = [
        ["Detectar inconsistencias", "Campos vacíos, códigos que no corresponden, fechas imposibles."],
        ["Validar antes de radicar", "Simular las reglas de validación y corregir antes de enviar."],
        ["Estimar riesgo de devolución", "Puntuar cada cuenta según el histórico del pagador."],
        ["Comparar factura y soportes", "Encontrar diferencias entre lo facturado y lo documentado."],
        ["Clasificar errores", "Agrupar por tipo, servicio, sede y responsable."],
        ["Priorizar cuentas", "Ordenar por valor en riesgo y por vencimiento."],
        ["Analizar patrones de glosa", "Identificar causales que se repiten."],
        ["Generar alertas", "Avisar antes de que el error se vuelva pérdida."]
      ];

      return `
      <div class="columna">
        <div class="flujo-marco"><div class="flujo flujo--9">${flujo}</div></div>
        <h3 class="sub" data-rev>Dónde puede intervenir la inteligencia artificial</h3>
        <div class="rejilla" data-col="4">
          ${acciones.map(function (a) {
            return '<div class="tarjeta tarjeta--compacta" data-rev><h3>' + a[0] + "</h3><p>" + a[1] + "</p></div>";
          }).join("")}
        </div>
        <div class="aviso aviso--alerta" data-rev><span class="marca">⚖️</span><p style="margin:0">
          La IA <b>no sustituye</b> los controles humanos, legales ni contractuales. Apoya la revisión;
          no reemplaza la auditoría, la conciliación con el pagador ni las obligaciones del contrato.</p></div>
      </div>`;
    }
  });

  /* ---------------------------------------------------------
     P19 · RIPS E INFORMACIÓN ESTRUCTURADA
     --------------------------------------------------------- */
  window.PANTALLAS.push({
    id: "rips",
    tema: "admin",
    modulo: "Administración · 03",
    titulo: "RIPS: por qué la información estructurada lo cambia todo",
    pregunta: "El RIPS es el soporte de la factura electrónica de venta en salud. Es, además, el mayor conjunto de datos comparables del sector.",
    html: function () {
      var n948 = window.FUENTES.normas.filter(function (x) { return x.titulo.indexOf("948") >= 0; })[0];
      return `
      <div class="columna">
        <div class="rejilla" data-col="3">
          <div class="tarjeta" data-rev>
            <h3><span class="icono">🔤</span> De texto libre a dato</h3>
            <p>Una nota escrita a mano no se puede sumar, comparar ni auditar automáticamente.
            Un dato estructurado <b>sí</b>: tiene campo, formato y valor permitido.</p>
          </div>
          <div class="tarjeta" data-rev>
            <h3><span class="icono">🔗</span> Factura + RIPS</h3>
            <p>El prestador genera el RIPS en formato <b>JSON</b> y lo envía junto con la factura
            electrónica al mecanismo único de validación, que devuelve un <b>código único de validación (CUV)</b>.</p>
          </div>
          <div class="tarjeta" data-rev>
            <h3><span class="icono">🤖</span> Dónde entra la IA</h3>
            <p>Antes del envío: <b>revisar consistencia, anticipar rechazos</b> y explicar por qué una
            regla fallaría. Después: <b>analizar el histórico</b> de rechazos por sede, servicio y pagador.</p>
          </div>
        </div>

        <div class="norma-caja norma-caja--dest" data-rev>
          <span class="norma-eti">Norma vigente</span>
          <h3>${n948.titulo} · ${n948.tema}</h3>
          <p>${n948.texto}</p>
          <p class="fuente"><b>Fuente:</b> ${n948.entidad}. <b>Consultado:</b> ${window.FUENTES.consulta}.</p>
        </div>

        <div class="aviso aviso--alerta" data-rev><span class="marca">📌</span><p style="margin:0">
          La normatividad del RIPS <b>ha cambiado varias veces en pocos años</b>. Antes de cada
          capacitación o desarrollo, verifique en la fuente oficial cuál es la resolución vigente,
          su anexo técnico y el cronograma de reglas de rechazo.</p></div>
      </div>`;
    },
    nota: 'Regla de esta capacitación: <strong>norma + año + fuente oficial + fecha de consulta</strong>. Nunca se asume vigencia.'
  });

  /* ---------------------------------------------------------
     P20 · GLOSAS Y DEVOLUCIONES
     --------------------------------------------------------- */
  var DIMENSIONES = ["Causal", "Pagador", "Servicio", "Sede", "Profesional", "Contrato", "Valor", "Recurrencia"];
  var SECUENCIA_G = ["Analiza el histórico", "Identifica patrones", "Detecta causas recurrentes", "Genera alertas", "Prioriza la intervención"];

  window.PANTALLAS.push({
    id: "glosas",
    tema: "admin",
    modulo: "Administración · 04",
    titulo: "Glosas y devoluciones: del reproceso a la prevención",
    pregunta: "La pregunta útil no es «¿cuánto nos glosaron?», sino «¿qué se repite y por qué?».",
    html: function () {
      var r2284 = window.FUENTES.normas.filter(function (x) { return x.titulo.indexOf("2284") >= 0; })[0];
      return `
      <div class="columna">
        <div class="glosa-panel">
          <div class="glosa-dims" data-rev>
            <span class="sub">La IA cruza el histórico por todas estas dimensiones a la vez</span>
            <div class="dims">
              ${DIMENSIONES.map(function (d, i) {
                return '<span class="dim" style="--dd:' + (i * 110) + '">' + d + "</span>";
              }).join("")}
            </div>
          </div>
          <div class="glosa-flujo" data-rev>
            <div class="flujo flujo--v">
              ${SECUENCIA_G.map(function (s, i) {
                return '<div class="paso paso--ia">' + s + "</div>" +
                  (i < SECUENCIA_G.length - 1 ? '<div class="conector conector--v"><i class="pulso" style="--pd:' + i * 280 + '"></i></div>' : "");
              }).join("")}
            </div>
          </div>
        </div>

        <div class="rejilla" data-col="2">
          <div class="tarjeta tarjeta--ok" data-rev>
            <h3><span class="icono">🛡️</span> El objetivo real: prevenir</h3>
            <p>Cada glosa evitada vale más que cada glosa respondida. Si el sistema aprende que
            <b>un servicio, en una sede, con un pagador</b> concentra la mayoría de una causal,
            la intervención deja de ser respuesta y pasa a ser corrección del proceso.</p>
          </div>
          <div class="norma-caja" data-rev>
            <span class="norma-eti">Norma vigente</span>
            <h3>${r2284.titulo}</h3>
            <p>${r2284.texto}</p>
            <p class="fuente"><b>Fuente:</b> ${r2284.entidad}. <b>Consultado:</b> ${window.FUENTES.consulta}.</p>
          </div>
        </div>
      </div>`;
    },
    nota: 'La IA propone la hipótesis y ordena la evidencia. <strong>La respuesta a la glosa sigue siendo un acto institucional</strong> con soporte documental y responsable identificado.'
  });

  /* ---------------------------------------------------------
     P21 · CARTERA
     --------------------------------------------------------- */
  var EDADES = [
    { t: "0-30 días", pct: 34, r: "bajo" },
    { t: "31-60 días", pct: 22, r: "bajo" },
    { t: "61-90 días", pct: 16, r: "medio" },
    { t: "91-180 días", pct: 13, r: "medio" },
    { t: "181-360 días", pct: 9, r: "alto" },
    { t: "más de 360 días", pct: 6, r: "alto" }
  ];

  window.PANTALLAS.push({
    id: "cartera",
    tema: "admin",
    modulo: "Administración · 05",
    titulo: "Cartera: el dinero que ya se ganó y todavía no llega",
    pregunta: "Cuanto más envejece una cuenta, menos probable es recuperarla. La IA ayuda a decidir dónde poner el esfuerzo primero.",
    html: function () {
      return `
      <div class="columna">
        <div class="cartera" data-rev>
          ${EDADES.map(function (e, i) {
            return '<div class="edad edad--' + e.r + '" style="--ed:' + (i * 140) + '">' +
              '<span class="edad-barra"><i style="--h:' + e.pct + '%"></i></span>' +
              '<span class="edad-pct">' + e.pct + " %</span>" +
              '<span class="edad-t">' + e.t + "</span></div>";
          }).join("")}
        </div>
        <p class="fuente centro" data-rev>Distribución ilustrativa con fines pedagógicos. No corresponde a una institución real.</p>

        <div class="rejilla" data-col="4">
          <div class="tarjeta tarjeta--compacta" data-rev><h3>Segmentar</h3><p>Agrupar la cartera por pagador, contrato, edad y valor en riesgo.</p></div>
          <div class="tarjeta tarjeta--compacta" data-rev><h3>Perfilar al pagador</h3><p>Aprender el comportamiento histórico de pago de cada entidad responsable.</p></div>
          <div class="tarjeta tarjeta--compacta" data-rev><h3>Estimar riesgo de no pago</h3><p>Puntuar cada cuenta según los factores que históricamente anticiparon el impago.</p></div>
          <div class="tarjeta tarjeta--compacta" data-rev><h3>Priorizar la gestión</h3><p>Ordenar por recuperabilidad esperada, no solo por antigüedad.</p></div>
          <div class="tarjeta tarjeta--compacta" data-rev><h3>Recomendar acciones</h3><p>Sugerir el siguiente paso: conciliación, soporte faltante, mesa de trabajo.</p></div>
          <div class="tarjeta tarjeta--compacta" data-rev><h3>Apoyar el cobro</h3><p>Preparar los insumos de cada gestión con la información ya consolidada.</p></div>
          <div class="tarjeta tarjeta--compacta" data-rev><h3>Redactar comunicaciones</h3><p>Generar borradores de oficios y estados de cuenta para revisión humana.</p></div>
          <div class="tarjeta tarjeta--compacta" data-rev><h3>Analizar tendencias</h3><p>Detectar si un pagador está alargando sus tiempos antes de que sea evidente.</p></div>
        </div>
      </div>`;
    },
    nota: 'Ninguna comunicación de cobro debería salir sin <strong>revisión y firma institucional</strong>. La IA prepara; la institución responde.'
  });

  /* ---------------------------------------------------------
     P22 · FARMACIA E INVENTARIOS
     --------------------------------------------------------- */
  var FARMACIA = [
    ["Predicción de demanda", "Estimar el consumo por servicio y por sede."],
    ["Nivel óptimo de inventario", "Equilibrar disponibilidad y costo de mantener existencias."],
    ["Riesgo de agotados", "Anticipar el quiebre antes de que afecte la atención."],
    ["Sobrestock", "Detectar exceso que inmoviliza recursos."],
    ["Próximos vencimientos", "Priorizar la rotación de lotes por fecha."],
    ["Rotación", "Identificar qué se mueve y qué no."],
    ["Trazabilidad", "Seguir el medicamento desde la compra hasta la dispensación."],
    ["Comportamiento por sede", "Comparar patrones entre puntos de atención."],
    ["Demanda geográfica", "Relacionar consumo con territorio y población atendida."],
    ["Patrones de dispensación", "Detectar desviaciones frente a lo esperado."],
    ["Abastecimiento", "Sugerir cantidades y momentos de compra."]
  ];

  window.PANTALLAS.push({
    id: "farmacia",
    tema: "admin",
    modulo: "Administración · 06",
    titulo: "Farmacia e inventarios: predecir en lugar de reaccionar",
    pregunta: "El agotado se paga en atención; el sobrestock, en caja. La IA trabaja sobre ese equilibrio.",
    html: function () {
      var flujo = ["Compra", "Recepción", "Almacenamiento", "Dispensación", "Consumo"];
      return `
      <div class="columna">
        <div class="farmacia-flujo" data-rev>
          <div class="flujo">
            ${flujo.map(function (f, i) {
              return '<div class="paso">' + f + "</div>" +
                (i < flujo.length - 1 ? '<div class="conector"><i class="pulso" style="--pd:' + i * 320 + '"></i></div>' : "");
            }).join("")}
          </div>
          <div class="pastillas" aria-hidden="true">
            ${"💊 🧴 💉 🩹 💊 🧪 💊 🧴".split(" ").map(function (p, i) {
              return '<span class="pastilla" style="--pd:' + (i * 620) + '">' + p + "</span>";
            }).join("")}
          </div>
        </div>

        <div class="rejilla" data-col="4">
          ${FARMACIA.map(function (f) {
            return '<div class="tarjeta tarjeta--compacta" data-rev><h3>' + f[0] + "</h3><p>" + f[1] + "</p></div>";
          }).join("")}
        </div>
      </div>`;
    },
    nota: 'Estas aplicaciones exigen un requisito previo poco glamuroso: <strong>datos limpios de consumo y de existencias</strong>. Sin eso, no hay predicción posible.'
  });

  /* ---------------------------------------------------------
     P23 · PQRS Y EXPERIENCIA DEL USUARIO
     --------------------------------------------------------- */
  var CANALES = ["Buzón físico", "Correo", "Página web", "Telefonía", "Redes sociales", "Presencial"];
  var PQRS_IA = [
    ["Clasificación", "Petición, queja, reclamo, sugerencia o felicitación."],
    ["Identificación del tema", "Oportunidad, trato, facturación, medicamentos, infraestructura."],
    ["Análisis de sentimiento", "Tono e intensidad del mensaje."],
    ["Priorización", "Casos con riesgo clínico o jurídico primero."],
    ["Causas recurrentes", "Qué se repite, dónde y desde cuándo."],
    ["Tendencias", "Cómo evoluciona un tema en el tiempo."],
    ["Tiempos de respuesta", "Alertas antes de vencer el término."],
    ["Borrador de respuesta", "Propuesta inicial para revisión humana."],
    ["Identificación de riesgos", "Señales tempranas de eventos que escalan."]
  ];

  window.PANTALLAS.push({
    id: "pqrs",
    tema: "admin",
    modulo: "Administración · 07",
    titulo: "PQRS: escuchar a escala",
    pregunta: "Miles de mensajes al año contienen el diagnóstico más honesto de la institución. El problema nunca fue tenerlos: fue leerlos todos.",
    html: function () {
      return `
      <div class="columna">
        <div class="pqrs-entrada" data-rev>
          <div class="canales">
            ${CANALES.map(function (c, i) {
              return '<span class="canal" style="--cd:' + (i * 160) + '">' + c + "</span>";
            }).join("")}
          </div>
          <div class="canal-conv">
            <span class="conv-flecha">↓</span>
            <div class="conv-nova">${window.PERSONAJES.novaSVG("pqrs")}</div>
          </div>
        </div>

        <div class="rejilla" data-col="3">
          ${PQRS_IA.map(function (p) {
            return '<div class="tarjeta tarjeta--compacta" data-rev><h3>' + p[0] + "</h3><p>" + p[1] + "</p></div>";
          }).join("")}
        </div>

        <div class="aviso aviso--alerta" data-rev><span class="marca">✍️</span><p style="margin:0">
          La <b>respuesta institucional final</b> mantiene los controles humanos que correspondan.
          Un borrador generado automáticamente no reemplaza la revisión de quien firma ni el análisis del caso.</p></div>
      </div>`;
    }
  });

  /* ---------------------------------------------------------
     P24 · IA PARA GERENCIA
     --------------------------------------------------------- */
  var FUENTES_G = ["Facturación", "Cartera", "Calidad", "PQRS", "Inventarios", "Talento humano", "Producción", "Costos", "Finanzas"];
  var ESCALA = [
    ["Dato", "Un registro aislado.", "La cuenta 45.812 fue devuelta."],
    ["Información", "El dato en contexto.", "El 18 % de las cuentas de esa sede se devuelven."],
    ["Conocimiento", "El porqué y el patrón.", "Se devuelven por soporte faltante en un servicio concreto."],
    ["Decisión", "La acción y su responsable.", "Se ajusta el flujo de soportes y se mide en 30 días."]
  ];

  window.PANTALLAS.push({
    id: "gerencia",
    tema: "admin",
    modulo: "Administración · 08",
    titulo: "Del dato disperso a la decisión gerencial",
    pregunta: "La gerencia no necesita más tableros. Necesita menos preguntas sin responder.",
    html: function () {
      return `
      <div class="columna">
        <div class="gerencia">
          <div class="ger-fuentes" data-rev>
            ${FUENTES_G.map(function (f, i) {
              return '<span class="ger-f" style="--gd:' + (i * 90) + '">' + f + "</span>";
            }).join("")}
          </div>
          <div class="ger-conv" data-rev><span>↓</span><b>Inteligencia analítica</b><span>↓</span></div>
          <div class="tablero" data-rev>
            <div class="tablero-fila">
              <div class="kpi"><span class="valor" data-contador="18.4" data-dec="1" data-suf=" %">0</span><span class="rotulo">Cuentas con hallazgo</span><span class="meta">ejemplo ilustrativo</span></div>
              <div class="kpi"><span class="valor" data-contador="62" data-suf=" días">0</span><span class="rotulo">Rotación de cartera</span><span class="meta">ejemplo ilustrativo</span></div>
              <div class="kpi"><span class="valor" data-contador="7" data-suf=" alertas">0</span><span class="rotulo">Prioridad de hoy</span><span class="meta">ejemplo ilustrativo</span></div>
              <div class="mini-graf">
                ${[38, 52, 44, 66, 58, 74, 69, 86].map(function (h, i) {
                  return '<i style="--h:' + h + "%; --bd:" + (i * 90) + '"></i>';
                }).join("")}
              </div>
            </div>
          </div>
          <div class="ger-conv" data-rev><span>↓</span><b>Gerencia · Decisiones</b></div>
        </div>

        <div class="escala" data-rev>
          ${ESCALA.map(function (e, i) {
            return '<div class="escala-item"><span class="escala-n">' + (i + 1) + "</span>" +
              "<h3>" + e[0] + "</h3><p>" + e[1] + '</p><span class="escala-ej">' + e[2] + "</span></div>" +
              (i < ESCALA.length - 1 ? '<span class="escala-flecha">→</span>' : "");
          }).join("")}
        </div>
      </div>`;
    },
    nota: 'Las cifras del tablero son <strong>ilustrativas</strong> y no corresponden a ninguna institución real.',
    init: function (raiz) {
      window.FX.activarContadores(raiz, 700);
    }
  });
})();
