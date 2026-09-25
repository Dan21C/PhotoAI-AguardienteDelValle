import gsap from "gsap";

// Valores reales usados por el timeline de Home. Documentados también en
// docs/MOTION_SPEC.md — si cambias algo aquí, actualiza ese archivo.
export const HOME_MOTION = {
  intro: {
    background: { duration: 0.4 },
    crowd: { duration: 0.6, fromY: 24 },
    frame: { duration: 0.5 },
    bottle: { duration: 0.9, fromScale: 0.75, fromRotation: 6, fromY: 120, fromX: 60 },
    badge: { duration: 0.4, fromScale: 0.9, fromY: -10 },
    logo: { duration: 0.55, fromScale: 0.85, fromY: -20 },
    campaign: { duration: 0.55, fromY: 30 },
    headline: { duration: 0.55, fromY: 35 },
    description: { duration: 0.5, fromY: 20 },
    button: { duration: 0.5, fromScale: 0.9, fromY: 20 },
    taglines: { duration: 0.45, fromY: 12 },
    stagger: 0.14,
  },
  ambient: {
    bottle: { y: -5, rotation: 0.3, duration: 6.5 },
    button: { scale: 1.025, glowOpacity: 0.85, duration: 2.4 },
    frameGlow: { duration: 4.5 },
  },
  energyPulse: {
    minDelay: 8,
    maxDelay: 14,
    duration: 0.32,
  },
};

// Construye la timeline de entrada de Home. Los elementos comienzan fuera
// del viewport / invisibles y se van construyendo en el orden pedido:
// fondo → multitud → marco → botella → logo → campaña → headline →
// descripción → botón → taglines.
//
// Con prefers-reduced-motion, se omiten los desplazamientos/overshoots y
// solo se hace un fade-in corto y simultáneo (sin perder funcionalidad).
export function createHomeIntroTimeline(refs, { reducedMotion = false } = {}) {
  const { intro } = HOME_MOTION;

  const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

  const elements = [
    refs.crowd.current,
    refs.frame.current,
    refs.bottle.current,
    refs.badge.current,
    refs.logo.current,
    refs.campaign.current,
    refs.headline.current,
    refs.description.current,
    refs.button.current,
    refs.taglines.current,
  ];

  if (reducedMotion) {
    tl.fromTo(
      [refs.background.current, ...elements],
      { autoAlpha: 0 },
      { autoAlpha: 1, duration: 0.25, stagger: 0.02, ease: "power1.out" },
    );
    return tl;
  }

  tl.set(elements, { autoAlpha: 0 });

  tl.fromTo(
    refs.background.current,
    { autoAlpha: 0 },
    { autoAlpha: 1, duration: intro.background.duration, ease: "power1.out" },
  );

  tl.fromTo(
    refs.crowd.current,
    { autoAlpha: 0, y: intro.crowd.fromY },
    { autoAlpha: 1, y: 0, duration: intro.crowd.duration },
    "-=0.15",
  );

  tl.fromTo(
    refs.frame.current,
    { autoAlpha: 0 },
    { autoAlpha: 1, duration: intro.frame.duration },
    "-=0.2",
  );

  tl.fromTo(
    refs.bottle.current,
    {
      autoAlpha: 0,
      scale: intro.bottle.fromScale,
      rotation: intro.bottle.fromRotation,
      y: intro.bottle.fromY,
      x: intro.bottle.fromX,
    },
    {
      autoAlpha: 1,
      scale: 1,
      rotation: 0,
      y: 0,
      x: 0,
      duration: intro.bottle.duration,
      ease: "back.out(1.15)",
    },
    "-=0.1",
  );

  tl.fromTo(
    refs.badge.current,
    { autoAlpha: 0, scale: intro.badge.fromScale, y: intro.badge.fromY },
    { autoAlpha: 1, scale: 1, y: 0, duration: intro.badge.duration },
    "-=0.35",
  );

  tl.fromTo(
    refs.logo.current,
    { autoAlpha: 0, scale: intro.logo.fromScale, y: intro.logo.fromY },
    { autoAlpha: 1, scale: 1, y: 0, duration: intro.logo.duration },
    "-=0.15",
  );

  tl.fromTo(
    refs.campaign.current,
    { autoAlpha: 0, y: intro.campaign.fromY },
    { autoAlpha: 1, y: 0, duration: intro.campaign.duration },
    `-=${intro.logo.duration - intro.stagger}`,
  );

  tl.fromTo(
    refs.headline.current,
    { autoAlpha: 0, y: intro.headline.fromY },
    { autoAlpha: 1, y: 0, duration: intro.headline.duration },
    `-=${intro.campaign.duration - intro.stagger}`,
  );

  tl.fromTo(
    refs.description.current,
    { autoAlpha: 0, y: intro.description.fromY },
    { autoAlpha: 1, y: 0, duration: intro.description.duration },
    `-=${intro.headline.duration - intro.stagger}`,
  );

  tl.fromTo(
    refs.button.current,
    { autoAlpha: 0, scale: intro.button.fromScale, y: intro.button.fromY },
    {
      autoAlpha: 1,
      scale: 1,
      y: 0,
      duration: intro.button.duration,
      ease: "back.out(1.5)",
    },
    "-=0.1",
  );

  tl.fromTo(
    refs.taglines.current,
    { autoAlpha: 0, y: intro.taglines.fromY },
    { autoAlpha: 1, y: 0, duration: intro.taglines.duration },
    "-=0.1",
  );

  return tl;
}

// Loops ambientales: cada capa respira a una velocidad distinta para dar
// sensación de profundidad. Devuelve una función de limpieza.
// Con prefers-reduced-motion no se crean loops (no-op).
export function startAmbientMotion(refs, { reducedMotion = false } = {}) {
  if (reducedMotion) return () => {};

  const { ambient } = HOME_MOTION;
  const tweens = [];

  if (refs.bottle.current) {
    tweens.push(
      gsap.to(refs.bottle.current, {
        y: ambient.bottle.y,
        rotation: ambient.bottle.rotation,
        duration: ambient.bottle.duration,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      }),
    );
  }

  if (refs.button.current) {
    tweens.push(
      gsap.to(refs.button.current, {
        scale: ambient.button.scale,
        duration: ambient.button.duration,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      }),
    );

    const glow = refs.button.current.querySelector(".animated-button__glow");
    if (glow) {
      tweens.push(
        gsap.to(glow, {
          opacity: ambient.button.glowOpacity,
          duration: ambient.button.duration,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        }),
      );
    }
  }

  if (refs.frame.current) {
    // Pulso de luz muy lento sobre el marco/contorno azul (custom property
    // CSS, ver .home-screen__frame): normal → glow mayor → normal.
    tweens.push(
      gsap.to(refs.frame.current, {
        "--frame-glow": 1,
        duration: ambient.frameGlow.duration,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      }),
    );
  }

  return () => tweens.forEach((tween) => tween.kill());
}

// Golpe de energía ocasional (no constante): cada 8-14s, un micro-shake muy
// sutil en varias capas para que la escena se sienta viva sin parecer un
// error de interfaz. Devuelve una función de limpieza.
// Con prefers-reduced-motion no se programan pulsos (no-op).
export function startEnergyPulses(refs, { reducedMotion = false } = {}) {
  if (reducedMotion) return () => {};

  const { minDelay, maxDelay, duration } = HOME_MOTION.energyPulse;
  let timeoutId = null;
  let activeTimeline = null;

  function pulse() {
    const tl = gsap.timeline();
    const half = duration / 2;

    if (refs.headline.current) {
      tl.to(
        refs.headline.current,
        { x: gsap.utils.random(-2, 2), duration: half, yoyo: true, repeat: 1, ease: "sine.inOut" },
        0,
      );
    }
    if (refs.logo.current) {
      tl.to(
        refs.logo.current,
        { x: gsap.utils.random(-1, 1), duration: half, yoyo: true, repeat: 1, ease: "sine.inOut" },
        0,
      );
    }
    if (refs.bottle.current) {
      // Nota: la ambient loop de la botella ya anima `rotation` + `y`.
      // El pulso usa `x` a propósito para no pisar esa tween (ver
      // docs/MOTION_SPEC.md).
      tl.to(
        refs.bottle.current,
        {
          x: `+=${gsap.utils.random(-2, 2)}`,
          duration: half,
          yoyo: true,
          repeat: 1,
          ease: "sine.inOut",
        },
        0,
      );
    }
    if (refs.button.current) {
      // Nota: la ambient loop del botón ya anima `scale` (breathing) y el
      // glow ya anima `opacity`. El pulso usa `y` a propósito para no pisar
      // esas tweens (ver docs/MOTION_SPEC.md).
      tl.to(
        refs.button.current,
        { y: `+=${gsap.utils.random(-2, 2)}`, duration: half, yoyo: true, repeat: 1, ease: "sine.inOut" },
        0,
      );
    }

    return tl;
  }

  function schedule() {
    const delay = gsap.utils.random(minDelay, maxDelay) * 1000;
    timeoutId = setTimeout(() => {
      activeTimeline = pulse();
      schedule();
    }, delay);
  }

  schedule();

  return () => {
    if (timeoutId) clearTimeout(timeoutId);
    if (activeTimeline) activeTimeline.kill();
  };
}
