import { forwardRef } from "react";
import "./CaptureButton.css";

// Botón "shutter" circular, distinto de AnimatedButton (ese es para CTAs
// de texto; este es el disparador de la cámara). Reusable si otra pantalla
// necesita un botón de captura equivalente.
const CaptureButton = forwardRef(function CaptureButton({ className = "", ...rest }, ref) {
  return (
    <button ref={ref} type="button" className={`capture-button ${className}`.trim()} {...rest}>
      <span className="capture-button__ring" aria-hidden="true" />
      <span className="capture-button__core" aria-hidden="true" />
    </button>
  );
});

export default CaptureButton;
