import { forwardRef } from "react";
import "./BrandBottle.css";

// Placeholder de la botella Fiesta hasta recibir el render oficial
// (ver docs/ASSETS_TODO.md). Estructurado para reemplazarse por una <img>
// apuntando a assets.bottle.fiesta sin tocar quien lo consume.
const BrandBottle = forwardRef(function BrandBottle({ className = "", ...rest }, ref) {
  return (
    <div ref={ref} className={`brand-bottle ${className}`.trim()} {...rest}>
      <div className="brand-bottle__glow" aria-hidden="true" />
      <div className="brand-bottle__cap" />
      <div className="brand-bottle__neck" />
      <div className="brand-bottle__body">
        <span className="brand-bottle__label">{"BOTELLA\nFIESTA"}</span>
      </div>
    </div>
  );
});

export default BrandBottle;
