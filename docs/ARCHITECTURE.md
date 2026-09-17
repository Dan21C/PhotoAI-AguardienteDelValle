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
- Centrado vía `position: absolute; top/left: 50%` + márgenes negativos
  fijos (mitad de `STAGE.WIDTH`/`STAGE.HEIGHT`), **no** flexbox: combinar
  `display:flex` con `transform:scale()` en el hijo producía un centrado
  vertical intermitente en Chromium (detectado en Fase 3 verificando
  1366×768 con Playwright — ver `docs/MOTION_SPEC.md`).

La fotografía final generada dentro de la experiencia sí puede exportarse en
otros formatos (9:16, 1:1, 4:5) — eso es un atributo del archivo de foto, no
de la interfaz. Ver `PHOTO_OUTPUT_FORMATS` en `src/config/appConfig.js`.

## Estructura de carpetas

```
src/
  components/       Componentes reutilizables: TabletStage (Fase 1);
                     AnimatedButton, BrandLogo, BrandBottle, InstructionIcon,
                     InstructionStep (Fase 2/3); ScreenTransition, LocationCard,
                     QRCard, PhotoFrame, LoadingExperience se agregan en sus
                     fases correspondientes
  screens/          Una carpeta por pantalla. Implementadas: HomeScreen (Fase 2),
                     InstructionsScreen (Fase 3), CameraScreen, PhotoReviewScreen
                     (Fase 4). El resto (Location, Processing, Result, QR,
                     ThankYou) se agrega en su fase correspondiente
  animations/       Timelines GSAP por pantalla: homeAnimations.js (Fase 2),
                     instructionsAnimations.js (Fase 3), cameraAnimations.js,
                     photoReviewAnimations.js (Fase 4)
  config/           appConfig.js, copy.js, assets.js, locations.js
  context/          SessionContext.jsx (estado global de la experiencia)
  hooks/            useReducedMotion (Fase 3, compartido por Home e
                     Instructions); useCamera (Fase 4); useIdleReset,
                     useScreenTransition se agregan en sus fases (7, 8)
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

Acciones expuestas por `useSession()`: `startExperience`, `completeInstructions`,
`setCameraReady`, `capturePhoto`, `retakePhoto`, `confirmPhoto`, `selectLocation`,
`startGeneration`, `setGeneratedPhoto`, `confirmResult`, `setQR`,
`finishExperience`, `resetSession`. Ver `docs/FLOW.md` para el detalle de
transiciones y el shape de `originalPhoto`.

## Cámara: `useCamera`, Blob y Object URL (Fase 4)

**Separación de responsabilidades** (deliberada, ver brief de Fase 4):

- `src/hooks/useCamera.js` — solo hardware/browser media. No importa
  `SessionContext` ni `COPY`. Expone `videoRef`, `videoReady`, `loading`,
  `errorCode` (código normalizado: `permission-denied`, `not-found`,
  `not-readable`, `overconstrained`, `unknown` — nunca el nombre técnico del
  `DOMException`), `startCamera()`, `stopCamera()`, `captureFrame()`.
- `SessionContext` — solo estado de la experiencia (no sabe de
  `MediaStream`).
- `CameraScreen` — conecta ambos: llama `startCamera()` al montar, refleja
  `videoReady` en `session.cameraReady` (`setCameraReady`), y al capturar
  llama `session.capturePhoto(photo)`.

**Captura:** `captureFrame()` valida `video.videoWidth/Height > 0` (nunca
usa solo la resolución de `getUserMedia()` como señal de "listo"), dibuja el
frame en un `<canvas>` del tamaño real del video (sin crop) y usa
`canvas.toBlob(..., "image/jpeg", CAMERA_CONFIG.jpegQuality)` — no
`toDataURL()`, para no mantener strings base64 grandes en memoria.

**Mirror:** el espejado (`CAMERA_MIRROR_PREVIEW`) es puramente CSS
(`transform: scaleX(-1)`) sobre el `<video>` de preview. `drawImage()` lee
los frames decodificados del video, no el DOM/CSS, así que la captura sale
sin espejar de forma natural — no hace falta voltear el canvas.

**Ciclo de vida del Object URL de `originalPhoto`:** el reducer de
`SessionContext` es puro (no revoca URLs). La revocación es un side effect
y vive en un `useEffect` de `SessionProvider` que observa
`state.originalPhoto`: cuando cambia (retake, nueva captura que reemplaza
una anterior, o `resetSession`), revoca la URL previa vía el helper interno
`revokePhotoUrl(photo)` — cubre todos los casos con un solo mecanismo, en
vez de revocar manualmente en cada action creator (`capturePhoto`,
`retakePhoto`, etc.), reduciendo el riesgo de olvidar un caso.

**Detener la cámara:** `useCamera` detiene todas las `MediaStreamTrack`s
(`track.stop()`) en su propio cleanup de `useEffect` al desmontar
`CameraScreen` — ocurre siempre que se navega fuera de Camera (captura
exitosa, error, o cualquier cambio de pantalla), así que el LED de la
cámara nunca queda encendido en Photo Review ni en ninguna otra pantalla.

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
