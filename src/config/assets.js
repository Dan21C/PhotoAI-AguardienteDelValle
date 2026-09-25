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
