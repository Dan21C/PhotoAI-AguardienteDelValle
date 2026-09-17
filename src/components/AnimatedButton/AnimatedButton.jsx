import { forwardRef } from "react";
import "./AnimatedButton.css";

// Botón reutilizable de alto contraste, pensado para touch en tablet.
// El "breathing"/glow en loop y el micro-shake se orquestan desde afuera
// (ver src/animations) apuntando al nodo reenviado por este ref.
const AnimatedButton = forwardRef(function AnimatedButton(
  { children, className = "", ...rest },
  ref,
) {
  return (
    <button ref={ref} type="button" className={`animated-button ${className}`.trim()} {...rest}>
      <span className="animated-button__glow" aria-hidden="true" />
      <span className="animated-button__label">{children}</span>
    </button>
  );
});

export default AnimatedButton;
