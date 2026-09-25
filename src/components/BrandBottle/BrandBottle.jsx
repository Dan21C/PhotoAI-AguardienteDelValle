import { forwardRef } from "react";
import { assets } from "../../config/assets";
import { COPY } from "../../config/copy";
import "./BrandBottle.css";

// Botella oficial Fiesta (incluye el agave/hielo decorativo del render).
// La ruta vive en config/assets.js: para reemplazar el asset basta con
// actualizar esa ruta, sin tocar quien consume este componente.
const BrandBottle = forwardRef(function BrandBottle({ className = "", ...rest }, ref) {
  return (
    <img
      ref={ref}
      className={`brand-bottle ${className}`.trim()}
      src={assets.bottle.fiesta}
      alt={COPY.home.bottleAlt}
      {...rest}
    />
  );
});

export default BrandBottle;
