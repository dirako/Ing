/* ============================================================
   DATOS DE CONTACTO DE LA PANTALLA FINAL
   ------------------------------------------------------------
   Edite únicamente este archivo para cambiar los datos que
   aparecen al cerrar la capacitación. Los campos que se dejen
   vacíos ("") sencillamente no se muestran.
   ============================================================ */
window.AUTOR = {
  nombre: "Ingeniero Diego Cortés",

  /* Sin vínculo institucional actual: la línea describe el campo de
     trabajo, no un cargo ni un empleador. */
  cargo: "Modelo de salud colombiano · Inteligencia artificial aplicada al sector",
  institucion: "",
  ciudad: "Cali, Colombia",

  /* Formación académica. Cada elemento se muestra como una credencial. */
  formacion: [
    "Ingeniero Industrial",
    "Magíster en Gerencia de Servicios de Salud",
    "Magíster en Gobierno y Políticas Públicas"
  ],

  correo: "diegocortes24@gmail.com",
  telefono: "+57 316 690 3440",
  redes: "@colombia_salud",
  linkedin: "",
  web: "",

  /* ----------------------------------------------------------------
     EXPERIENCIA Y CASOS (pantalla 4)
     ----------------------------------------------------------------
     "trabajo" describe en qué consiste aplicar modelos de IA en esa
     área. "caso" es SU caso concreto: escríbalo con el resultado que
     pueda sustentar. Mientras esté vacío, la pantalla muestra un
     recuadro visible pidiendo completarlo, para que no se proyecte
     una afirmación sin respaldo.
     ---------------------------------------------------------------- */
  experiencia: [
    {
      area: "Auditoría de cuentas",
      icono: "🔍",
      trabajo: "Modelos que puntúan cada cuenta por riesgo, detectan inconsistencias entre " +
               "factura y soportes, y ordenan la revisión por valor en riesgo.",
      caso: ""
    },
    {
      area: "Cartera",
      icono: "💰",
      trabajo: "Segmentación por pagador y edad, perfil de comportamiento de pago y " +
               "estimación del riesgo de no pago para priorizar la gestión de cobro.",
      caso: ""
    },
    {
      area: "Historia clínica",
      icono: "📋",
      trabajo: "Procesamiento del texto clínico para estructurar información, verificar " +
               "completitud documental y preparar el intercambio interoperable.",
      caso: ""
    },
    {
      area: "Facturación electrónica",
      icono: "🧾",
      trabajo: "Validación previa a la radicación: simulación de reglas, anticipación de " +
               "rechazos y análisis del histórico de devoluciones por sede y servicio.",
      caso: ""
    }
  ],

  /* Frase de cierre que acompaña los datos. */
  mensaje: "Quedo atento a sus preguntas, comentarios y a cualquier idea que quieran " +
           "explorar sobre inteligencia artificial aplicada a su proceso."
};
