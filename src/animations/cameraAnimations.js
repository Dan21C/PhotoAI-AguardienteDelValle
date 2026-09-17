import gsap from "gsap";

// Valores reales usados por Camera. Documentados también en
// docs/MOTION_SPEC.md — si cambias algo aquí, actualiza ese archivo.
export const CAMERA_MOTION = {
  intro: { duration: 0.4 },
  countdownDigit: { inDuration: 0.22, holdDelay: 0.35, outDuration: 0.18 },
  flash: { inDuration: 0.1, outDuration: 0.15, peakOpacity: 0.85 },
};

// Entrada corta (300-500ms): fondo → branding → preview → controles. Nada
// de intros largas: la persona debe poder tomarse la foto rápido.
// Con prefers-reduced-motion se omite el scale del preview.
export function createCameraIntroTimeline(refs, { reducedMotion = false } = {}) {
  const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

  const elements = [refs.branding.current, refs.previewFrame.current, refs.controls.current].filter(
    Boolean,
  );

  if (reducedMotion) {
    tl.fromTo(
      [refs.background.current, ...elements],
      { autoAlpha: 0 },
      { autoAlpha: 1, duration: 0.2, stagger: 0.02, ease: "power1.out" },
    );
    return tl;
  }

  tl.set(elements, { autoAlpha: 0 });

  tl.fromTo(
    refs.background.current,
    { autoAlpha: 0 },
    { autoAlpha: 1, duration: CAMERA_MOTION.intro.duration, ease: "power1.out" },
  );

  tl.fromTo(
    refs.branding.current,
    { autoAlpha: 0, y: -12 },
    { autoAlpha: 1, y: 0, duration: 0.35 },
    "-=0.15",
  );

  tl.fromTo(
    refs.previewFrame.current,
    { autoAlpha: 0, scale: 0.97 },
    { autoAlpha: 1, scale: 1, duration: 0.4 },
    "-=0.2",
  );

  tl.fromTo(
    refs.controls.current,
    { autoAlpha: 0, y: 16 },
    { autoAlpha: 1, y: 0, duration: 0.35 },
    "-=0.2",
  );

  return tl;
}

// Anima cada dígito del countdown (3, 2, 1): entra con scale+fade y se
// desvanece antes del siguiente número. Devuelve el tween/timeline para
// que el llamador pueda matarlo si el componente se desmonta a mitad.
export function animateCountdownDigit(el, { reducedMotion = false } = {}) {
  if (!el) return null;

  if (reducedMotion) {
    return gsap.fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.15 });
  }

  const { inDuration, holdDelay, outDuration } = CAMERA_MOTION.countdownDigit;
  const tl = gsap.timeline();

  tl.fromTo(
    el,
    { scale: 0.7, autoAlpha: 0 },
    { scale: 1, autoAlpha: 1, duration: inDuration, ease: "back.out(1.6)" },
  );
  tl.to(el, { autoAlpha: 0, duration: outDuration }, `+=${holdDelay}`);

  return tl;
}

// Flash de captura: overlay blanco muy breve. Se mantiene igual con
// prefers-reduced-motion (es feedback funcional de que la foto se tomó,
// no una animación decorativa). Devuelve una Promise que resuelve cuando
// el flash termina, para poder esperarlo junto a la captura del frame.
export function playCaptureFlash(flashRef) {
  const { inDuration, outDuration, peakOpacity } = CAMERA_MOTION.flash;

  return new Promise((resolve) => {
    if (!flashRef.current) {
      resolve();
      return;
    }

    gsap
      .timeline({ onComplete: resolve })
      .set(flashRef.current, { opacity: 0 })
      .to(flashRef.current, { opacity: peakOpacity, duration: inDuration, ease: "power1.out" })
      .to(flashRef.current, { opacity: 0, duration: outDuration, ease: "power1.in" });
  });
}
