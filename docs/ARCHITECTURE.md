# Arquitectura

## Stack

- React + Vite + JavaScript.
- GSAP + `@gsap/react` para animaciones complejas (timelines, stagger,
  parallax, loops).
- CSS moderno (sin Tailwind, sin librería de UI pesada).
- Estado global con Context + `useReducer` (sin Redux).

## Formato de la aplicación

La aplicación es **siempre horizontal 16:9** (tablet landscape), base de
diseño 1920×1080. El componente `TabletStage`
(`src/components/TabletStage/TabletStage.jsx`) mantiene esa composición sin
importar la resolución real del dispositivo:

- Escala proporcionalmente (`min(anchoDisponible/1920, altoDisponible/1080)`)
  usando `transform: scale()`, sin deformar el contenido.
- Se recalcula con `ResizeObserver` (con cleanup al desmontar).
- El wrapper exterior ocupa `100vw`/`100svh` con `overflow: hidden`, evitando
  scroll y elementos fuera de pantalla.

La fotografía final generada dentro de la experiencia sí puede exportarse en
otros formatos (9:16, 1:1, 4:5) — eso es un atributo del archivo de foto, no
de la interfaz. Ver `PHOTO_OUTPUT_FORMATS` en `src/config/appConfig.js`.

## Estructura de carpetas

```
src/
  components/       Componentes reutilizables (TabletStage implementado en
                     Fase 1; AnimatedButton, BrandLogo, BrandBottle,
                     ScreenTransition, LocationCard, QRCard, PhotoFrame,
                     LoadingExperience se agregan en sus fases correspondientes)
  screens/          Una carpeta por pantalla (Home, Instructions, Camera,
                     PhotoReview, Location, Processing, Result, QR, ThankYou),
                     se agregan en sus fases correspondientes
  animations/        Timelines GSAP por pantalla (fases 2+)
  config/           appConfig.js, copy.js, assets.js, locations.js
  context/          SessionContext.jsx (estado global de la experiencia)
  hooks/            useCamera, useIdleReset, useScreenTransition (fases 4, 7, 8)
  services/
    imageGeneration/  Interfaz de generación de foto (mock en esta etapa)
    storage/          Interfaz de subida/descarga de foto (mock en esta etapa)
    qr/               Generación de QR a partir de una URL
  styles/           tokens.css (variables de marca), globals.css (reset/base)
  App.jsx
  main.jsx
```

Las carpetas que aún no tienen contenido (`screens/`, `animations/`,
`hooks/`, `services/`) se crean cuando su fase correspondiente las necesita,
para no dejar archivos vacíos o stubs sin usar en el repositorio.

## Estado global (`SessionContext`)

```js
session = {
  currentScreen,
  originalPhoto,
  selectedLocation,
  generatedPhoto,
  finalPhoto,
  downloadUrl,
  qrValue,
  isProcessing,
  cameraReady,
}
```

Acciones expuestas por `useSession()`: `startExperience`, `capturePhoto`,
`retakePhoto`, `confirmPhoto`, `selectLocation`, `startGeneration`,
`setGeneratedPhoto`, `confirmResult`, `setQR`, `finishExperience`,
`resetSession`. Ver `docs/FLOW.md` para el detalle de transiciones.

## Centralización de assets

Ningún componente debe conocer rutas físicas de archivos. Todas las rutas
viven en `src/config/assets.js` y se sirven desde `public/assets/<categoría>/`.
Ver `docs/ASSETS_TODO.md` para el listado de producción pendiente.

## Integraciones futuras (no implementadas todavía)

### Generación de imagen con IA

`src/services/imageGeneration/imageGenerationService.js` expondrá
`generatePhoto({ originalPhoto, location })`. En esta fase se usa
`mockImageGeneration()` que simula latencia y devuelve una imagen mock según
la locación. La integración real seguirá el flujo:

```
frontend → backend/serverless → OpenAI
```

**Nunca** se debe exponer una API key de OpenAI en el frontend
(`VITE_OPENAI_API_KEY` está prohibido para llamadas directas desde el
navegador). Las credenciales viven únicamente en backend/serverless.

### Firebase Storage + QR

Firebase Storage **no genera el QR**, solo almacena la imagen final. El flujo
futuro:

```
finalPhoto → upload a Firebase Storage → getDownloadURL()
  → downloadURL → librería QR (ej. qrcode.react) → QR
```

En esta fase, `uploadFinalImage()` y `getFinalImageUrl()` se implementan como
mocks en `src/services/storage/`.

## Performance y limpieza

Cada componente que use GSAP, timers, `MediaStream` o event listeners debe
limpiarlos correctamente al desmontar (`gsap.context()` + cleanup en
`useEffect`, `clearTimeout`/`clearInterval`, detener `MediaStreamTrack`s,
revocar `Object URL`s). Ver `docs/MOTION_SPEC.md`.
