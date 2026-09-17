import { forwardRef } from "react";
import "./BrandLogo.css";

// Placeholder de branding hasta recibir el logo oficial Fiesta
// (ver docs/ASSETS_TODO.md). Estructurado para reemplazarse por una <img>
// apuntando a assets.brand.logoFiesta sin tocar quien lo consume.
const BrandLogo = forwardRef(function BrandLogo({ className = "", ...rest }, ref) {
  return (
    <div ref={ref} className={`brand-logo ${className}`.trim()} {...rest}>
      <span className="brand-logo__eyebrow">Aguardiente Blanco del Valle</span>
      <span className="brand-logo__mark">FIESTA</span>
    </div>
  );
});

export default BrandLogo;
