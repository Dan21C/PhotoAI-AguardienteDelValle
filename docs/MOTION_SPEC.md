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

## Fase 2 — Home (implementado)

Toda la lógica vive en `src/animations/homeAnimations.js`
(`HOME_MOTION`, `createHomeIntroTimeline`, `startAmbientMotion`,
`startEnergyPulses`), orquestada desde `src/screens/HomeScreen/HomeScreen.jsx`
dentro de un único `useGSAP(..., { scope: containerRef })` con cleanup.

### Timeline de entrada (`createHomeIntroTimeline`)

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

### Motion ambiental (`startAmbientMotion`, arranca al terminar el intro)

Cada capa respira a una velocidad distinta (nada sincronizado):

- Foliage izquierdo: `rotate 0→1deg`, `x +4`, `y +3`, 9s, yoyo, `repeat: -1`.
- Foliage derecho: `rotate 0→-1deg`, `x -3`, `y +4`, 11s, yoyo, `repeat: -1`.
- Botella: `y 0↔-5px`, `rotation 0↔0.3deg`, 6.5s, yoyo, `repeat: -1`.
- Botón: `scale 1↔1.025`, 2.4s, yoyo, `repeat: -1`; su glow interno
  (`.animated-button__glow`) sube de opacidad en sincronía.

### Golpe de energía ocasional (`startEnergyPulses`)

Cada 8–14s (aleatorio, `gsap.utils.random`), un micro-shake de ~0.32s en
varias capas a la vez (headline, logo, decoración, botella, botón). El
timer se reprograma recursivamente vía `setTimeout` y se limpia junto con
la tween activa en el cleanup de `useGSAP`.

**Nota de implementación (evita pisar las loops ambientales):** GSAP
sobreescribe por defecto una tween activa cuando otra tween distinta anima
la misma propiedad del mismo nodo. Como la ambient loop de la botella ya
usa `rotation`+`y`, y la del botón ya usa `scale`, el pulso de energía usa
propiedades distintas en esos dos casos para no matar la loop infinita:
botella → `x` (en vez de `rotation`), botón → `y` (en vez de `scale`).
Headline, logo y decoración sí usan `x`/`y` tal como se pidió, porque no
tienen loop ambiental propia con la que puedan chocar.

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

3 arriba (`instructions-screen__row--top`) + 2 abajo
(`instructions-screen__row--bottom`), como pidió el brief: el paso 5
necesita más espacio y así lo obtiene sin angostar los otros cuatro.

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

## Fases siguientes

Se documentarán aquí `MOTION_SPEC` para Camera/Photo Review, Location
Selection, Processing, Result, QR y Thank You a medida que se implementen.
