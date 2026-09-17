# Assets pendientes de producción

Todos los assets reales serán suministrados/reemplazados posteriormente. La
arquitectura (`src/config/assets.js`) permite reemplazarlos sin tocar
componentes. Mientras tanto, las pantallas deben poder construirse con
placeholders (gradientes, bloques de imagen, frames vacíos).

## Marca

- [ ] Logo Aguardiente Blanco del Valle oficial
- [ ] Logo Fiesta
- [ ] Botella Fiesta PNG transparente
- [ ] Wordmark / tipografía de marca en imagen (si aplica)
- [ ] Fuente oficial **Sink** (agregar como asset de fuente real; hasta
      entonces se usa `font-family: "Sink", Impact, sans-serif` como fallback
      documentado en `src/styles/tokens.css`)
- [ ] Favicon / ícono oficial de marca (actualmente se usa el favicon por
      defecto de Vite como placeholder)

## Fondos y decoración

- [ ] Background Fiesta azul (Home)
- [ ] Background azul para pantalla QR
- [ ] Pattern de marca azul
- [ ] Follaje/vegetación izquierda
- [ ] Follaje/vegetación derecha

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

- [ ] Icono de Instagram (oficial de marca, no genérico)
- [ ] Iconos de pasos de instrucciones
- [ ] Detalle decorativo de esquina para tarjeta QR

## Notas

- Verificar ortografía siempre, especialmente **Cristo Rey** (nunca "Cristo
  Redentor", "Chaza Rey", "Cristo Reyy" u otras variantes incorrectas).
- No redibujar logos oficiales en CSS: usar placeholder identificado mientras
  no exista el asset real.
- No descargar fuentes de páginas desconocidas: Sink debe integrarse como
  asset oficial suministrado por el cliente/marca.
