/* ============================================================
   FX · utilidades de animación
   Campo de partículas/nodos, contadores, barras, escritura
   progresiva y red neuronal generativa (portada).
   ============================================================ */
window.FX = (function () {
  "use strict";

  var reducido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- utilidades de color ---------- */
  function leerVar(nombre) {
    return getComputedStyle(document.documentElement).getPropertyValue(nombre).trim() || "#6ea8ff";
  }
  function aRGB(hex) {
    hex = hex.replace("#", "");
    if (hex.length === 3) hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    var n = parseInt(hex, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  function mezcla(a, b, t) {
    return [Math.round(a[0] + (b[0] - a[0]) * t), Math.round(a[1] + (b[1] - a[1]) * t), Math.round(a[2] + (b[2] - a[2]) * t)];
  }
  function rgba(c, a) { return "rgba(" + c[0] + "," + c[1] + "," + c[2] + "," + a + ")"; }

  /* ============================================================
     CAMPO DE FONDO: nodos y conexiones (metáfora de red / datos)
     ============================================================ */
  function iniciarCampo(canvas) {
    if (!canvas || reducido) return null;
    var ctx = canvas.getContext("2d");
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var nodos = [], w = 0, h = 0, raf = null;
    var colA = aRGB(leerVar("--p1")), colB = aRGB(leerVar("--p2"));
    var objA = colA.slice(), objB = colB.slice();

    function dimensionar() {
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = Math.floor(w * dpr); canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var densidad = Math.round(Math.min(90, Math.max(26, (w * h) / 26000)));
      nodos = [];
      for (var i = 0; i < densidad; i++) {
        nodos.push({
          x: Math.random() * w, y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.22, vy: (Math.random() - 0.5) * 0.22,
          r: Math.random() * 1.5 + 0.7, t: Math.random()
        });
      }
    }

    function pintar() {
      colA = mezcla(colA, objA, 0.045);
      colB = mezcla(colB, objB, 0.045);
      ctx.clearRect(0, 0, w, h);
      var lim = Math.min(w, h) * 0.16;

      for (var i = 0; i < nodos.length; i++) {
        var n = nodos[i];
        n.x += n.vx; n.y += n.vy;
        if (n.x < -20) n.x = w + 20; if (n.x > w + 20) n.x = -20;
        if (n.y < -20) n.y = h + 20; if (n.y > h + 20) n.y = -20;

        for (var j = i + 1; j < nodos.length; j++) {
          var m = nodos[j], dx = n.x - m.x, dy = n.y - m.y;
          var d = Math.sqrt(dx * dx + dy * dy);
          if (d < lim) {
            ctx.strokeStyle = rgba(mezcla(colA, colB, j / nodos.length), 0.1 * (1 - d / lim));
            ctx.lineWidth = 0.7;
            ctx.beginPath(); ctx.moveTo(n.x, n.y); ctx.lineTo(m.x, m.y); ctx.stroke();
          }
        }
        var c = mezcla(colA, colB, n.t);
        ctx.fillStyle = rgba(c, 0.42);
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, 6.2832); ctx.fill();
      }
      raf = requestAnimationFrame(pintar);
    }

    dimensionar();
    pintar();
    window.addEventListener("resize", function () { cancelAnimationFrame(raf); dimensionar(); pintar(); });

    var api = {
      actualizarPaleta: function () { objA = aRGB(leerVar("--p1")); objB = aRGB(leerVar("--p2")); }
    };
    FXns.campo = api;
    return api;
  }

  /* ============================================================
     CONTADOR ANIMADO
     ============================================================ */
  function contador(el, destino, opc) {
    opc = opc || {};
    var dur = opc.duracion || 1400;
    var dec = opc.decimales || 0;
    var pre = opc.prefijo || "";
    var suf = opc.sufijo || "";
    if (reducido) { el.textContent = pre + formatear(destino, dec) + suf; return; }
    var t0 = null;
    function paso(t) {
      if (!t0) t0 = t;
      var p = Math.min((t - t0) / dur, 1);
      var e = 1 - Math.pow(1 - p, 3);
      el.textContent = pre + formatear(destino * e, dec) + suf;
      if (p < 1) requestAnimationFrame(paso);
    }
    requestAnimationFrame(paso);
  }

  function formatear(n, dec) {
    return n.toLocaleString("es-CO", { minimumFractionDigits: dec, maximumFractionDigits: dec });
  }

  /* Activa todos los [data-contador] dentro de una raíz */
  function activarContadores(raiz, retardo) {
    var els = raiz.querySelectorAll("[data-contador]");
    Array.prototype.forEach.call(els, function (el, i) {
      var v = parseFloat(el.getAttribute("data-contador"));
      var dec = parseInt(el.getAttribute("data-dec") || "0", 10);
      var pre = el.getAttribute("data-pre") || "";
      var suf = el.getAttribute("data-suf") || "";
      setTimeout(function () { contador(el, v, { decimales: dec, prefijo: pre, sufijo: suf }); },
        (retardo || 260) + i * 110);
    });
  }

  /* Activa todas las [data-pct] (barras) dentro de una raíz */
  function activarBarras(raiz, retardo) {
    var els = raiz.querySelectorAll("[data-pct]");
    Array.prototype.forEach.call(els, function (el, i) {
      setTimeout(function () { el.style.width = el.getAttribute("data-pct") + "%"; }, (retardo || 320) + i * 130);
    });
  }

  /* ============================================================
     ESCRITURA PROGRESIVA (texto que se construye)
     ============================================================ */
  function tipear(el, texto, opc) {
    opc = opc || {};
    var v = opc.velocidad || 26;
    if (reducido) { el.textContent = texto; if (opc.alTerminar) opc.alTerminar(); return function () {}; }
    el.textContent = "";
    var i = 0, id = null;
    function tic() {
      el.textContent = texto.slice(0, ++i);
      if (i < texto.length) { id = setTimeout(tic, v); }
      else if (opc.alTerminar) opc.alTerminar();
    }
    id = setTimeout(tic, opc.retardo || 0);
    return function () { clearTimeout(id); };
  }

  /* ============================================================
     RED NEURONAL QUE SE FORMA (portada)
     Puntos de datos dispersos que convergen en una arquitectura
     de capas y luego respiran.
     ============================================================ */
  function redNeuronal(canvas, opc) {
    if (!canvas) return function () {};
    opc = opc || {};
    var ctx = canvas.getContext("2d");
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w = 0, h = 0, raf = null, t0 = performance.now();
    var capas = opc.capas || [4, 7, 7, 3];
    var puntos = [], enlaces = [];

    function construir() {
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = Math.floor(w * dpr); canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      puntos = []; enlaces = [];
      var mx = w * 0.12, my = h * 0.14;
      var paso = (w - mx * 2) / (capas.length - 1);
      var idx = 0, previos = [];
      for (var c = 0; c < capas.length; c++) {
        var n = capas[c], actuales = [];
        for (var i = 0; i < n; i++) {
          var y = my + (h - my * 2) * (n === 1 ? 0.5 : i / (n - 1));
          puntos.push({
            ox: Math.random() * w, oy: Math.random() * h,
            x: 0, y: 0, tx: mx + paso * c, ty: y,
            capa: c, retardo: 220 * c + Math.random() * 320, r: c === 0 || c === capas.length - 1 ? 3.4 : 2.9
          });
          actuales.push(idx++);
        }
        if (previos.length) {
          for (var a = 0; a < previos.length; a++)
            for (var b = 0; b < actuales.length; b++)
              enlaces.push([previos[a], actuales[b], Math.random()]);
        }
        previos = actuales;
      }
    }

    function pintar(t) {
      var ms = t - t0;
      ctx.clearRect(0, 0, w, h);
      var acento = aRGB(leerVar("--acento"));
      var acento2 = aRGB(leerVar("--acento-2"));

      for (var i = 0; i < puntos.length; i++) {
        var p = puntos[i];
        var pr = Math.max(0, Math.min(1, (ms - p.retardo) / 1500));
        var e = 1 - Math.pow(1 - pr, 4);
        p.x = p.ox + (p.tx - p.ox) * e;
        p.y = p.oy + (p.ty - p.oy) * e;
        p.listo = pr;
        if (pr >= 1) {
          p.y = p.ty + Math.sin((ms / 1400) + i) * 2.4;
        }
      }

      for (var k = 0; k < enlaces.length; k++) {
        var a = puntos[enlaces[k][0]], b = puntos[enlaces[k][1]];
        var vis = Math.min(a.listo, b.listo);
        if (vis <= 0.15) continue;
        var alfa = 0.07 + 0.1 * Math.abs(Math.sin(ms / 2400 + enlaces[k][2] * 6));
        ctx.strokeStyle = rgba(mezcla(acento, acento2, enlaces[k][2]), alfa * vis);
        ctx.lineWidth = 0.8;
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      }

      /* Impulsos que recorren la red una vez formada */
      if (ms > 1700) {
        for (var q = 0; q < 14; q++) {
          var en = enlaces[(q * 37) % enlaces.length];
          var pa = puntos[en[0]], pb = puntos[en[1]];
          var fase = ((ms / 1500) + en[2] * 3 + q * 0.13) % 1;
          var px = pa.x + (pb.x - pa.x) * fase, py = pa.y + (pb.y - pa.y) * fase;
          ctx.fillStyle = rgba(acento2, 0.85 * (1 - Math.abs(fase - 0.5) * 1.6));
          ctx.beginPath(); ctx.arc(px, py, 1.7, 0, 6.2832); ctx.fill();
        }
      }

      for (var j = 0; j < puntos.length; j++) {
        var pt = puntos[j];
        var col = pt.capa === 0 ? acento : pt.capa === capas.length - 1 ? acento2 : mezcla(acento, acento2, 0.5);
        var halo = pt.listo >= 1 ? 0.9 + Math.sin(ms / 900 + j) * 0.35 : 0.45;
        ctx.fillStyle = rgba(col, 0.16 * pt.listo);
        ctx.beginPath(); ctx.arc(pt.x, pt.y, pt.r * (2.7 + halo), 0, 6.2832); ctx.fill();
        ctx.fillStyle = rgba(col, 0.42 + 0.5 * pt.listo);
        ctx.beginPath(); ctx.arc(pt.x, pt.y, pt.r, 0, 6.2832); ctx.fill();
      }
      raf = requestAnimationFrame(pintar);
    }

    construir();
    if (reducido) {
      t0 = performance.now() - 4000;
      requestAnimationFrame(function (t) { pintar(t); cancelAnimationFrame(raf); });
    } else {
      raf = requestAnimationFrame(pintar);
    }
    var alRedim = function () { construir(); };
    window.addEventListener("resize", alRedim);
    return function () { cancelAnimationFrame(raf); window.removeEventListener("resize", alRedim); };
  }

  /* ============================================================
     SECUENCIA: revela elementos uno a uno con retardo
     ============================================================ */
  function secuencia(elems, intervalo, clase) {
    var ids = [];
    Array.prototype.forEach.call(elems, function (el, i) {
      ids.push(setTimeout(function () { el.classList.add(clase || "on"); }, i * (intervalo || 420)));
    });
    return function () { ids.forEach(clearTimeout); };
  }

  var FXns = {
    reducido: reducido,
    iniciarCampo: iniciarCampo,
    contador: contador,
    activarContadores: activarContadores,
    activarBarras: activarBarras,
    tipear: tipear,
    redNeuronal: redNeuronal,
    secuencia: secuencia,
    campo: null
  };
  return FXns;
})();
