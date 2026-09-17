// Copy centralizado de la campaña. NO hardcodear textos en componentes/JSX.

export const COPY = {
  campaign: {
    line1: "EL SABOR",
    line2: "que nos une",
    line3: "¡VA CON TODO!",
  },

  handle: "@aguardientedelvalle",

  home: {
    headline: "VIVE CALI EN UNA FOTO ÚNICA",
    description: ["Nuestra cultura.", "Nuestros sabores.", "Nuestras historias."],
    cta: "INICIAR",
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
    title: "Sonríe",
    captureCta: "CAPTURAR",
    retakeCta: "REPETIR",
    permissionError: "No pudimos acceder a la cámara. Verifica los permisos.",
    noCameraError: "No se encontró ninguna cámara disponible.",
  },

  photoReview: {
    title: "¿Te gusta tu foto?",
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
