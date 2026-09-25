import { forwardRef } from "react";
import { assets } from "../../config/assets";
import { COPY } from "../../config/copy";
import "./BrandLogo.css";

// Logo oficial "Aguardiente Blanco del Valle Fiesta". La ruta vive en
// config/assets.js: para reemplazar el asset basta con actualizar esa
// ruta, sin tocar quien consume este componente.
const BrandLogo = forwardRef(function BrandLogo({ className = "", ...rest }, ref) {
  return (
    <img
      ref={ref}
      className={`brand-logo ${className}`.trim()}
      src={assets.brand.logoFiesta}
      alt={COPY.home.logoAlt}
      {...rest}
    />
  );
});

export default BrandLogo;
