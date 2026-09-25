# Assets pendientes de producción

Todos los assets reales serán suministrados/reemplazados posteriormente. La
arquitectura (`src/config/assets.js`) permite reemplazarlos sin tocar
componentes. Mientras tanto, las pantallas deben poder construirse con
placeholders (gradientes, bloques de imagen, frames vacíos).

## Marca

- [x] Logo Aguardiente Blanco del Valle + Fiesta — `public/assets/brand/logo-fiesta.png`
      (`assets.brand.logoFiesta`, usado por `BrandLogo`)
- [x] Botella Fiesta PNG transparente (con agave/hielo) — `public/assets/bottle/fiesta.png`
      (`assets.bottle.fiesta`, usado por `BrandBottle`)
- [ ] Wordmark / tipografía de marca en imagen (si aplica)
- [ ] Fuente oficial **Sink** (agregar como asset de fuente real; hasta
      entonces se usa `font-family: "Sink", Impact, sans-serif` como fallback
      documentado en `src/styles/tokens.css`)
- [ ] Favicon / ícono oficial de marca (actualmente se usa el favicon por
      defecto de Vite como placeholder)

## Fondos y decoración

- [x] Background Home (calle de Cali, Fiesta) — `public/assets/home/background.png`
      (`assets.home.background`)
- [x] Capa de personas/multitud para Home — `public/assets/home/crowd.png`
      (`assets.home.crowd`)
- [x] Gráfico "EL SABOR que nos une ¡VA CON TODO!" (lockup de campaña) —
      `public/assets/home/campaign-lockup.png` (`assets.home.campaignLockup`)
- [x] Fondo Instructions (4 piezas: top/left/right/bottom) — `public/assets/instructions/background-{top,left,right,bottom}.png`
      (`assets.instructions.background*`)
- [x] Silueta/skyline decorativo Instructions — `public/assets/instructions/skyline-silhouette.png`
- [x] Foliage de esquina Instructions — `public/assets/instructions/foliage-corner.png`
- [x] Flourish "Cali Siempre Inspira" (esquina sup. derecha, Home/Instructions) —
      `public/assets/instructions/flourish-top-right.png`
- [x] Background Camera — `public/assets/camera/background.png` (`assets.camera.background`)
- [ ] Background azul para pantalla QR
- [ ] Pattern de marca azul

## Locaciones (Cali)

- [ ] Calle del Sabor — preview estático
- [ ] Calle del Sabor — preview animado (WebM/MP4)
- [ ] Plaza Varela — preview estático
- [ ] Plaza Varela — preview animado (WebM/MP4)
- [ ] Cristo Rey — preview estático
- [ ] Cristo Rey — preview animado (WebM/MP4)

## Resultado final

- [ ] Marco de marca para la foto final (Result)

## Iconografía

- [x] Tarjetas de los 5 pasos de Instructions (número + icono + texto ya
      renderizados) — `public/assets/instructions/step-{1..5}.png`
      (`assets.instructions.steps`)
- [x] Badge "2 · INSTRUCCIONES" — `public/assets/instructions/badge.png`
- [x] Badge "3 · TOMA DE FOTO" — `public/assets/camera/badge.png`
- [x] "¡Sonríe!" / "Estamos tomando tu foto" (Camera) —
      `public/assets/camera/title-sonrie.png` / `subtitle.png`
- [ ] Icono de Instagram (oficial de marca, no genérico) — el de los pasos de
      Instructions ya viene resuelto dentro de `step-5.png`; falta uno suelto
      si se necesita en otra pantalla (Thank You, etc.)
- [ ] Detalle decorativo de esquina para tarjeta QR

## Assets recibidos pero NO usados (ver docs/ARCHITECTURE.md para el porqué)

- `public/assets/instructions/logo-badge-alt.png`,
  `public/assets/instructions/cta-reference.png`,
  `public/assets/camera/logo-badge-alt.png`,
  `public/assets/camera/fiesta-wordmark-alt.png` — redundantes con el logo
  ya integrado (`assets.brand.logoFiesta`) o con `AnimatedButton` (se
  guardan por si se necesitan como referencia, pero no están wireados).
- `public/assets/camera/frame-reference.png` — trae una foto de stock de
  una persona real horneada en el PNG; se usó solo como referencia visual
  para el marco de la cámara (CSS), nunca como asset en producción.
- `public/assets/camera/shutter-reference.png` — referencia visual para el
  estilo del botón de captura (se mantuvo `CaptureButton` como componente
  interactivo real en vez de una imagen plana).
- `public/assets/camera/retry-icon-unused.png` — ícono de "reintentar/girar
  cámara" sin una función correspondiente en el flujo actual; no se
  inventó una funcionalidad nueva para usarlo (fuera de alcance sin
  pedirlo explícitamente).

## Notas

- Verificar ortografía siempre, especialmente **Cristo Rey** (nunca "Cristo
  Redentor", "Chaza Rey", "Cristo Reyy" u otras variantes incorrectas).
- No redibujar logos oficiales en CSS: usar placeholder identificado mientras
  no exista el asset real.
- No descargar fuentes de páginas desconocidas: Sink debe integrarse como
  asset oficial suministrado por el cliente/marca.
