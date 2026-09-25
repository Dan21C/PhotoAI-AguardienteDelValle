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
    title: "¿CÓMO PARTICIPAR?",
    steps: [
      { icon: "camera", title: "Tómate una foto." },
      { icon: "location", title: "Elige tu escenario favorito de Cali." },
      { icon: "spark", title: "Deja que la IA transforme tu foto." },
      { icon: "qr", title: "Escanea el código QR y descarga tu foto." },
      {
        icon: "share",
        title: "PUBLICA Y PARTICIPA",
        description:
          "Publícala y etiqueta a @aguardientedelvalle para participar por 10 botellas de Aguardiente del Valle con las fotos que obtengan más likes.",
      },
    ],
    cta: "¡LISTO!",
  },

  camera: {
    eyebrow: "Aguardiente Blanco del Valle Fiesta",
    title: "PREPÁRATE PARA TU FOTO",
    subtitle: "Mira a cámara",
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
