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

## Fase 2 — Home (pendiente de implementar)

- Timeline de entrada: fondo → decoración → vegetación → botella → logo →
  headline → descripción → botón.
- Elementos entran desde fuera del viewport (foliage ±200px en X, elementos
  superiores -120px en Y).
- Botella: entrada protagonista con overshoot leve (`scale .75→1`,
  `rotation 6deg→0deg`, `y 120→0`).
- Botón "Iniciar" entra de último y respira en loop (`scale 1→1.025→1`,
  2–3s, glow ligero).
- Micro-shake energético ocasional cada 8–14s (aleatorio), 250–400ms.

## Fase 3 — Instructions (pendiente de implementar)

- Stagger de pasos: 0.12–0.18s entre cada uno.
- Cada paso: `opacity 0→1`, `x -30→0`, `scale .97→1`.
- Icono aparece con un pequeño delay adicional respecto a su contenedor.
- Copy principal con glow periódico sutil.

## Fases siguientes

Se documentarán aquí `MOTION_SPEC` para Camera/Photo Review, Location
Selection, Processing, Result, QR y Thank You a medida que se implementen.
