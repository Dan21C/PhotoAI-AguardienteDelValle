import { useEffect, useState } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

// Detecta prefers-reduced-motion para que las pantallas con GSAP puedan
// saltarse loops ambientales y usar una entrada mínima, sin perder
// funcionalidad. Usado por HomeScreen e InstructionsScreen.
export function useReducedMotion() {
  const [reduced, setReduced] = useState(
    () => typeof window !== "undefined" && window.matchMedia(QUERY).matches,
  );

  useEffect(() => {
    const mediaQueryList = window.matchMedia(QUERY);
    const handleChange = (event) => setReduced(event.matches);

    mediaQueryList.addEventListener("change", handleChange);
    return () => mediaQueryList.removeEventListener("change", handleChange);
  }, []);

  return reduced;
}
