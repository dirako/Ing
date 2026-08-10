/* ============================================================
   MÓDULO 4 · ENTRADA AL SECTOR SALUD
   Los dos mundos del hospital, la IA asistencial y un ejemplo
   clínico completo de principio a fin.
   ============================================================ */
(function () {
  "use strict";
  window.PANTALLAS = window.PANTALLAS || [];

  /* ---------------------------------------------------------
     P14 · LOS DOS MUNDOS DE UNA INSTITUCIÓN DE SALUD
     --------------------------------------------------------- */
  window.PANTALLAS.push({
    id: "entrada-salud",
    tema: "salud",
    modulo: "Inteligencia Artificial en salud",
    titulo: "Un hospital son <span class=\"brillo\">dos mundos</span> que dependen el uno del otro",
    pregunta: "Toda la segunda mitad de esta capacitación se apoya en esta división. Conviene fijarla ahora.",
    html: function () {
      return `
      <div class="dos-mundos">
        <div class="mundo mundo--asistencial" data-rev>
          <span class="mundo-eti">Mundo 1</span>
          <h3>Asistencial</h3>
          <p>Todo lo que ocurre <b>alrededor del paciente</b>: consulta, urgencias, hospitalización,
          cirugía, apoyo diagnóstico, seguimiento.</p>
          <div class="mundo-personas">
            ${window.PERSONAJES.clinico("Profesional clínico")}
            ${window.PERSONAJES.paciente("Paciente")}
          </div>
          <ul class="lista">
            <li>La decisión final es de un profesional habilitado</li>
            <li>Los datos son sensibles y están protegidos por ley</li>
            <li>El error tiene consecuencias sobre la vida</li>
          </ul>
        </div>

        <div class="mundo-centro" data-rev>
          <div class="mundo-nova">${window.PERSONAJES.novaSVG("hospital")}</div>
          <span class="mundo-nova-nom">NOVA</span>
          <p class="mundo-nova-txt">Una misma tecnología, dos formas muy distintas de usarla y de controlarla.</p>
        </div>

        <div class="mundo mundo--administrativo" data-rev>
          <span class="mundo-eti">Mundo 2</span>
          <h3>Administrativo</h3>
          <p>Todo lo que <b>sostiene la operación</b>: admisiones, autorizaciones, facturación,
          cartera, compras, farmacia, talento humano, calidad.</p>
          <div class="mundo-personas">
            ${window.PERSONAJES.administrativo("Profesional administrativo")}
          </div>
          <ul class="lista">
            <li>Alto volumen y alta repetición</li>
            <li>Datos muy estructurados y reglas explícitas</li>
            <li>El error se traduce en pérdida de ingresos</li>
          </ul>
        </div>
      </div>`;
    },
    nota: 'El mundo administrativo suele ser <strong>el punto de entrada más rápido y menos riesgoso</strong> para la IA en una institución.'
  });

  /* ---------------------------------------------------------
     P15 · IA EN LA PARTE ASISTENCIAL
     --------------------------------------------------------- */
  var GRUPOS = [
    {
      t: "Imagen y apoyo diagnóstico", i: "🩻", items: [
        ["Análisis de imágenes médicas", "consolidado"],
        ["Radiología", "consolidado"],
        ["Patología digital", "emergente"],
        ["Dermatología", "emergente"]
      ]
    },
    {
      t: "Datos del paciente", i: "📋", items: [
        ["Análisis de historia clínica", "emergente"],
        ["Procesamiento de lenguaje clínico", "emergente"],
        ["Estratificación de pacientes", "consolidado"],
        ["Predicción de riesgos", "consolidado"]
      ]
    },
    {
      t: "Atención y seguimiento", i: "💓", items: [
        ["Monitoreo de signos", "consolidado"],
        ["Detección temprana", "emergente"],
        ["Telemedicina", "consolidado"],
        ["Apoyo a decisiones clínicas", "emergente"]
      ]
    },
    {
      t: "Investigación y seguridad", i: "🔬", items: [
        ["Medicina personalizada", "emergente"],
        ["Investigación clínica", "consolidado"],
        ["Farmacovigilancia", "emergente"],
        ["Salud pública y epidemiología", "consolidado"]
      ]
    }
  ];

  window.PANTALLAS.push({
    id: "ia-asistencial",
    tema: "salud",
    modulo: "Salud · Asistencial",
    titulo: "¿Qué puede hacer la IA en la atención clínica?",
    pregunta: "Distinguimos lo que ya está consolidado en la práctica de lo que aún es emergente o está en evaluación.",
    html: function () {
      return `
      <div class="columna">
        <div class="rejilla" data-col="4">
          ${GRUPOS.map(function (g) {
            return '<div class="tarjeta" data-rev><h3><span class="icono">' + g.i + "</span>" + g.t + "</h3>" +
              '<div class="apl">' + g.items.map(function (it) {
                return '<span class="apl-item"><b>' + it[0] + "</b>" +
                  '<span class="etiqueta et-' + it[1] + '">' + it[1] + "</span></span>";
              }).join("") + "</div></div>";
          }).join("")}
        </div>

        <div class="mensaje-clave" data-rev>
          <span class="marca">⚕️</span>
          <p>«La IA debe <b>fortalecer el criterio profesional</b>, no sustituirlo irresponsablemente.»</p>
        </div>
      </div>`;
    },
    nota: '<strong>Consolidado</strong> = uso extendido y documentado. <strong>Emergente</strong> = en evaluación, con evidencia todavía en construcción. Ninguna de estas herramientas reemplaza al profesional de la salud.'
  });

  /* ---------------------------------------------------------
     P16 · EJEMPLO CLÍNICO COMPLETO
     --------------------------------------------------------- */
  var CADENA = [
    { t: "Paciente", i: "🧑", c: "humano" },
    { t: "Historia clínica", i: "📋", c: "dato" },
    { t: "Laboratorios", i: "🧪", c: "dato" },
    { t: "Imágenes", i: "🩻", c: "dato" },
    { t: "NOVA analiza", i: "◎", c: "ia" },
    { t: "Identifica patrones", i: "🔗", c: "ia" },
    { t: "Genera una alerta", i: "🔔", c: "ia" },
    { t: "Profesional de salud", i: "🩺", c: "humano" },
    { t: "Decisión clínica", i: "✅", c: "decision" }
  ];

  window.PANTALLAS.push({
    id: "ejemplo-clinico",
    tema: "salud",
    modulo: "Salud · Ejemplo",
    titulo: "¿Cómo se ve esto en un caso real?",
    pregunta: "Un paciente hospitalizado, tres fuentes de información y una alerta que llega a tiempo.",
    html: function () {
      return `
      <div class="columna">
        <div class="cadena">
          ${CADENA.map(function (p, i) {
            return '<div class="eslabon eslabon--' + p.c + '" data-paso="' + i + '">' +
              '<span class="eslabon-i">' + p.i + "</span>" +
              '<span class="eslabon-t">' + p.t + "</span></div>" +
              (i < CADENA.length - 1 ? '<span class="eslabon-flecha">→</span>' : "");
          }).join("")}
        </div>

        <div class="rejilla" data-col="3">
          <div class="tarjeta" data-rev><h3>Lo que aporta la IA</h3><p>Revisa <b>todo</b> el histórico y cruza señales que, por separado, parecen normales: una tendencia en los laboratorios, un cambio en los signos vitales y un antecedente escrito hace dos años.</p></div>
          <div class="tarjeta tarjeta--dest" data-rev><h3>Lo que produce</h3><p>Una <b>alerta con su justificación</b>: qué variables la activaron y con qué nivel de confianza. No una orden, ni un diagnóstico cerrado.</p></div>
          <div class="tarjeta tarjeta--ok" data-rev><h3>Quién decide</h3><p>El <b>profesional habilitado</b>. Valora la alerta, la contrasta con el examen del paciente y decide. La responsabilidad de la conducta clínica no se delega en un sistema.</p></div>
        </div>

        <div class="mensaje-clave mensaje-clave--ok" data-rev>
          <span class="marca">✋</span>
          <p>La cadena termina siempre en una <b>persona que decide</b> y que responde por esa decisión.</p>
        </div>
      </div>`;
    },
    init: function (raiz) {
      var pasos = raiz.querySelectorAll(".eslabon");
      return window.FX.secuencia(pasos, window.FX.reducido ? 0 : 300, "on");
    }
  });
})();
