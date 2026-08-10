/* ============================================================
   MÓDULO 7 · RIESGOS, PERSONAS Y FUTURO
   ============================================================ */
(function () {
  "use strict";
  window.PANTALLAS = window.PANTALLAS || [];

  /* ---------------------------------------------------------
     P29 · RIESGOS Y LIMITACIONES
     --------------------------------------------------------- */
  var RIESGOS = [
    ["Alucinaciones", "Afirmaciones falsas con apariencia de certeza."],
    ["Sesgos", "El modelo reproduce los sesgos de los datos con que se entrenó."],
    ["Datos incorrectos", "Basura que entra, basura que sale."],
    ["Datos incompletos", "Conclusiones sobre una realidad parcial."],
    ["Privacidad", "Tratamiento de datos sensibles sin base legal ni autorización."],
    ["Ciberseguridad", "Nuevas superficies de ataque y de exfiltración."],
    ["Dependencia excesiva", "Se deja de revisar porque «el sistema ya lo revisó»."],
    ["Errores de interpretación", "Confundir correlación con causa."],
    ["Falta de trazabilidad", "No poder explicar por qué se sugirió algo."],
    ["Automatización sin control", "Acciones ejecutadas sin punto de aprobación."],
    ["Discriminación algorítmica", "Trato desigual sistemático a un grupo."],
    ["Desactualización", "El modelo envejece; la norma y la práctica cambian."],
    ["Fuga de información", "Datos institucionales pegados en herramientas externas."],
    ["Uso irresponsable de historias clínicas", "Información reservada usada fuera de su finalidad."]
  ];

  window.PANTALLAS.push({
    id: "riesgos",
    tema: "riesgo",
    modulo: "Riesgos · 01",
    titulo: "¿Qué puede salir mal?",
    pregunta: "Conocer los riesgos no es desconfiar de la tecnología: es la condición para poder usarla.",
    html: function () {
      return `
      <div class="columna">
        <div class="rejilla" data-col="auto">
          ${RIESGOS.map(function (r, i) {
            return '<div class="riesgo" data-rev="' + (100 + i * 55) + '">' +
              '<span class="riesgo-i">⚠</span><b>' + r[0] + "</b><p>" + r[1] + "</p></div>";
          }).join("")}
        </div>

        <div class="hitl" data-rev>
          <span class="hitl-eti">Human in the loop</span>
          <p class="hitl-txt">«El ser humano permanece dentro del proceso de revisión y decisión.»</p>
          <p class="hitl-sub">Se traduce en <b>puntos de aprobación explícitos</b>, registro de quién revisó
          y capacidad de detener o revertir lo que el sistema propuso.</p>
        </div>
      </div>`;
    }
  });

  /* ---------------------------------------------------------
     P30 · EJEMPLO DE ALUCINACIÓN
     --------------------------------------------------------- */
  window.PANTALLAS.push({
    id: "alucinacion",
    tema: "riesgo",
    modulo: "Riesgos · 02",
    titulo: "Cuando la respuesta suena impecable… y es falsa",
    pregunta: "Este es el riesgo más frecuente en el día a día administrativo, porque el error no se ve.",
    html: function () {
      return `
      <div class="alucina">
        <div class="alucina-chat">
          <p class="chat-pregunta mono">👤 «¿Cuál es el plazo para radicar los soportes de cobro ante el pagador?»</p>
          <div class="chat-respuesta">
            <span class="chat-quien">◎ Respuesta generada</span>
            <p class="chat-txt mono" id="txt-alucina"></p>
            <div class="sello" id="sello-alucina">
              <span class="sello-t">No verificado</span>
              <span class="sello-s">La norma citada y el plazo no fueron comprobados en fuente oficial</span>
            </div>
          </div>
          <p class="fuente">Ejemplo construido para esta capacitación. <b>La resolución citada es ficticia</b>: se usa para mostrar cómo un dato inventado puede parecer verdadero.</p>
        </div>

        <div class="alucina-lecciones">
          <p class="grande centro">Parece correcta <span class="neq">≠</span> está comprobada</p>
          <div class="rejilla" data-col="2">
            <div class="tarjeta tarjeta--compacta" data-rev><h3>Verificar</h3><p>Toda cifra, norma o plazo se confirma en la fuente antes de usarse.</p></div>
            <div class="tarjeta tarjeta--compacta" data-rev><h3>Contrastar</h3><p>Dos fuentes independientes valen más que una respuesta segura.</p></div>
            <div class="tarjeta tarjeta--compacta" data-rev><h3>Consultar la fuente oficial</h3><p>Para normatividad, el texto publicado por la entidad competente.</p></div>
            <div class="tarjeta tarjeta--compacta" data-rev><h3>Mantener el criterio</h3><p>Si algo no cuadra con la experiencia del proceso, probablemente no cuadra.</p></div>
          </div>
        </div>
      </div>`;
    },
    nota: 'Señal de alarma práctica: <strong>cuanto más específica y más segura suene una cita normativa, más vale verificarla</strong>.',
    init: function (raiz, api) {
      var el = raiz.querySelector("#txt-alucina");
      var sello = raiz.querySelector("#sello-alucina");
      var t;
      var cancelar = window.FX.tipear(
        el,
        "De acuerdo con la Resolución 3125 de 2021 del Ministerio de Salud, el prestador " +
        "cuenta con un plazo máximo de quince (15) días hábiles contados a partir de la " +
        "prestación del servicio para radicar los soportes ante la entidad responsable de pago.",
        {
          velocidad: 17,
          retardo: 600,
          alTerminar: function () {
            t = setTimeout(function () {
              sello.classList.add("on");
              if (api && api.ajustar) api.ajustar();
            }, 900);
          }
        }
      );
      return function () { cancelar(); clearTimeout(t); };
    }
  });

  /* ---------------------------------------------------------
     P31 · ¿LA IA REEMPLAZARÁ A LAS PERSONAS?
     --------------------------------------------------------- */
  var HUMANO = [
    ["⚖️", "Juicio", "Decidir con información incompleta y consecuencias reales."],
    ["🪪", "Responsabilidad", "Alguien responde. Un modelo no puede responder."],
    ["🧭", "Ética", "Distinguir lo que se puede hacer de lo que se debe hacer."],
    ["🫱", "Liderazgo", "Alinear personas alrededor de un propósito."],
    ["💗", "Empatía", "Acompañar a alguien que está enfermo o asustado."],
    ["🏥", "Conocimiento del contexto", "Saber cómo funciona realmente esta institución."],
    ["🚨", "Decisiones críticas", "Actuar cuando el costo del error es irreversible."]
  ];

  window.PANTALLAS.push({
    id: "reemplazo",
    tema: "futuro",
    modulo: "Personas",
    titulo: "¿La Inteligencia Artificial me va a quitar el trabajo?",
    pregunta: "Es la pregunta que todo el mundo tiene y casi nadie hace en voz alta. Vale la pena responderla con precisión.",
    html: function () {
      return `
      <div class="columna">
        <div class="ecuacion" data-rev>
          <div class="eq-parte"><span class="eq-i">🧑‍💼</span><b>Persona</b></div>
          <span class="eq-op">+</span>
          <div class="eq-parte eq-parte--ia"><span class="eq-i">◎</span><b>Inteligencia Artificial</b></div>
          <span class="eq-op">=</span>
          <div class="eq-parte eq-parte--res"><b class="brillo">Capacidad aumentada</b></div>
        </div>

        <p class="txt centro" data-rev>
          Determinadas <b>tareas</b> se transforman y se automatizan: transcribir, clasificar, buscar,
          consolidar, redactar borradores. Eso cambia el contenido de muchos cargos.
          Lo que <b>no se transfiere</b> a un sistema es esto:
        </p>

        <div class="rejilla" data-col="auto">
          ${HUMANO.map(function (h) {
            return '<div class="tarjeta tarjeta--compacta tarjeta--ok" data-rev>' +
              '<h3><span class="icono">' + h[0] + "</span>" + h[1] + "</h3><p>" + h[2] + "</p></div>";
          }).join("")}
        </div>
      </div>`;
    },
    nota: 'Formulación honesta: la IA no reemplaza profesiones completas, pero <strong>sí desplaza tareas</strong>. Quien aprende a dirigirla amplía su alcance; quien la ignora pierde tiempo compitiendo contra ella.'
  });

  /* ---------------------------------------------------------
     P32 · RUTA DE ADOPCIÓN RESPONSABLE
     --------------------------------------------------------- */
  var RUTA = [
    ["Diagnóstico", "Identificar dónde duele: volumen, reprocesos, pérdidas, tiempos."],
    ["Datos primero", "Sin información limpia y estructurada no hay proyecto viable."],
    ["Caso pequeño y medible", "Un proceso, una meta, una línea base y una fecha."],
    ["Reglas de uso", "Qué datos se pueden usar, en qué herramienta y con qué autorización."],
    ["Humano en el punto de decisión", "Definir explícitamente quién aprueba y qué queda registrado."],
    ["Medición honesta", "Comparar contra la línea base, incluyendo lo que no funcionó."],
    ["Escalar o descartar", "Ampliar lo que demostró valor; cerrar lo que no. Sin castigo al aprendizaje."]
  ];

  window.PANTALLAS.push({
    id: "ruta",
    tema: "futuro",
    modulo: "Aplicación",
    titulo: "¿Por dónde empieza una institución?",
    pregunta: "No por la herramienta. Por el problema, los datos y las reglas del juego.",
    html: function () {
      return `
      <div class="ruta">
        ${RUTA.map(function (r, i) {
          return '<div class="ruta-paso" data-rev="' + (120 + i * 130) + '">' +
            '<span class="ruta-n">' + (i + 1) + "</span>" +
            "<h3>" + r[0] + "</h3><p>" + r[1] + "</p></div>";
        }).join("")}
      </div>
      <div class="aviso aviso--clave" data-rev><span class="marca">🎯</span><p style="margin:0">
        El mejor primer proyecto casi nunca es el más impresionante: es el que
        <b>ahorra trabajo repetitivo, se puede medir en 90 días y no toca decisiones clínicas</b>.</p></div>`;
    }
  });

  /* ---------------------------------------------------------
     P33 · CIERRE
     --------------------------------------------------------- */
  window.PANTALLAS.push({
    id: "cierre",
    tema: "futuro",
    sinCabecera: true,
    html: function () {
      return `
      <div class="cierre">
        <span class="kicker" data-rev>Para llevarse</span>
        <h2 class="titulo cierre-titulo" data-rev>
          La Inteligencia Artificial no decide por el sistema de salud.<br />
          <span class="brillo">Amplía la capacidad de quienes lo sostienen.</span>
        </h2>

        <div class="cierre-ideas">
          <div class="cierre-idea" data-rev><b>1</b><p>La IA encuentra patrones en los datos. No conoce la verdad ni entiende el contexto de su institución.</p></div>
          <div class="cierre-idea" data-rev><b>2</b><p>En lo asistencial acompaña; la decisión y la responsabilidad siguen siendo del profesional habilitado.</p></div>
          <div class="cierre-idea" data-rev><b>3</b><p>En lo administrativo está el retorno más rápido: facturación, glosas, cartera, inventarios y PQRS.</p></div>
          <div class="cierre-idea" data-rev><b>4</b><p>Sin datos limpios y sin reglas de uso, no hay proyecto de IA: hay una expectativa.</p></div>
          <div class="cierre-idea" data-rev><b>5</b><p>Toda cifra y toda norma se verifican en la fuente oficial, con año y fecha de consulta.</p></div>
        </div>

        <div class="cierre-personas" data-rev>
          ${window.PERSONAJES.clinico("Profesional clínico")}
          ${window.PERSONAJES.administrativo("Profesional administrativo")}
          ${window.PERSONAJES.paciente("Paciente")}
          ${window.PERSONAJES.nova("NOVA")}
        </div>
      </div>`;
    },
    nota: 'El siguiente paso no es tecnológico: es decidir <strong>qué problema concreto</strong> de su área quiere resolver primero.'
  });

  /* ---------------------------------------------------------
     P34 · FUENTES Y VERIFICACIÓN
     --------------------------------------------------------- */
  window.PANTALLAS.push({
    id: "fuentes",
    tema: "futuro",
    modulo: "Transparencia",
    titulo: "Fuentes, alcance y verificación",
    pregunta: "Qué se verificó, qué no se pudo verificar y cómo mantener este material actualizado.",
    html: function () {
      return `
      <div class="rejilla" data-col="3">
        <div class="tarjeta" data-rev>
          <h3>📚 Normatividad citada</h3>
          <ul class="lista lista--dos">
            ${window.FUENTES.normas.map(function (n) {
              return "<li>" + n.titulo + "</li>";
            }).join("")}
          </ul>
        </div>
        <div class="tarjeta" data-rev>
          <h3>📊 Indicadores y entidades</h3>
          <ul class="lista">
            <li>DANE — proyecciones de población</li>
            <li>Ministerio de Salud y Protección Social — aseguramiento y normatividad</li>
            <li>ADRES — Base de Datos Única de Afiliados</li>
            <li>SISPRO / REPS — prestadores, sedes y servicios habilitados</li>
            <li>DNP — CONPES de política pública</li>
          </ul>
          <p class="fuente">Consultado el <b>${window.FUENTES.consulta}</b>.</p>
        </div>
        <div class="tarjeta tarjeta--cautela" data-rev>
          <h3>🚧 Límites declarados</h3>
          <ul class="lista lista--x">
            <li>Gasto en salud como % del PIB: dato oficial actualizado no identificado</li>
            <li>Talento humano habilitado (ReTHUS): dato oficial consolidado no identificado</li>
            <li>Cifras de tableros, cartera y ejemplos clínicos: <b>ilustrativas</b>, no reales</li>
            <li>La Resolución citada en el ejemplo de alucinación es <b>ficticia por diseño</b></li>
            <li>Este material es pedagógico y <b>no constituye asesoría jurídica</b></li>
          </ul>
        </div>
      </div>
      <div class="aviso" data-rev><span class="marca">♻️</span><p style="margin:0">
        Para actualizar la capacitación, edite <b class="mono">assets/js/datos/fuentes.js</b>:
        allí están centralizados los indicadores, las normas, los casos y los hitos históricos,
        cada uno con su año y su fuente.</p></div>`;
    },
    nota: 'Fin de la capacitación. Use <strong>Atrás</strong> para revisar cualquier pantalla.'
  });
})();
