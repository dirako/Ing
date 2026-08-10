/* ============================================================
   PANTALLA FINAL · CONTACTO
   Los datos se editan en assets/js/datos/autor.js
   ============================================================ */
(function () {
  "use strict";
  window.PANTALLAS = window.PANTALLAS || [];

  var A = window.AUTOR || {};

  var CAMPOS = [
    { k: "correo", i: "✉️", r: "Correo", enlace: function (v) { return "mailto:" + v; } },
    { k: "telefono", i: "📱", r: "Teléfono", enlace: function (v) { return "tel:" + v.replace(/[^+\d]/g, ""); } },
    { k: "linkedin", i: "in", r: "LinkedIn" },
    { k: "web", i: "🌐", r: "Sitio" }
  ];

  /* La invitación a seguir las redes se destaca aparte de los datos de
     contacto: es una llamada a la acción, no un dato más de la tarjeta. */
  function invitacion() {
    if (!hay(A.redes)) return "";
    return '<div class="seguir" data-rev>' +
      '<span class="seguir-txt">Si quiere seguir estos temas del sistema de salud ' +
      'colombiano y de inteligencia artificial, lo invito a seguirme en</span>' +
      '<span class="seguir-usuario">' + A.redes.trim() + "</span></div>";
  }

  function hay(v) { return typeof v === "string" && v.trim() !== ""; }

  window.PANTALLAS.push({
    id: "contacto",
    tema: "futuro",
    sinCabecera: true,
    html: function () {
      var identidad = "";
      if (hay(A.nombre)) identidad += '<h2 class="tarjeta-nombre">' + A.nombre + "</h2>";
      if (hay(A.cargo)) identidad += '<p class="tarjeta-cargo">' + A.cargo + "</p>";

      var lugar = [A.institucion, A.ciudad].filter(hay).join(" · ");
      if (lugar) identidad += '<p class="tarjeta-lugar">' + lugar + "</p>";

      var datos = CAMPOS.filter(function (c) { return hay(A[c.k]); }).map(function (c) {
        var v = A[c.k].trim();
        var contenido = c.enlace
          ? '<a href="' + c.enlace(v) + '">' + v + "</a>"
          : "<span>" + v + "</span>";
        return '<li data-rev><span class="dato-i" aria-hidden="true">' + c.i + "</span>" +
          '<span class="dato-txt"><b>' + c.r + "</b>" + contenido + "</span></li>";
      }).join("");

      var pendiente = identidad === "" && datos === ""
        ? '<p class="sin-dato">Complete sus datos en <span class="mono">assets/js/datos/autor.js</span></p>'
        : "";

      return `
      <div class="contacto">
        <span class="kicker" data-rev>Gracias por su atención</span>

        <div class="tarjeta-contacto" data-rev>
          <div class="tarjeta-nova">${window.PERSONAJES.novaSVG("contacto")}</div>
          <div class="tarjeta-identidad">
            ${identidad}
            ${datos ? '<ul class="tarjeta-datos">' + datos + "</ul>" : ""}
            ${pendiente}
          </div>
        </div>

        ${invitacion()}
        ${hay(A.mensaje) ? '<p class="contacto-mensaje" data-rev>' + A.mensaje + "</p>" : ""}
      </div>`;
    },
    nota: 'Fin de la capacitación. Use <strong>Atrás</strong> para volver a cualquier pantalla.'
  });
})();
