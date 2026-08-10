/* ============================================================
   PANTALLA 1 · AVISO PREVIO
   Se muestra antes de la portada. Deja constancia del carácter
   educativo de la sesión y de la responsabilidad individual en
   el uso de la inteligencia artificial en el trabajo.
   ============================================================ */
(function () {
  "use strict";
  window.PANTALLAS = window.PANTALLAS || [];

  var PUNTOS = [
    {
      i: "🎓",
      t: "Es un espacio educativo",
      d: "El contenido tiene fines exclusivamente formativos y de divulgación. " +
         "No constituye asesoría clínica, jurídica, financiera ni técnica, " +
         "ni sustituye los manuales, protocolos y políticas de su institución."
    },
    {
      i: "🙋",
      t: "El uso en el trabajo es responsabilidad de cada persona",
      d: "Quien utilice inteligencia artificial en sus labores responde por esa decisión " +
         "y por sus resultados, dentro de las políticas de la institución, su contrato " +
         "y la normatividad vigente."
    },
    {
      i: "🔐",
      t: "Información reservada",
      d: "No ingrese datos personales, historias clínicas ni información institucional " +
         "reservada en herramientas de IA sin autorización expresa y sin verificar " +
         "las condiciones de tratamiento de esos datos."
    },
    {
      i: "🔎",
      t: "Verifique siempre antes de usar",
      d: "Toda salida de un sistema de IA debe contrastarse con la fuente oficial " +
         "antes de utilizarse. La decisión final y la responsabilidad siguen siendo humanas."
    }
  ];

  window.PANTALLAS.unshift({
    id: "aviso",
    tema: "origenes",
    modulo: "Aviso previo · léalo antes de continuar",
    titulo: "Antes de comenzar",
    pregunta: "Cuatro acuerdos que enmarcan todo lo que veremos en las próximas pantallas.",
    html: function () {
      return `
      <div class="columna">
        <div class="rejilla" data-col="4">
          ${PUNTOS.map(function (p) {
            return '<div class="aviso-punto" data-rev>' +
              '<span class="aviso-punto-i">' + p.i + "</span>" +
              "<h3>" + p.t + "</h3><p>" + p.d + "</p></div>";
          }).join("")}
        </div>

        <div class="aviso-banda" data-rev>
          <span class="aviso-banda-eti">Acuerdo central</span>
          <p class="aviso-banda-txt">
            La responsabilidad del uso de la inteligencia artificial en el trabajo
            <span class="brillo">es de cada persona</span>.
          </p>
        </div>
      </div>`;
    },
    nota: 'Las cifras y las normas citadas incluyen su año y su fuente, y fueron consultadas el <strong>' +
          window.FUENTES.consulta + '</strong>. La normatividad cambia: <strong>verifique su vigencia</strong> antes de aplicar cualquier contenido de esta sesión.'
  });
})();
