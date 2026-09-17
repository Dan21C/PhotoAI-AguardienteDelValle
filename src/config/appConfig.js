// Configuración general de la experiencia PhotoAI - Aguardiente Blanco del Valle Fiesta

export const SCREENS = {
  HOME: "HOME",
  INSTRUCTIONS: "INSTRUCTIONS",
  CAMERA: "CAMERA",
  PHOTO_REVIEW: "PHOTO_REVIEW",
  LOCATION: "LOCATION",
  PROCESSING: "PROCESSING",
  RESULT: "RESULT",
  QR: "QR",
  THANK_YOU: "THANK_YOU",
};

// Formato base de la aplicación: SIEMPRE horizontal 16:9 (tablet landscape).
// La fotografía final es lo único que puede exportarse en otras proporciones.
export const STAGE = {
  WIDTH: 1920,
  HEIGHT: 1080,
  ASPECT_RATIO: 16 / 9,
};

// Formatos de exportación disponibles para la FOTO final (no para la app).
export const PHOTO_OUTPUT_FORMATS = {
  STORIES: "9:16",
  SQUARE: "1:1",
  PORTRAIT: "4:5",
};

// Se usa temporalmente 9:16 (Stories). Puede cambiar sin acoplar el resto del código.
export const DEFAULT_PHOTO_OUTPUT_FORMAT = PHOTO_OUTPUT_FORMATS.STORIES;

// Tiempo de inactividad en Thank You antes de resetear la sesión y volver a Home (ms).
export const THANK_YOU_TIMEOUT = 15000;

// Tiempo de inactividad general antes de forzar un reset de sesión abandonada (ms).
export const IDLE_RESET_TIMEOUT = 90000;

// Configuración de captura de cámara (ver src/hooks/useCamera.js y
// src/screens/CameraScreen/). `mirrorPreview` solo afecta el <video> en
// pantalla (CSS); `mirrorCapture` documenta que la foto capturada NUNCA
// se espeja (drawImage sobre el video ignora el transform CSS del
// elemento, así que la captura ya sale sin espejar de forma natural).
export const CAMERA_CONFIG = {
  countdownSeconds: 3,
  jpegQuality: 0.92,
  mirrorPreview: true,
  mirrorCapture: false,
  constraints: {
    video: {
      facingMode: "user",
      width: { ideal: STAGE.WIDTH },
      height: { ideal: STAGE.HEIGHT },
    },
    audio: false,
  },
};
