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

## Fase 3 — Instructions (pendiente de implementar)

- Stagger de pasos: 0.12–0.18s entre cada uno.
- Cada paso: `opacity 0→1`, `x -30→0`, `scale .97→1`.
- Icono aparece con un pequeño delay adicional respecto a su contenedor.
- Copy principal con glow periódico sutil.

## Fases siguientes

Se documentarán aquí `MOTION_SPEC` para Camera/Photo Review, Location
Selection, Processing, Result, QR y Thank You a medida que se implementen.
