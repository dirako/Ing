/* ============================================================
   MOTOR DE LA EXPERIENCIA
   - Presentación por pantallas completas (sin scroll, sin menús).
   - Único mecanismo de avance visible: los botones ATRÁS / SIGUIENTE.
   - Ajuste automático para que todo el contenido quede visible.
   ============================================================ */
(function () {
  "use strict";

  /* Espejo de teclado para proyección y accesibilidad (← → / espacio).
     No añade ningún elemento de navegación a la interfaz; si se desea la
     navegación estrictamente limitada a los dos botones, poner en false. */
  var TECLADO = true;

  var PANTALLAS = (window.PANTALLAS || []).slice();

  var escenario = document.getElementById("escenario");
  var btnAtras = document.getElementById("btn-atras");
  var btnSig = document.getElementById("btn-siguiente");
  var contador = document.getElementById("contador");
  var avance = document.getElementById("nav-avance");
  var capas = Array.prototype.slice.call(document.querySelectorAll("#fondo .capa"));

  var indice = 0;
  var animando = false;
  var limpiezaActual = null;
  var pantallaActual = null;
  var reducirMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------------------------------------------------
     1. ESCALA TIPOGRÁFICA RESPONSIVA
     --------------------------------------------------------- */
  function calcularRaiz() {
    var w = window.innerWidth;
    var h = (window.visualViewport && window.visualViewport.height) || window.innerHeight;
    var base;
    if (w < 720) {
      // Teléfonos: manda el ancho; se mantiene la tipografía legible.
      base = Math.min(Math.max(w / 24, 14), 19);
    } else {
      base = Math.min(w / 46, h / 34);
      base = Math.min(Math.max(base, 14), 30);
    }
    document.documentElement.style.fontSize = base.toFixed(2) + "px";
  }

  /* ---------------------------------------------------------
     2. AJUSTE: nada se recorta, nada hace scroll
     --------------------------------------------------------- */
  function ajustar(seccion) {
    if (!seccion) return;
    var marco = seccion.querySelector(".marco");
    if (!marco) return;
    /* Se mide siempre sin escala aplicada; de lo contrario el propio ajuste
       se realimentaría y el contenido quedaría recortado. */
    marco.style.transform = "none";
    void marco.offsetHeight;

    var estilo = getComputedStyle(seccion);
    var padY = parseFloat(estilo.paddingTop) + parseFloat(estilo.paddingBottom);
    var padX = parseFloat(estilo.paddingLeft) + parseFloat(estilo.paddingRight);
    var dispAlto = escenario.clientHeight - padY;
    var dispAncho = escenario.clientWidth - padX;

    var caja = marco.getBoundingClientRect();
    var fy = caja.height > dispAlto ? dispAlto / caja.height : 1;
    var fx = caja.width > dispAncho ? dispAncho / caja.width : 1;
    var f = Math.min(fy, fx);

    if (f < 0.999) {
      marco.style.transform = "scale(" + Math.max(f, 0.55).toFixed(4) + ")";
    }
  }

  function ajustarActual() {
    ajustar(pantallaActual);
  }

  /* ---------------------------------------------------------
     3. CONSTRUCCIÓN DE UNA PANTALLA
     --------------------------------------------------------- */
  function construir(def, i) {
    var sec = document.createElement("section");
    sec.className = "pantalla";
    sec.setAttribute("data-tema", def.tema || "origenes");
    sec.setAttribute("data-id", def.id || "p" + i);
    sec.setAttribute("role", "group");
    sec.setAttribute("aria-label", "Pantalla " + (i + 1) + " de " + PANTALLAS.length + ": " + (def.titulo || ""));

    var marco = document.createElement("div");
    marco.className = "marco" + (def.marcoClase ? " " + def.marcoClase : "");

    var interior = "";
    if (!def.sinCabecera) {
      interior +=
        '<header class="cab" data-rev>' +
        (def.modulo ? '<span class="kicker">' + def.modulo + "</span>" : "") +
        (def.titulo ? '<h2 class="titulo">' + def.titulo + "</h2>" : "") +
        (def.pregunta ? '<p class="pregunta">' + def.pregunta + "</p>" : "") +
        "</header>";
    }
    interior += '<div class="cuerpo">' + (typeof def.html === "function" ? def.html() : def.html || "") + "</div>";
    if (def.nota) interior += '<p class="nota" data-rev>' + def.nota + "</p>";

    marco.innerHTML = interior;
    sec.appendChild(marco);
    return sec;
  }

  function escalonar(sec) {
    var elems = sec.querySelectorAll("[data-rev]");
    for (var i = 0; i < elems.length; i++) {
      var d = elems[i].getAttribute("data-rev");
      elems[i].style.setProperty("--rd", (d && d !== "" ? parseInt(d, 10) : 120 + i * 85));
    }
    sec.classList.add("rev-on");
  }

  /* ---------------------------------------------------------
     4. FONDO CROMÁTICO POR MÓDULO
     --------------------------------------------------------- */
  function pintarFondo(tema) {
    document.documentElement.setAttribute("data-tema", tema);
    for (var i = 0; i < capas.length; i++) {
      capas[i].classList.toggle("activa", capas[i].getAttribute("data-capa") === tema);
    }
    if (window.FX && window.FX.campo) window.FX.campo.actualizarPaleta();
  }

  /* ---------------------------------------------------------
     5. NAVEGACIÓN
     --------------------------------------------------------- */
  function actualizarNav() {
    var total = PANTALLAS.length;
    btnAtras.disabled = indice === 0;
    btnSig.disabled = indice === total - 1;
    btnSig.style.visibility = indice === total - 1 ? "hidden" : "visible";
    contador.textContent = "Pantalla " + (indice + 1) + " de " + total;
    avance.style.width = (total > 1 ? (indice / (total - 1)) * 100 : 100) + "%";
  }

  function mostrar(nuevo, direccion) {
    if (animando) return;
    if (nuevo < 0 || nuevo >= PANTALLAS.length) return;

    var def = PANTALLAS[nuevo];
    var anterior = pantallaActual;
    animando = true;

    if (typeof limpiezaActual === "function") {
      try { limpiezaActual(); } catch (e) { /* una animación no debe romper la navegación */ }
      limpiezaActual = null;
    }

    var sec = construir(def, nuevo);
    pintarFondo(def.tema || "origenes");

    if (anterior) {
      anterior.classList.remove("entra", "entra-r");
      anterior.classList.add(direccion < 0 ? "sale-r" : "sale");
      var viejo = anterior;
      setTimeout(function () { if (viejo.parentNode) viejo.parentNode.removeChild(viejo); },
        reducirMovimiento ? 10 : 400);
    }

    escenario.appendChild(sec);
    sec.classList.add(direccion < 0 ? "entra-r" : "entra");
    pantallaActual = sec;
    indice = nuevo;
    actualizarNav();

    if (typeof def.init === "function") {
      try { limpiezaActual = def.init(sec, { ajustar: ajustarActual, reducirMovimiento: reducirMovimiento }); }
      catch (e) { console.warn("Error inicializando la pantalla", def.id, e); }
    }

    requestAnimationFrame(function () {
      ajustar(sec);
      escalonar(sec);
      requestAnimationFrame(function () { ajustar(sec); });
    });
    /* El bloqueo dura solo lo que tarda en salir la pantalla anterior: si se
       prolongara hasta el final de la entrada, quien avance rápido con el
       botón o con el control remoto perdería pulsaciones. */
    setTimeout(function () {
      ajustar(sec);
      animando = false;
      atenderPendiente();
    }, reducirMovimiento ? 20 : 400);
    setTimeout(function () { ajustar(sec); }, 780);
  }

  /* Si llega una pulsación mientras una pantalla está entrando, se guarda y se
     atiende al terminar. Así quien avanza rápido —con el botón, el teclado o un
     control remoto— nunca pierde un paso. */
  var pendiente = 0;

  function siguiente() {
    if (animando) { pendiente = 1; return; }
    if (indice < PANTALLAS.length - 1) mostrar(indice + 1, 1);
  }
  function atras() {
    if (animando) { pendiente = -1; return; }
    if (indice > 0) mostrar(indice - 1, -1);
  }
  function atenderPendiente() {
    var p = pendiente;
    pendiente = 0;
    if (p === 1) siguiente();
    else if (p === -1) atras();
  }

  btnSig.addEventListener("click", siguiente);
  btnAtras.addEventListener("click", atras);

  if (TECLADO) {
    window.addEventListener("keydown", function (ev) {
      if (ev.target && /^(INPUT|TEXTAREA|SELECT)$/.test(ev.target.tagName)) return;
      if (ev.key === "ArrowRight" || ev.key === "PageDown" || ev.key === " ") { ev.preventDefault(); siguiente(); }
      else if (ev.key === "ArrowLeft" || ev.key === "PageUp") { ev.preventDefault(); atras(); }
    });
  }

  /* Evita cualquier desplazamiento accidental del documento */
  window.addEventListener("wheel", function (e) { e.preventDefault(); }, { passive: false });
  document.addEventListener("gesturestart", function (e) { e.preventDefault(); });

  /* ---------------------------------------------------------
     6. ARRANQUE
     --------------------------------------------------------- */
  var reajuste;
  function alRedimensionar() {
    clearTimeout(reajuste);
    calcularRaiz();
    reajuste = setTimeout(function () { calcularRaiz(); ajustarActual(); }, 120);
    ajustarActual();
  }
  window.addEventListener("resize", alRedimensionar);
  window.addEventListener("orientationchange", function () { setTimeout(alRedimensionar, 250); });
  if (window.visualViewport) window.visualViewport.addEventListener("resize", alRedimensionar);

  calcularRaiz();

  if (!PANTALLAS.length) {
    escenario.innerHTML =
      '<section class="pantalla"><div class="marco centro"><h2 class="titulo">No se cargaron las pantallas</h2>' +
      '<p class="pregunta">Verifique que los archivos de <code>assets/js/pantallas/</code> estén disponibles.</p></div></section>';
    return;
  }

  if (window.FX && window.FX.iniciarCampo) window.FX.iniciarCampo(document.getElementById("campo"));
  mostrar(0, 1);

  /* Reajusta cuando las fuentes terminan de cargar (evita saltos de layout) */
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () { calcularRaiz(); ajustarActual(); });
  }

  window.EXPERIENCIA = {
    ir: function (n) { mostrar(n, n > indice ? 1 : -1); },
    total: PANTALLAS.length,
    indice: function () { return indice; },
    ajustar: ajustarActual
  };
})();
