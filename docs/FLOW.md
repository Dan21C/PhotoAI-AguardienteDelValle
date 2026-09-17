# Flujo de la experiencia

```
HOME
  ↓
INSTRUCTIONS
  ↓
CAMERA
  ↓
PHOTO_REVIEW
  ↓
LOCATION
  ↓
PROCESSING
  ↓
RESULT
  ↓
QR
  ↓
THANK_YOU
  ↓
RESET → HOME
```

## Pantallas

| Pantalla       | Descripción                                                        |
| -------------- | ------------------------------------------------------------------- |
| Home           | Pantalla de bienvenida, arranca la experiencia.                     |
| Instructions   | Explica los pasos de la experiencia.                                 |
| Camera         | Captura la foto original del usuario (sin marco de marca).          |
| Photo Review   | El usuario confirma o repite la foto capturada.                     |
| Location       | Selección de escenario: Calle del Sabor, Plaza Varela, Cristo Rey.  |
| Processing     | Simulación/generación de la foto vía IA (mock en esta fase).        |
| Result         | Foto final con escenario elegido + marco de marca.                  |
| QR             | Código QR para descargar la foto (vía URL de Firebase Storage).     |
| Thank You      | Cierre de la experiencia y recordatorio del concurso en Instagram.  |

## Transiciones de estado (`SessionContext`)

- `startExperience()` — HOME → INSTRUCTIONS
- `completeInstructions()` — INSTRUCTIONS → CAMERA
- `capturePhoto(photo)` — CAMERA → PHOTO_REVIEW
- `retakePhoto()` — PHOTO_REVIEW → CAMERA
- `confirmPhoto()` — PHOTO_REVIEW → LOCATION
- `selectLocation(location)` — LOCATION → PROCESSING
- `startGeneration()` — marca `isProcessing = true`
- `setGeneratedPhoto(photo)` — PROCESSING → RESULT
- `confirmResult(finalPhoto)` — RESULT → QR
- `setQR(qrValue, downloadUrl)` — completa datos de QR dentro de la pantalla QR
- `finishExperience()` — QR → THANK_YOU
- `resetSession()` — THANK_YOU → HOME (reset completo del estado)

## Shape de `originalPhoto`

Capturada en `CameraScreen` vía `useCamera().captureFrame()`:

```js
originalPhoto = {
  blob,        // Blob JPEG (canvas.toBlob, calidad CAMERA_CONFIG.jpegQuality)
  url,         // URL.createObjectURL(blob) — usado por <img>/<video> para preview
  width,       // resolución real capturada (video.videoWidth, sin crop)
  height,      // resolución real capturada (video.videoHeight, sin crop)
  mimeType,    // "image/jpeg"
  capturedAt,  // Date.now()
}
```

Es la foto **limpia**, sin marco de marca ni espejado (ver
`docs/ARCHITECTURE.md` para el ciclo de vida del Object URL).

## Reset automático

Después de `THANK_YOU_TIMEOUT` (ver `src/config/appConfig.js`) sin interacción en
Thank You, se debe invocar `resetSession()` automáticamente. También debe existir
un mecanismo de recuperación (`IDLE_RESET_TIMEOUT`) para sesiones abandonadas en
cualquier otra pantalla. Este mecanismo (`useIdleReset`) se implementa en una
fase posterior.
