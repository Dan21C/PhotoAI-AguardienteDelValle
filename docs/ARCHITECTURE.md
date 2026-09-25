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
                     AnimatedButton, BrandLogo, BrandBottle (Fase 2/3);
                     CaptureButton (Fase 4). InstructionIcon/InstructionStep
                     (Fase 3) se eliminaron al integrar assets reales de
                     Instructions (ver más abajo). ScreenTransition,
                     LocationCard, QRCard, PhotoFrame, LoadingExperience se
                     agregan en sus fases correspondientes
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

**Assets reales de marca (Home, Fase 4):** `BrandLogo` y `BrandBottle`
renderizan directamente `assets.brand.logoFiesta` y `assets.bottle.fiesta`
(ya no son placeholders CSS) — cualquier pantalla que los use (Home,
Camera) recibe el asset real automáticamente. `assets.home.*` agrupa las
capas de composición específicas de Home (`background`, `crowd`,
`campaignLockup`) que no se reutilizan en otras pantallas, separado de
`brand`/`bottle` que sí son genéricos. Cuando un PNG con alpha trae relleno
transparente alrededor del contenido visible (p. ej.
`assets.home.campaignLockup`), se recorta por CSS (contenedor
`overflow:hidden` + `<img>` desplazado) en vez de editar el archivo — el
bounding box real se midió una vez con un canvas (`getImageData`) para fijar
esos valores.

**Assets reales de Instructions y Camera:** mismo patrón — `assets.instructions.*`
y `assets.camera.*` agrupan las piezas de cada pantalla. Regla aplicada de
forma consistente al decidir si un asset se usa tal cual o se reconstruye:

- **Elementos puramente informativos/decorativos** (fondos, badges de
  pantalla, las 5 tarjetas de pasos de Instructions con número+ícono+texto
  ya renderizados) → se usan las imágenes tal cual, con `alt` real para
  accesibilidad. No tiene sentido re-dibujar en CSS algo que el cliente ya
  entregó terminado, y no son interactivos.
- **Controles interactivos** (botón "¡LISTO!"/"CAPTURAR", el marco/guía de
  la cámara) → se mantienen como componentes reales (`AnimatedButton`,
  `CaptureButton`, `.camera-screen__guide` en CSS) en vez de imágenes
  planas, aunque el cliente entregó referencias visuales para ellos
  (`cta-reference.png`, `shutter-reference.png`, `frame-reference.png`).
  Motivo: un botón como imagen pierde estados (disabled/hover), texto
  editable/accesible para lectores de pantalla, y flexibilidad ante cambios
  de copy — esas referencias se usaron para afinar el CSS (glow, grosor de
  borde), no como el asset final. `frame-reference.png` además trae una
  foto de stock de una persona horneada en el PNG, así que no podía usarse
  en producción de todos modos.
- **Logos duplicados por pantalla** (`instructions/logo-badge-alt.png`,
  `camera/logo-badge-alt.png`, `camera/fiesta-wordmark-alt.png`) → se
  descartaron a favor de reutilizar el único `BrandLogo`/`assets.brand.logoFiesta`
  ya integrado, para mantener el logo visualmente idéntico en toda la app
  y no depender de tres renders ligeramente distintos.

Los cinco pasos de Instructions ya no usan un componente `InstructionStep`
con sub-elementos (número/ícono/título) — ahora son un `<li><img></li>`
directo por paso, más simple porque toda esa composición ya vive en el PNG.
`docs/ASSETS_TODO.md` lista explícitamente los assets recibidos que NO se
wirearon, con el motivo de cada uno.

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
