import { assets } from "./assets";
import { COPY } from "./copy";

// Locaciones disponibles en la Selección de Locación.
// animatedPreview es opcional y puede ser GIF, WebP animado, MP4 o WebM.
export const LOCATIONS = [
  {
    id: "calle-del-sabor",
    name: COPY.locations.calleSabor,
    staticPreview: assets.locations.calleSabor.static,
    animatedPreview: assets.locations.calleSabor.animated,
  },
  {
    id: "plaza-varela",
    name: COPY.locations.plazaVarela,
    staticPreview: assets.locations.plazaVarela.static,
    animatedPreview: assets.locations.plazaVarela.animated,
  },
  {
    id: "cristo-rey",
    name: COPY.locations.cristoRey,
    staticPreview: assets.locations.cristoRey.static,
    animatedPreview: assets.locations.cristoRey.animated,
  },
];
