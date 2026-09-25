// Centraliza TODAS las rutas de assets. Los componentes nunca deben conocer
// rutas físicas: siempre importan desde aquí. Ver docs/ASSETS_TODO.md para el
// listado de producción pendiente.

export const assets = {
  brand: {
    logoFiesta: "/assets/brand/logo-fiesta.png",
    wordmark: "/assets/brand/wordmark.png",
  },

  bottle: {
    fiesta: "/assets/bottle/fiesta.png",
  },

  // Composición específica de Home (no reutilizable en otras pantallas).
  home: {
    background: "/assets/home/background.png",
    crowd: "/assets/home/crowd.png",
    campaignLockup: "/assets/home/campaign-lockup.png",
  },

  // Composición específica de Instructions.
  instructions: {
    backgroundLeft: "/assets/instructions/background-left.png",
    backgroundRight: "/assets/instructions/background-right.png",
    backgroundTop: "/assets/instructions/background-top.png",
    backgroundBottom: "/assets/instructions/background-bottom.png",
    skylineSilhouette: "/assets/instructions/skyline-silhouette.png",
    foliageCorner: "/assets/instructions/foliage-corner.png",
    flourishTopRight: "/assets/instructions/flourish-top-right.png",
    bottle: "/assets/instructions/bottle.png",
    badge: "/assets/instructions/badge.png",
    campaignBanner: "/assets/instructions/campaign-banner.png",
    steps: [
      "/assets/instructions/step-1.png",
      "/assets/instructions/step-2.png",
      "/assets/instructions/step-3.png",
      "/assets/instructions/step-4.png",
      "/assets/instructions/step-5.png",
    ],
  },

  // Composición específica de Camera.
  camera: {
    background: "/assets/camera/background.png",
    badge: "/assets/camera/badge.png",
    titleSonrie: "/assets/camera/title-sonrie.png",
    subtitle: "/assets/camera/subtitle.png",
  },

  backgrounds: {
    main: "/assets/backgrounds/fiesta-blue.webp",
    qr: "/assets/backgrounds/qr-blue.webp",
  },

  foliage: {
    left: "/assets/foliage/left.png",
    right: "/assets/foliage/right.png",
  },

  locations: {
    calleSabor: {
      static: "/assets/locations/calle-sabor.webp",
      animated: "/assets/locations/calle-sabor.webm",
    },
    plazaVarela: {
      static: "/assets/locations/plaza-varela.webp",
      animated: "/assets/locations/plaza-varela.webm",
    },
    cristoRey: {
      static: "/assets/locations/cristo-rey.webp",
      animated: "/assets/locations/cristo-rey.webm",
    },
  },

  frames: {
    resultFrame: "/assets/frames/result-frame.png",
  },

  icons: {
    instagram: "/assets/icons/instagram.svg",
    qrCorner: "/assets/icons/qr-corner.svg",
  },

  placeholders: {
    generic: "/assets/placeholders/placeholder.svg",
  },
};
