# Especificación de motion

Este documento se irá completando por fase a medida que se implementan las
animaciones. Fase 1 solo define la base técnica.

## Herramientas

- **GSAP + `@gsap/react`** para timelines, stagger, parallax, loops ambientales
  y transiciones entre escenas.
- **CSS moderno** para layout y estilos estáticos.
- Toda animación GSAP debe crearse dentro de `gsap.context()` (o el hook
  `useGSAP` de `@gsap/react`) y limpiarse al desmontar el componente.

## Principios generales

- Nada debe sentirse completamente congelado: usar loops ambientales sutiles
  donde tenga sentido narrativo (Home, Instructions).
- Las capas no deben animarse todas sincronizadas: usar duraciones distintas
  por capa para dar sensación de profundidad.
- Evitar animaciones "caricaturescas": overshoots pequeños y elegantes, nunca
  exagerados.
- Transiciones entre pantallas: 300–500ms, sin cortes secos (ver
  `ScreenTransition`, fase posterior).

## Fase 2 — Home (implementado; capas actualizadas a assets reales en el
ajuste de layout post-Fase 4, ver sección propia más abajo)

Toda la lógica vive en `src/animations/homeAnimations.js`
(`HOME_MOTION`, `createHomeIntroTimeline`, `startAmbientMotion`,
`startEnergyPulses`), orquestada desde `src/screens/HomeScreen/HomeScreen.jsx`
dentro de un único `useGSAP(..., { scope: containerRef })` con cleanup.

Las capas placeholder originales (fondo con gradiente CSS, foliage
izquierda/derecha, barra de decoración) fueron reemplazadas por los assets
reales de marca (fondo fotográfico, capa de personas, marco de neón, badge
"BIENVENIDA") — ver "Ajuste de layout Home con assets reales" más abajo
para el timeline y motion ambiental REALES actualmente implementados. Esta
sección se conserva como referencia histórica de los valores usados en la
Fase 2 original.

### Timeline de entrada original (Fase 2)

Orden (con solapamientos `-=` para que se sienta fluida, no cortada):

1. Fondo — `opacity 0→1`, 0.35s, `power1.out`.
2. Decoración (barra superior) — `y -120→0`, `opacity 0→1`, 0.5s.
3. Foliage izquierdo — `x -200→0`, `y 40→0`, 0.7s, `back.out(1.4)`.
4. Foliage derecho — igual, con 0.08s de stagger respecto al izquierdo.
5. Botella — `scale .75→1`, `rotation 6deg→0deg`, `y 120→0`, `x 60→0`,
   0.9s, `back.out(1.15)` (overshoot muy controlado, no caricaturesco).
6. Logo/branding — `scale .85→1`, `y -20→0`, 0.55s.
7. Copy de campaña ("EL SABOR / que nos une / ¡VA CON TODO!") — `y 30→0`,
   0.55s, solapado con el logo.
8. Headline ("VIVE CALI EN UNA FOTO ÚNICA") — `y 35→0`, 0.55s.
9. Descripción — `y 20→0`, 0.5s.
10. Botón "INICIAR" (último) — `scale .9→1`, `y 20→0`, 0.5s,
    `back.out(1.5)`.

Stagger base entre bloques de copy: 0.14s.

### Golpe de energía ocasional (`startEnergyPulses`)

Cada 8–14s (aleatorio, `gsap.utils.random`), un micro-shake de ~0.32s en
varias capas a la vez (headline, logo, botella, botón). El timer se
reprograma recursivamente vía `setTimeout` y se limpia junto con la tween
activa en el cleanup de `useGSAP`.

**Nota de implementación (evita pisar las loops ambientales):** GSAP
sobreescribe por defecto una tween activa cuando otra tween distinta anima
la misma propiedad del mismo nodo. Como la ambient loop de la botella ya
usa `rotation`+`y`, y la del botón ya usa `scale`, el pulso de energía usa
propiedades distintas en esos dos casos para no matar la loop infinita:
botella → `x` (en vez de `rotation`), botón → `y` (en vez de `scale`).
Headline y logo sí usan `x` tal como se pidió, porque no tienen loop
ambiental propia con la que puedan chocar.

### Cleanup

`useGSAP` revierte automáticamente las tweens creadas dentro de su scope al
desmontar. Además, `HomeScreen` mata explícitamente la timeline de intro y
llama a las funciones de limpieza devueltas por `startAmbientMotion` y
`startEnergyPulses` (que a su vez limpian el `setTimeout` pendiente y la
tween de pulso en curso).

### `prefers-reduced-motion`

`useReducedMotion()` (`src/hooks/useReducedMotion.js`) detecta la
preferencia del sistema/dispositivo. Si está activa, `createHomeIntroTimeline`
hace un único fade-in corto (0.25s, stagger 0.02s, sin desplazamientos ni
overshoots) y `startAmbientMotion`/`startEnergyPulses` no crean ningún loop
(no-op). La funcionalidad (botón, navegación) no depende del motion.

## Home — ajuste de layout con assets reales

Corrección posterior a Fase 4: se integraron los assets reales de marca
(recibidos del cliente) reemplazando los placeholders CSS de Home, y se
corrigió la composición para que coincida con la referencia visual
aprobada (verificado explícitamente también a **1280×800**, además de
1920×1080/1366×768/1280×720).

### Capas y jerarquía (`z-index` = orden pedido en la referencia)

1. Fondo (`assets.home.background`, foto de Cali) — cubre todo el stage.
2. Capa de personas (`assets.home.crowd`) — overlay inferior, PNG con
   alpha (transparente en la mitad superior).
3. Degradado/oscurecimiento ambiental (`.home-screen__vignette`, solo CSS)
   — para legibilidad del texto sobre la foto.
4. Marco de neón (`.home-screen__frame`) — borde azul luminoso, `inset:20px`.
5. Botella + hielo + agave (`assets.bottle.fiesta`, un solo PNG — el
   render ya incluye la decoración, no son capas separadas).
6. Badge "1 · BIENVENIDA" (`.home-screen__badge`) — esquina superior
   izquierda, primer elemento del bloque informativo.
7. Logo (`assets.brand.logoFiesta`, vía `BrandLogo`).
8. Eslogan / lockup de campaña (`assets.home.campaignLockup`).
9. Título "VIVE CALI / EN UNA FOTO ÚNICA" — dos líneas explícitas
   (`COPY.home.headline` es un array de 2 strings), la primera con mayor
   tamaño de fuente que la segunda.
10. Texto secundario ("Nuestra cultura. Nuestros sabores." / "Nuestras
    historias.") — `COPY.home.description`, 2 líneas, blanco (no gris).
11. Botón "INICIAR >" (`AnimatedButton` + chevron).
12. Footer/taglines ("BUEN SABOR • BUENAS HISTORIAS • LA MISMA GENTE").

Todas las capas permanecen elementos DOM independientes (nada se fusiona
en una sola imagen), precisamente para permitir animarlas por separado —
igual que ya hacía Fase 2.

### Recorte CSS de `campaign-lockup.png`

El lienzo de ese PNG (1122×1402) tiene relleno transparente arriba/abajo
del gráfico real: el bounding box visible medido con un `<canvas>` +
`getImageData()` es `y: 301–1116` (de 1402), o sea ~58% del alto total.
`.home-screen__campaign-frame` (`overflow:hidden`, alto fijo ~218px) +
`<img>` con `top:-80px` recortan esa transparencia sin tocar el archivo
(prohibido modificar assets), recuperando espacio vertical para el resto
de la composición.

### Timeline de entrada actualizado

Mismo patrón de Fase 2 (fade + overshoot controlado), orden real:
fondo → personas → marco → botella → badge → logo → eslogan → título →
descripción → botón → footer. El badge entra con `scale .9→1`, `y -10→0`,
0.4s, justo después de la botella y antes del logo.

### Motion ambiental actualizado

Igual que Fase 2 (botella flotando, botón respirando) más un pulso de luz
muy lento en el marco de neón: una custom property CSS
(`--frame-glow: 0→1`) anima el blur/spread del `box-shadow` del marco,
4.5s, `sine.inOut`, yoyo — mismo mecanismo que la iluminación del copy de
campaña en Instructions (ver esa sección).

## Fase 3 — Instructions (implementado)

Toda la lógica vive en `src/animations/instructionsAnimations.js`
(`INSTRUCTIONS_MOTION`, `createInstructionsIntroTimeline`,
`startInstructionsAmbientMotion`), orquestada desde
`src/screens/InstructionsScreen/InstructionsScreen.jsx` dentro de un único
`useGSAP(..., { scope: containerRef, dependencies: [reducedMotion] })`.

### Timeline de entrada (`createInstructionsIntroTimeline`)

Orden, con el mismo lenguaje visual de Home (fondo/decoración/foliage
reutilizan los mismos valores que `HOME_MOTION`):

1. Fondo — `opacity 0→1`, 0.35s.
2. Decoración (barra superior) — `y -120→0`, 0.5s.
3. Foliage izquierdo/derecho — `x ±200→0`, `y 40→0`, 0.7s, `back.out(1.4)`.
4. Copy de campaña (branding) — `y -20→0`, 0.5s.
5. Título ("¿CÓMO PARTICIPAR?") — `y 30→0`, 0.5s.
6–10. Pasos 01→05 — cada uno `opacity 0→1`, `x -30→0`, `scale .97→1`,
   0.5s, con **stagger fijo de 0.16s** entre el inicio de cada paso
   (calculado con un cursor absoluto en la timeline, no con overlaps
   relativos, para que el stagger sea exacto independientemente de cuántos
   pasos existan). El icono de cada paso (`.instruction-step__icon-badge`,
   ubicado vía `querySelector` dentro del nodo del paso) entra 0.08s
   después del inicio de su tarjeta: `scale .7→1`, `rotation -5deg→0`,
   `opacity 0→1`, 0.35s, `back.out(1.3)`.
11. Botón "¡LISTO!" (último) — `scale .9→1`, `y 20→0`, 0.5s, `back.out(1.5)`.

El número de cada paso (`01`…`05`) no tiene animación propia dinámica: su
"glow muy ligero" es un `text-shadow` constante en CSS (no parpadea), tal
como se pidió.

### Motion ambiental (`startInstructionsAmbientMotion`)

Deliberadamente **no anima las 5 tarjetas** después del intro — la
legibilidad tiene prioridad. Solo:

- Foliage izquierdo/derecho: igual patrón que Home pero duraciones propias
  (8s / 10s) para que ninguna pantalla se sienta idéntica.
- Botón: `scale 1↔1.02` + glow, 2.8s (ligeramente menos intenso que Home,
  que usa 2.4s/1.025).
- **Iluminación del copy de campaña:** se anima una custom property CSS
  (`--campaign-glow: 0 → 1`) con `sine.inOut`, yoyo, 4.2s. En CSS,
  `text-shadow: 0 0 calc(6px + var(--campaign-glow) * 26px) var(--color-fiesta-glow)`
  — el blur crece y decrece suavemente (normal → glow azul mayor → normal).
  No es parpadeo: es una interpolación continua de un solo valor numérico.

### Paso 5 (concurso)

`InstructionStep` separa `title` ("PUBLICA Y PARTICIPA", headline corto)
de `description` (el texto completo del mecanismo del concurso, tal cual
vive en `COPY.instructions.steps[4].description`). El handle
`@aguardientedelvalle` se resalta en negrita partiendo el string sobre
`COPY.handle` (sin hardcodear el handle de nuevo, sin convertirlo en link).
En el layout, este paso usa la clase `instruction-step--wide` para ocupar
más ancho en la fila inferior y que el texto largo no rompa la jerarquía.

### Layout de los 5 pasos

3 arriba + 2 abajo, como pidió el brief. Implementado con CSS Grid
(`grid-template-columns: repeat(3, 1fr)`) directamente sobre el `<ol>` — los
5 `<li>` (`InstructionStep`) se colocan automáticamente 3+2, y el paso 5
usa `grid-column: span 2` para ocupar más ancho sin angostar los otros
cuatro. (Fase 4: se quitaron los `<div>` de fila que envolvían el `<ol>`
por un detalle semántico — ver "Housekeeping Fase 4" más abajo — y la
grilla reemplazó esa maquetación sin cambiar el resultado visual.)

### Cleanup

Igual patrón que Home: `useGSAP` revierte las tweens de su scope; el
cleanup explícito mata la timeline de intro y llama a la función devuelta
por `startInstructionsAmbientMotion`. No hay `setTimeout`/pulso de energía
en esta pantalla (no se pidió, y contradiría "las cards no deben moverse
constantemente").

### `prefers-reduced-motion`

Mismo patrón que Home vía `useReducedMotion()`: con la preferencia activa,
la timeline hace un fade-in corto sin desplazamientos y no se crea ningún
loop ambiental.

## Fix de layout — `TabletStage` (detectado durante Fase 3)

Verificando Instructions a 1366×768 con Playwright se detectó un bug real
y reproducible (intermitente entre cargas, ~50%) en `TabletStage`: la
combinación `display:flex` (en el wrapper) + `transform: scale()` (en el
hijo de tamaño fijo 1920×1080) hacía que Chromium a veces calculara mal el
centrado vertical (`top: -156px` en vez de `0`), cortando el header y
dejando una franja negra abajo — mismo `transform: scale(0.711111)` en
ambos casos, solo cambiaba el resultado del centrado. Se reemplazó por el
patrón estándar sin flexbox: `position:absolute; top:50%; left:50%` +
márgenes negativos fijos (mitad de `STAGE.WIDTH`/`STAGE.HEIGHT`) para
centrar por layout puro, y `transform: scale()` solo para escalar
alrededor de ese punto ya centrado. Verificado estable en 5 cargas
consecutivas a 1366×768 tras el cambio. Afecta a todas las pantallas por
igual (Home incluida); se re-verificó Home sin regresiones.

## Housekeeping Fase 4 — semántica de `InstructionsScreen`

El `<ol>` de los pasos tenía dos `<div>` de fila como hijos directos (HTML
inválido: un `<ol>` solo debe tener `<li>` como hijo directo). Se quitaron
esos `<div>` y los 5 `InstructionStep` (cada uno ya renderiza un `<li>`) se
volvieron hijos directos del `<ol>`, maquetados 3+2 vía CSS Grid (ver
sección de Instructions arriba). Sin cambios visuales.

## Fase 4 — Camera + Photo Review (implementado)

### Camera — timeline de entrada (`createCameraIntroTimeline`)

Corta a propósito (300-500ms): la persona debe poder tomarse la foto
rápido, no hay intro larga como en Home/Instructions.

1. Fondo — `opacity 0→1`, 0.4s.
2. Branding (logo + badge "3 · TOMA DE FOTO" + "¡Sonríe!" + "Estamos
   tomando tu foto", los 4 como una sola unidad `refs.branding`) —
   `y -12→0`, 0.35s. Badge/título/subtítulo ahora son imágenes reales
   (`assets.camera.badge/titleSonrie/subtitle`) en vez del texto plano
   original — ver "Ajuste con assets reales" más abajo.
3. Marco del preview — `scale .97→1`, 0.4s.
4. Controles (botón shutter) — `y 16→0`, 0.35s.

Sin motion ambiental: "la cámara en vivo ya aporta movimiento" (pedido
explícito del brief) — nada de foliage ni micro-shakes en esta pantalla.

### Countdown (`animateCountdownDigit`)

Al tocar el shutter: countdown 3→2→1 con `setTimeout` recursivo (un solo
timer vivo a la vez, guardado en un ref y limpiado al desmontar — nunca
`setInterval`). Cada dígito: `scale .7→1`, `opacity 0→1`, 0.22s,
`back.out(1.6)`, luego fade-out (`opacity→0`, 0.18s) 0.35s después. Con
`prefers-reduced-motion`: solo fade in/out sin scale.

### Flash + captura (`playCaptureFlash`)

Al llegar a 0: overlay blanco (`opacity 0→0.85→0`, ~250ms total:
0.1s in + 0.15s out). `playCaptureFlash()` devuelve una Promise que
resuelve al terminar; `CameraScreen` hace
`Promise.all([playCaptureFlash(flashRef), captureFrame()])` — espera tanto
el flash como el frame capturado (lo que tarde más) antes de navegar a
Photo Review, evitando la condición de carrera de intentar navegar con la
foto todavía sin resolver. El flash se mantiene igual con reduced motion
(es feedback funcional de que la foto se tomó, no decorativo). Vibración
háptica (~50ms) tras la captura si `navigator.vibrate` existe
(feature-detected, en un `try/catch`, nunca bloqueante).

### Photo Review — timeline de entrada (`createPhotoReviewIntroTimeline`)

Corta, sin ambient motion (la composición debe quedarse estable para que
la persona decida):

1. Foto — `scale .96→1`, `opacity 0→1`, 0.45s.
2. Copy (eyebrow + título + subtítulo) — `x 20→0`, 0.4s, solapado.
3. Botones (Repetir / Continuar) — `y 16→0`, stagger 0.1s.

### `prefers-reduced-motion`

Mismo patrón que Home/Instructions vía `useReducedMotion()` en ambas
pantallas: fade-in corto sin desplazamientos/scale; el flash de captura es
la única excepción intencional (ver arriba).

### Cleanup específico de Camera

Además del cleanup estándar de GSAP: el `setTimeout` del countdown se
limpia en un `useEffect` de desmontaje dedicado, y `useCamera` detiene el
`MediaStream` en su propio cleanup (ver `docs/ARCHITECTURE.md`). Verificado
con Playwright (cámara falsa de Chromium): tras varios ciclos
Camera→captura→Retake→Camera, el conteo de `getUserMedia()` y
`track.stop()` queda balanceado (0 tracks activos al finalizar).

## Instructions y Camera — ajuste con assets reales

Corrección posterior a Fase 4 (mismo tipo de ajuste que "Home — ajuste de
layout con assets reales"): se integraron los assets reales entregados
para Instructions y Camera, reemplazando placeholders CSS/SVG.

### Instructions

Capas nuevas (`src/animations/instructionsAnimations.js` reescrito,
mismo patrón de timeline con cursor absoluto + stagger que antes):

- Fondo ahora son **4 piezas independientes** (`bgTop`, `bgLeft`, `bgRight`,
  `bgBottom`) + una silueta atmosférica (`skyline`) + un acento de foliage
  de esquina (`foliageCorner`) + un flourish "Cali Siempre Inspira"
  (`flourish`) — las 7 entran juntas con un stagger corto (0.05s) en vez
  de una sola imagen fusionada, para poder animarlas por separado a
  futuro.
- La botella (`assets.instructions.bottle`) tiene su propia entrada
  protagonista (`scale .85→1`, `y 80→0`, `x 40→0`, `back.out(1.1)`),
  como en Home.
- El antiguo componente `InstructionStep` (número+ícono+título+descripción
  armados en CSS) se eliminó: los 5 pasos ahora son imágenes completas
  (`assets.instructions.steps`, ya traen número/ícono/texto renderizados)
  que solo animan como bloque (`opacity+y+scale`, stagger 0.12s) — sin la
  sub-animación de "ícono entra 80ms después" (ya no aplica, es una sola
  imagen).
- Nuevo badge "2 · INSTRUCCIONES" (imagen) y subtítulo "Sigue estos pasos y
  vive la experiencia" (texto real) entre el logo y los pasos.
- El banner horizontal "EL SABOR que nos une ¡VA CON TODO!"
  (`assets.instructions.campaignBanner`) entra justo antes del botón,
  además del texto de campaña pequeño ya existente arriba a la izquierda
  (`instructions-screen__campaign`, sin cambios).

Motion ambiental: igual patrón (botella flotando, botón respirando) más un
balanceo muy lento del foliage de esquina (`rotate`, `transformOrigin:
"bottom left"`, 9s). Sigue sin animar las 5 tarjetas de pasos tras el
intro (legibilidad).

### Camera

Sin cambios en la estructura del timeline (`createCameraIntroTimeline`
sigue igual: fondo → branding → marco → controles). Lo que cambió es el
CONTENIDO de cada capa:

- Fondo: de gradiente CSS a foto real (`assets.camera.background`).
- Branding: logo + badge "3 · TOMA DE FOTO" + "¡Sonríe!" + "Estamos
  tomando tu foto" (las 3 últimas ahora imágenes, antes texto plano).
- Marco del preview: `border`/`box-shadow` reforzados a un glow azul más
  marcado, y la guía de encuadre (`.camera-screen__guide`) pasó de un
  óvalo punteado a 4 corner-brackets en las esquinas (blanco, estilo
  viewfinder) — inspirado en `camera/frame-reference.png`, que **no** se
  usó como asset final porque trae una foto de stock de una persona real
  horneada en el PNG (ver `docs/ARCHITECTURE.md`).
- `CaptureButton` se mantuvo como componente interactivo (no se reemplazó
  por `camera/shutter-reference.png`), solo como referencia de estilo.

## Fases siguientes

Se documentarán aquí `MOTION_SPEC` para Location Selection, Processing,
Result, QR y Thank You a medida que se implementen.
