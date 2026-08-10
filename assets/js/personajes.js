/* ============================================================
   PERSONAJES recurrentes de la capacitación
   - NOVA: la inteligencia artificial, representada como núcleo
     digital de nodos (no como robot humanoide).
   - Profesional clínico, profesional administrativo y paciente:
     siluetas neutras y respetuosas, diferenciadas por su función.
   ============================================================ */
window.PERSONAJES = (function () {
  "use strict";

  function envolver(contenido, clase, etiqueta) {
    return (
      '<figure class="personaje ' + (clase || "") + '" role="img" aria-label="' + etiqueta + '">' +
      '<div class="personaje-lienzo">' + contenido + "</div>" +
      '<figcaption>' + etiqueta + "</figcaption></figure>"
    );
  }

  /* ---------- NOVA: núcleo digital ---------- */
  function novaSVG(id) {
    id = id || "nova" + Math.random().toString(36).slice(2, 7);
    var nodos = "";
    for (var i = 0; i < 8; i++) {
      var ang = (Math.PI * 2 * i) / 8;
      var x = 50 + Math.cos(ang) * 33, y = 50 + Math.sin(ang) * 33;
      nodos +=
        '<line x1="50" y1="50" x2="' + x.toFixed(1) + '" y2="' + y.toFixed(1) +
        '" stroke="var(--acento)" stroke-width="1" opacity=".45"/>' +
        '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="3.1" fill="var(--acento-2)">' +
        '<animate attributeName="opacity" values=".35;1;.35" dur="' + (2.4 + i * 0.22).toFixed(2) +
        's" repeatCount="indefinite"/></circle>';
    }
    return (
      '<svg class="svg-nova" viewBox="0 0 100 100" aria-hidden="true">' +
      '<defs><radialGradient id="' + id + '-g"><stop offset="0%" stop-color="var(--acento-2)" stop-opacity=".95"/>' +
      '<stop offset="60%" stop-color="var(--acento)" stop-opacity=".35"/>' +
      '<stop offset="100%" stop-color="var(--acento)" stop-opacity="0"/></radialGradient></defs>' +
      '<circle cx="50" cy="50" r="46" fill="url(#' + id + '-g)" opacity=".55"/>' +
      '<g class="nova-orbita">' +
      '<circle cx="50" cy="50" r="33" fill="none" stroke="var(--acento)" stroke-width="1" ' +
      'stroke-dasharray="4 7" opacity=".7"/></g>' +
      '<g class="nova-orbita nova-orbita--inv">' +
      '<circle cx="50" cy="50" r="22" fill="none" stroke="var(--acento-2)" stroke-width="1" ' +
      'stroke-dasharray="2 6" opacity=".8"/></g>' +
      nodos +
      '<circle cx="50" cy="50" r="11" fill="var(--acento-2)" opacity=".18"/>' +
      '<circle cx="50" cy="50" r="6.5" fill="var(--acento-2)">' +
      '<animate attributeName="r" values="6.5;8;6.5" dur="2.8s" repeatCount="indefinite"/></circle>' +
      "</svg>"
    );
  }

  /* ---------- Siluetas humanas ---------- */
  function base(accesorio, tono) {
    return (
      '<svg class="svg-persona" viewBox="0 0 100 100" aria-hidden="true">' +
      '<circle cx="50" cy="50" r="47" fill="' + tono + '" opacity=".16"/>' +
      '<circle cx="50" cy="50" r="47" fill="none" stroke="' + tono + '" stroke-width="1.2" opacity=".6"/>' +
      '<circle cx="50" cy="38" r="13" fill="' + tono + '" opacity=".85"/>' +
      '<path d="M22 84c2-16 13-25 28-25s26 9 28 25z" fill="' + tono + '" opacity=".85"/>' +
      accesorio +
      "</svg>"
    );
  }

  function clinicoSVG() {
    /* fonendoscopio esquemático */
    var acc =
      '<path d="M40 60c0 9 5 14 10 14s10-5 10-14" fill="none" stroke="#04141a" stroke-width="2.4" ' +
      'stroke-linecap="round" opacity=".8"/>' +
      '<circle cx="60" cy="76" r="4.2" fill="#04141a" opacity=".8"/>';
    return base(acc, "var(--acento)");
  }

  function administrativoSVG() {
    var acc =
      '<rect x="38" y="62" width="24" height="20" rx="2.4" fill="#04101c" opacity=".78"/>' +
      '<path d="M42 68h16M42 73h16M42 78h10" stroke="var(--acento-2)" stroke-width="1.8" stroke-linecap="round"/>';
    return base(acc, "var(--acento-2)");
  }

  function pacienteSVG() {
    var acc =
      '<path d="M36 74h8l3-6 4 11 4-8 3 3h8" fill="none" stroke="#0b1a12" stroke-width="2.2" ' +
      'stroke-linecap="round" stroke-linejoin="round" opacity=".85"/>';
    return base(acc, "var(--acento-3)");
  }

  return {
    novaSVG: novaSVG,
    nova: function (etiqueta) { return envolver(novaSVG(), "personaje--nova", etiqueta || "NOVA · la inteligencia artificial"); },
    clinico: function (etiqueta) { return envolver(clinicoSVG(), "personaje--clinico", etiqueta || "Profesional clínico"); },
    administrativo: function (etiqueta) { return envolver(administrativoSVG(), "personaje--admin", etiqueta || "Profesional administrativo"); },
    paciente: function (etiqueta) { return envolver(pacienteSVG(), "personaje--paciente", etiqueta || "Paciente"); },
    clinicoSVG: clinicoSVG,
    administrativoSVG: administrativoSVG,
    pacienteSVG: pacienteSVG
  };
})();
