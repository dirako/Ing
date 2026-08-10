/* ============================================================
   REGISTRO DE FUENTES Y DATOS VERIFICABLES
   ------------------------------------------------------------
   Regla de la capacitación: ninguna cifra ni norma se presenta
   sin (a) valor, (b) año del dato, (c) fuente y (d) fecha de
   consulta. Cuando no fue posible identificar un dato oficial
   suficientemente actualizado, se declara expresamente en lugar
   de estimarlo.
   ------------------------------------------------------------
   FECHA DE CONSULTA DE ESTE BLOQUE: 9 de agosto de 2026.
   Antes de dictar la capacitación, revalide la vigencia.
   ============================================================ */
window.FUENTES = (function () {
  "use strict";

  var CONSULTA = "9 de agosto de 2026";

  /* ---------- Indicadores del país y del sistema de salud ---------- */
  var indicadores = [
    {
      id: "poblacion",
      rotulo: "Población de Colombia",
      valor: 53.4,
      dec: 1,
      sufijo: " millones",
      anio: "proyección 2026",
      fuente: "DANE · Proyecciones de población con base en el Censo Nacional de Población y Vivienda 2018",
      detalle: "53.399.171 personas proyectadas para 2026."
    },
    {
      id: "cobertura",
      rotulo: "Cobertura de aseguramiento en salud",
      valor: 98.56,
      dec: 2,
      sufijo: " %",
      anio: "cierre de 2024",
      fuente: "Ministerio de Salud y Protección Social · Comportamiento del aseguramiento",
      detalle: "La cobertura pasó de 29,21 % en 1995 a 98,56 % al cierre de 2024."
    },
    {
      id: "afiliados",
      rotulo: "Personas afiliadas al SGSSS (BDUA)",
      valor: 52.4,
      dec: 1,
      sufijo: " millones",
      anio: "dato reportado en 2025-2026",
      fuente: "ADRES · Base de Datos Única de Afiliados (BDUA)",
      detalle: "Verifique el corte exacto en el reporte vigente de BDUA antes de citarlo.",
      cautela: true
    },
    {
      id: "prestadores",
      rotulo: "Prestadores inscritos en el REPS",
      valor: 59092,
      dec: 0,
      sufijo: "",
      anio: "consulta de enero de 2025",
      fuente: "REPS · Registro Especial de Prestadores de Servicios de Salud (SISPRO / MinSalud)",
      detalle: "74.444 sedes y 226.887 servicios habilitados en la misma consulta."
    },
    {
      id: "gasto",
      rotulo: "Gasto en salud como % del PIB",
      sinDato: true,
      fuente: "No se identificó una cifra oficial colombiana suficientemente actualizada durante esta consulta.",
      anio: "—"
    },
    {
      id: "talento",
      rotulo: "Talento humano en salud habilitado (ReTHUS)",
      sinDato: true,
      fuente: "No se identificó una cifra oficial consolidada y comparable durante esta consulta.",
      anio: "—"
    }
  ];

  /* ---------- Marco normativo y de política pública ---------- */
  var normas = [
    {
      clase: "norma",
      titulo: "Ley 1581 de 2012",
      tema: "Protección de datos personales",
      texto: "Régimen general de protección de datos personales. Clasifica los datos de salud como <b>datos sensibles</b>, con tratamiento restringido y autorización reforzada.",
      entidad: "Congreso de la República"
    },
    {
      clase: "norma",
      titulo: "Resolución 1995 de 1999",
      tema: "Historia clínica",
      texto: "Normas para el manejo de la historia clínica: obligatoriedad, custodia, retención y reserva del documento.",
      entidad: "Ministerio de Salud"
    },
    {
      clase: "norma",
      titulo: "Ley 2015 de 2020",
      tema: "Historia clínica electrónica interoperable",
      texto: "Crea la Historia Clínica Electrónica Interoperable (IHCE) y ordena su implementación por los actores del sistema. Sancionada el 31 de enero de 2020.",
      entidad: "Congreso de la República"
    },
    {
      clase: "norma",
      titulo: "Resolución 866 de 2021",
      tema: "Datos clínicos mínimos",
      texto: "Define el conjunto de datos clínicos mínimos de la IHCE y los catálogos de terminología obligatorios.",
      entidad: "Ministerio de Salud y Protección Social"
    },
    {
      clase: "norma",
      titulo: "Resolución 1888 de 2025",
      tema: "Resumen Digital de Atención (RDA)",
      texto: "Reglamenta la implementación de la IHCE y adopta el <b>Resumen Digital de Atención (RDA)</b>, con intercambio bajo el estándar HL7 FHIR R4 y transmisión cifrada a la plataforma nacional. El periodo de adecuación técnica venció el 15 de abril de 2026.",
      entidad: "Ministerio de Salud y Protección Social"
    },
    {
      clase: "norma",
      titulo: "Resolución 948 de 2026",
      tema: "RIPS como soporte de la FEV",
      texto: "Norma vigente del RIPS como soporte de la Factura Electrónica de Venta en salud. <b>Deroga la Resolución 2275 de 2023 y las Resoluciones 558 y 1884 de 2024.</b> Publicada en el Diario Oficial n.º 53.495 del 14 de mayo de 2026.",
      entidad: "Ministerio de Salud y Protección Social",
      destacada: true
    },
    {
      clase: "norma",
      titulo: "Resolución 2284 de 2023",
      tema: "Glosas y devoluciones",
      texto: "Establece los soportes de cobro de la factura de venta en salud y el <b>Manual Único de Devoluciones, Glosas y Respuestas</b>; sus causales son taxativas y no pueden crearse ni modificarse.",
      entidad: "Ministerio de Salud y Protección Social",
      destacada: true
    },
    {
      clase: "norma",
      titulo: "Ley 1419 de 2010 y Resolución 2654 de 2019",
      tema: "Telesalud y telemedicina",
      texto: "La ley fija los lineamientos de telesalud; la resolución reglamenta la telesalud y define las categorías y parámetros de la práctica de telemedicina.",
      entidad: "Congreso de la República / Ministerio de Salud y Protección Social"
    },
    {
      clase: "norma",
      titulo: "Ley 1751 de 2015",
      tema: "Derecho fundamental a la salud",
      texto: "Ley Estatutaria de Salud: regula el derecho fundamental a la salud y establece la autonomía profesional como principio, con autorregulación y ética.",
      entidad: "Congreso de la República"
    },
    {
      clase: "politica",
      titulo: "CONPES 4144 de 2025",
      tema: "Política Nacional de Inteligencia Artificial",
      texto: "Política pública de IA a 2030 en seis ejes: ética y gobernanza; datos e infraestructura; I+D+i; talento y capacidades digitales; mitigación de riesgos; y uso y adopción. Aprobada el 14 de febrero de 2025. <b>Es política pública, no norma sancionatoria.</b>",
      entidad: "Consejo Nacional de Política Económica y Social · DNP"
    },
    {
      clase: "proyecto",
      titulo: "Proyecto de ley de inteligencia artificial",
      tema: "En trámite legislativo",
      texto: "Iniciativa que propone regular el desarrollo y uso de la IA y crear una autoridad nacional de supervisión. <b>A la fecha de consulta se encuentra en trámite: no es norma vigente y no puede citarse como obligación.</b>",
      entidad: "Congreso de la República · MinCiencias"
    }
  ];

  /* ---------- Casos y experiencias en Colombia ---------- */
  var casos = [
    {
      estado: "implementado",
      titulo: "Imágenes diagnósticas asistidas por IA",
      texto: "Reconstrucción de imagen con aprendizaje profundo en un servicio de radiología, con reducción del tiempo de estudio.",
      fuente: "Comunicaciones institucionales y prensa sectorial (2024-2025)."
    },
    {
      estado: "implementado",
      titulo: "Agendamiento y orientación conversacional",
      texto: "Gestión de citas a gran escala y orientación inicial del usuario mediante asistentes conversacionales.",
      fuente: "Prensa sectorial (2025-2026). Cifras de proveedor, no auditadas oficialmente."
    },
    {
      estado: "piloto",
      titulo: "Analítica predictiva en vigilancia epidemiológica",
      texto: "Anticipar brotes y optimizar recursos con monitoreo en tiempo real.",
      fuente: "Latam HealthTech Forum 2025 · prensa sectorial."
    },
    {
      estado: "propuesta",
      titulo: "IA en auditoría y trámite de pagos",
      texto: "Anuncios sobre uso de IA para agilizar auditoría y pagos a prestadores.",
      fuente: "Prensa económica (2026). Verifique el acto administrativo antes de citarlo como implementación."
    },
    {
      estado: "investigacion",
      titulo: "Investigación académica nacional",
      texto: "Visión por computador en imágenes médicas, lenguaje clínico y modelos de riesgo.",
      fuente: "Producción académica. Revise la publicación antes de atribuir resultados."
    }
  ];

  /* ---------- Hitos históricos de la IA (fechas verificables) ---------- */
  var hitos = [
    { anio: "1950", txt: "Alan Turing publica <i>Computing Machinery and Intelligence</i> y plantea el juego de imitación (prueba de Turing).", fuerte: true },
    { anio: "1956", txt: "Conferencia de Dartmouth. John McCarthy acuña el término <i>inteligencia artificial</i>.", fuerte: true },
    { anio: "1957-58", txt: "Frank Rosenblatt presenta el perceptrón, primer modelo de aprendizaje conexionista." },
    { anio: "1965-76", txt: "Primeros sistemas expertos (DENDRAL y luego MYCIN, en el dominio médico)." },
    { anio: "1973-80", txt: "Primer invierno de la IA tras el informe Lighthill y el recorte de financiación." },
    { anio: "1986", txt: "Se populariza la retropropagación para entrenar redes multicapa (Rumelhart, Hinton y Williams)." },
    { anio: "1987-93", txt: "Segundo invierno de la IA: colapso del mercado de máquinas LISP y de los sistemas expertos." },
    { anio: "1997", txt: "Deep Blue vence a Garri Kaspárov: fuerza de cómputo aplicada a búsqueda." },
    { anio: "2009-12", txt: "ImageNet y AlexNet: datos masivos + GPU hacen despegar el aprendizaje profundo.", fuerte: true },
    { anio: "2016", txt: "AlphaGo gana a Lee Sedol combinando redes profundas y búsqueda por refuerzo." },
    { anio: "2017", txt: "<i>Attention Is All You Need</i>: nace la arquitectura Transformer.", fuerte: true },
    { anio: "2018-20", txt: "Grandes modelos preentrenados de lenguaje (BERT, GPT-2, GPT-3): el preentrenamiento cambia la escala." },
    { anio: "2022", txt: "La IA generativa conversacional se masifica y entra en la conversación pública.", fuerte: true },
    { anio: "2023-26", txt: "Modelos multimodales y agentes: sistemas que usan herramientas y encadenan acciones.", fuerte: true }
  ];

  return {
    consulta: CONSULTA,
    indicadores: indicadores,
    normas: normas,
    casos: casos,
    hitos: hitos
  };
})();
