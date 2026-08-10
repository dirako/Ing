/* ============================================================
   MÓDULO 6 · COLOMBIA
   Cifras verificables, territorio real, casos documentados y
   marco normativo vigente.
   ============================================================ */
(function () {
  "use strict";
  window.PANTALLAS = window.PANTALLAS || [];

  /* ---------------------------------------------------------
     P25 · COLOMBIA EN CIFRAS
     --------------------------------------------------------- */
  window.PANTALLAS.push({
    id: "colombia-cifras",
    tema: "colombia",
    modulo: "Colombia · 01",
    titulo: "Colombia en cifras",
    pregunta: "Cada indicador se presenta con su valor, su año y su fuente. Cuando no fue posible identificar un dato oficial actualizado, se dice expresamente.",
    html: function () {
      return `
      <div class="columna">
        <div class="rejilla" data-col="3">
          ${window.FUENTES.indicadores.map(function (d) {
            if (d.sinDato) {
              return `<div class="tarjeta tarjeta--vacia" data-rev>
                        <span class="rotulo-ind">${d.rotulo}</span>
                        <p class="sin-dato">Dato oficial actualizado no identificado</p>
                        <p class="fuente">${d.fuente}</p>
                      </div>`;
            }
            return `<div class="tarjeta ${d.cautela ? "tarjeta--cautela" : ""}" data-rev>
                      <span class="rotulo-ind">${d.rotulo}</span>
                      <span class="valor-ind" data-contador="${d.valor}" data-dec="${d.dec}" data-suf="${d.sufijo}">0</span>
                      <p class="detalle-ind">${d.detalle || ""}</p>
                      <p class="fuente"><b>Año:</b> ${d.anio} · <b>Fuente:</b> ${d.fuente}</p>
                    </div>`;
          }).join("")}
        </div>

      </div>`;
    },
    nota: 'Fuentes de referencia para actualizar: <strong>DANE, MinSalud, SISPRO, ADRES, SuperSalud, INS, Cuenta de Alto Costo, DNP y MinTIC</strong>. Consultado el <strong>' + window.FUENTES.consulta + '</strong>: revalide antes de cada sesión.',
    init: function (raiz) { window.FX.activarContadores(raiz, 600); }
  });

  /* ---------------------------------------------------------
     P26 · MAPA DE COLOMBIA (geometría real)
     --------------------------------------------------------- */
  window.PANTALLAS.push({
    id: "mapa",
    tema: "colombia",
    modulo: "Colombia · 02",
    titulo: "Un país donde la distancia también es un problema de salud",
    pregunta: "Las capacidades de analítica y telesalud valen más justamente donde hay menos recursos disponibles.",
    html: function () {
      var geo = window.GEO_COLOMBIA;
      if (!geo) return '<p class="sin-dato">No fue posible cargar la geometría del mapa.</p>';
      var paths = geo.departamentos.map(function (d, i) {
        return '<path d="' + d.d + '" class="dep" style="--dd:' + (i * 45) + '"><title>' + d.nombre + "</title></path>";
      }).join("");
      return `
      <div class="mapa-bloque">
        <div class="mapa-caja">
          <svg viewBox="${geo.viewBox}" class="mapa-svg" role="img"
               aria-label="Mapa de Colombia con la división departamental">
            <g class="mapa-g">${paths}</g>
          </svg>
          <p class="fuente mapa-fuente">Geometría: ${geo.fuente}. Reproyectada para esta presentación.</p>
        </div>
        <div class="mapa-txt">
          <div class="tarjeta tarjeta--compacta" data-rev><h3>Territorio diverso</h3><p>Zonas urbanas densas y regiones extensas con población dispersa conviven en el mismo sistema de salud.</p></div>
          <div class="tarjeta tarjeta--compacta" data-rev><h3>Acceso desigual</h3><p>La distancia, la conectividad y la disponibilidad de especialistas no se distribuyen de manera uniforme.</p></div>
          <div class="tarjeta tarjeta--compacta" data-rev><h3>Telemedicina</h3><p>Donde el especialista no puede estar, la consulta remota amplía la capacidad resolutiva.</p></div>
          <div class="tarjeta tarjeta--compacta" data-rev><h3>Analítica territorial</h3><p>Los datos permiten ver dónde se concentra la demanda y dónde faltan servicios.</p></div>
          <div class="tarjeta tarjeta--compacta" data-rev><h3>Predicción de necesidades</h3><p>Anticipar picos de atención por temporada, territorio y perfil poblacional.</p></div>
          <div class="tarjeta tarjeta--compacta" data-rev><h3>Distribución de recursos</h3><p>Asignar personal, insumos y ambulancias con base en evidencia y no solo en histórico.</p></div>
        </div>
      </div>`;
    },
    nota: 'Este mapa <strong>no muestra indicadores departamentales</strong>: representa únicamente la geografía. Cualquier cifra por departamento debe tomarse de la fuente oficial correspondiente.'
  });

  /* ---------------------------------------------------------
     P27 · CASOS Y EXPERIENCIAS EN COLOMBIA
     --------------------------------------------------------- */
  var ETIQUETAS = {
    implementado: "Caso implementado",
    piloto: "Piloto",
    investigacion: "Investigación",
    propuesta: "Propuesta / anuncio"
  };

  window.PANTALLAS.push({
    id: "casos-colombia",
    tema: "colombia",
    modulo: "Colombia · 03",
    titulo: "¿Qué está pasando realmente en Colombia?",
    pregunta: "Distinguir entre lo implementado, lo piloto, lo investigado y lo anunciado evita construir expectativas sobre algo que todavía no existe.",
    html: function () {
      return `
      <div class="columna">
        <div class="rejilla" data-col="5">
          ${window.FUENTES.casos.map(function (c) {
            return `<div class="tarjeta tarjeta--compacta caso" data-rev>
                      <span class="etiqueta et-${c.estado}">${ETIQUETAS[c.estado]}</span>
                      <h3>${c.titulo}</h3>
                      <p>${c.texto}</p>
                      <p class="fuente">${c.fuente}</p>
                    </div>`;
          }).join("")}
        </div>
        <div class="aviso aviso--alerta" data-rev><span class="marca">🧭</span><p style="margin:0">
          <b>No se atribuye ninguna tecnología a una institución sin evidencia documental.</b>
          Cuando el respaldo es una nota de prensa o un anuncio, se marca como tal y no como
          implementación verificada.</p></div>
      </div>`;
    },
    nota: 'Fecha de consulta: <strong>' + window.FUENTES.consulta + '</strong>. Verifique la vigencia y el alcance real de cada iniciativa antes de citarla en un comité.'
  });

  /* ---------------------------------------------------------
     P28 · IA, DATOS Y RESPONSABILIDAD EN SALUD
     --------------------------------------------------------- */
  window.PANTALLAS.push({
    id: "marco-normativo",
    tema: "colombia",
    modulo: "Colombia · 04",
    titulo: "IA, datos y responsabilidad en salud",
    pregunta: "Una norma vigente, una recomendación, una política pública y un proyecto de ley no obligan de la misma manera. Distinguirlos es parte del uso responsable.",
    html: function () {
      var norm = window.FUENTES.normas.filter(function (n) { return n.clase === "norma"; });
      var pol = window.FUENTES.normas.filter(function (n) { return n.clase === "politica"; });
      var proy = window.FUENTES.normas.filter(function (n) { return n.clase === "proyecto"; });

      function caja(n) {
        return `<div class="norma-min ${n.destacada ? "norma-min--dest" : ""}" data-rev>
                  <b>${n.titulo}</b><span class="norma-tema">${n.tema}</span>
                </div>`;
      }

      return `
      <div class="columna">
        <div class="marco-cols">
          <div class="marco-col marco-col--vigente">
            <span class="marco-eti">Norma vigente · obliga</span>
            <div class="marco-lista">${norm.map(caja).join("")}</div>
          </div>
          <div class="marco-col marco-col--politica">
            <span class="marco-eti">Política pública · orienta</span>
            <div class="marco-lista">${pol.map(caja).join("")}</div>
            <p class="marco-nota">Hoja de ruta de IA a 2030 en seis ejes, con la salud entre los sectores
            priorizados. <b>Orienta la acción del Estado; no impone obligaciones sancionables.</b></p>
          </div>
          <div class="marco-col marco-col--proyecto">
            <span class="marco-eti">Proyecto de ley · no obliga</span>
            <div class="marco-lista">${proy.map(caja).join("")}</div>
            <p class="marco-nota">Propone regular el uso de la IA y crear una autoridad de supervisión.
            <b>En trámite: no es norma vigente y no puede citarse como obligación.</b></p>
          </div>
        </div>

        <div class="principios" data-rev>
          <span><b>🔐 Dato sensible</b> autorización reforzada y finalidad explícita</span>
          <span><b>🗂️ Historia clínica</b> documento bajo reserva; su uso no es libre</span>
          <span><b>🔄 Interoperabilidad</b> estándar, plataforma y responsables definidos</span>
          <span><b>⚖️ Responsabilidad</b> responde quien decide, no el sistema que sugiere</span>
        </div>
      </div>`;
    },
    nota: 'Consultado el <strong>' + window.FUENTES.consulta + '</strong>. Esta pantalla es material pedagógico: <strong>no constituye asesoría jurídica</strong> ni interpretación normativa oficial.'
  });
})();
