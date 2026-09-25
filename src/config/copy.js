// Copy centralizado de la campaña. NO hardcodear textos en componentes/JSX.

export const COPY = {
  campaign: {
    line1: "EL SABOR",
    line2: "que nos une",
    line3: "¡VA CON TODO!",
  },

  handle: "@aguardientedelvalle",

  home: {
    badge: { number: "1", label: "BIENVENIDA" },
    logoAlt: "Aguardiente Blanco del Valle Fiesta",
    campaignAlt: "EL SABOR que nos une ¡VA CON TODO!",
    bottleAlt: "Botella de Aguardiente Blanco del Valle Fiesta",
    headline: ["VIVE CALI", "EN UNA FOTO ÚNICA"],
    description: ["Nuestra cultura. Nuestros sabores.", "Nuestras historias."],
    cta: "INICIAR",
    taglines: ["BUEN SABOR", "BUENAS HISTORIAS", "LA MISMA GENTE"],
  },

  instructions: {
    badge: { number: "2", label: "INSTRUCCIONES" },
    title: "¿CÓMO PARTICIPAR?",
    subtitle: "Sigue estos pasos y vive la experiencia",
    // Texto accesible de cada paso (alt de step-N.png, que ya trae el
    // número/ícono/texto renderizado). Mantener en sync con esos PNG.
    steps: [
      "Ubícate frente a la cámara.",
      "Tómate la foto.",
      "Elige tu escenario de Cali.",
      "Escanea tu foto con el código QR.",
      "Etiqueta a @aguardientedelvalle y participa por 10 botellas de Aguardiente del Valle a las fotos con más likes.",
    ],
    bottleAlt: "Botella de Aguardiente Blanco del Valle Fiesta",
    cta: "¡LISTO!",
  },

  camera: {
    badge: { number: "3", label: "TOMA DE FOTO" },
    eyebrow: "Aguardiente Blanco del Valle Fiesta",
    title: "¡Sonríe!",
    subtitle: "Estamos tomando tu foto",
    requesting: "SOLICITANDO PERMISO...",
    activating: "ACTIVANDO CÁMARA...",
    activateCta: "ACTIVAR CÁMARA",
    captureCta: "CAPTURAR",
    permissionDenied: "NO PUDIMOS ACCEDER A LA CÁMARA",
    permissionDeniedHint: "Verifica los permisos de cámara en este dispositivo.",
    notFound: "NO ENCONTRAMOS UNA CÁMARA",
    notFoundHint: "Conecta o activa una cámara para continuar.",
    notReadable: "LA CÁMARA NO ESTÁ DISPONIBLE",
    notReadableHint: "Puede estar siendo usada por otra aplicación.",
    genericError: "NO PUDIMOS ACTIVAR LA CÁMARA",
    genericErrorHint: "Inténtalo de nuevo en unos segundos.",
    retryCta: "REINTENTAR",
  },

  photoReview: {
    eyebrow: "Aguardiente Blanco del Valle Fiesta",
    title: "¿TE GUSTA TU FOTO?",
    subtitle: "Puedes repetirla o continuar con esta.",
    retakeCta: "REPETIR",
    confirmCta: "CONTINUAR",
  },

  location: {
    title: "Elige tu escenario favorito de Cali",
    confirmCta: "CONFIRMAR",
  },

  locations: {
    calleSabor: "Calle del Sabor",
    plazaVarela: "Plaza Varela",
    cristoRey: "Cristo Rey",
  },

  processing: {
    title: "Creando tu experiencia Fiesta...",
  },

  result: {
    title: "¡Tu foto está lista!",
    cta: "CONTINUAR",
  },

  qr: {
    title: "TU FOTO ESTÁ LISTA",
    description: "ESCANEA EL CÓDIGO QR\nY DESCARGA TU FOTO",
  },

  thankYou: {
    title: "¡GRACIAS!",
    reminder:
      "Publica tu foto y etiqueta a @aguardientedelvalle para participar por 10 botellas de Aguardiente del Valle con las fotos que obtengan más likes.",
  },
};
