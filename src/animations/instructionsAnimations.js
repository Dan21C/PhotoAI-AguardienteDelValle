import gsap from "gsap";

// Valores reales usados por el timeline de Instructions. Documentados
// también en docs/MOTION_SPEC.md — si cambias algo aquí, actualiza ese
// archivo.
export const INSTRUCTIONS_MOTION = {
  intro: {
    background: { duration: 0.45 },
    bottle: { duration: 0.9, fromScale: 0.85, fromY: 80, fromX: 40 },
    campaign: { duration: 0.45, fromY: -16 },
    logo: { duration: 0.5, fromScale: 0.85, fromY: -16 },
    badge: { duration: 0.45, fromScale: 0.9 },
    subtitle: { duration: 0.45, fromY: 14 },
    step: { duration: 0.5, fromY: 24, fromScale: 0.94 },
    banner: { duration: 0.45, fromY: 14 },
    button: { duration: 0.5, fromScale: 0.9, fromY: 16 },
    stagger: 0.12,
  },
  ambient: {
    foliageCorner: { rotate: 1, duration: 9 },
    bottle: { y: -6, duration: 6 },
    button: { scale: 1.02, glowOpacity: 0.75, duration: 2.6 },
  },
};

// Construye la timeline de entrada de Instructions: fondo (4 piezas) →
// decoración atmosférica → botella → copy de campaña → logo → badge →
// subtítulo → pasos 01-05 (stagger) → banner de campaña → botón.
//
// Con prefers-reduced-motion se omiten desplazamientos/overshoots y solo
// se hace un fade-in corto y simultáneo (sin perder funcionalidad).
export function createInstructionsIntroTimeline(refs, { reducedMotion = false } = {}) {
  const { intro } = INSTRUCTIONS_MOTION;
  const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

  const stepEls = refs.steps.map((stepRef) => stepRef.current).filter(Boolean);
  const backgroundPieces = [
    refs.bgTop.current,
    refs.bgLeft.current,
    refs.bgRight.current,
    refs.bgBottom.current,
    refs.skyline.current,
    refs.foliageCorner.current,
    refs.flourish.current,
  ].filter(Boolean);

  const contentElements = [
    refs.bottle.current,
    refs.campaign.current,
    refs.logo.current,
    refs.badge.current,
    refs.subtitle.current,
    ...stepEls,
    refs.banner.current,
    refs.button.current,
  ];

  if (reducedMotion) {
    tl.fromTo(
      [...backgroundPieces, ...contentElements],
      { autoAlpha: 0 },
      { autoAlpha: 1, duration: 0.25, stagger: 0.02, ease: "power1.out" },
    );
    return tl;
  }

  tl.set(contentElements, { autoAlpha: 0 });
  tl.set(backgroundPieces, { autoAlpha: 0 });

  tl.to(backgroundPieces, {
    autoAlpha: 1,
    duration: intro.background.duration,
    stagger: 0.05,
    ease: "power1.out",
  });

  tl.fromTo(
    refs.bottle.current,
    { autoAlpha: 0, scale: intro.bottle.fromScale, y: intro.bottle.fromY, x: intro.bottle.fromX },
    { autoAlpha: 1, scale: 1, y: 0, x: 0, duration: intro.bottle.duration, ease: "back.out(1.1)" },
    "-=0.2",
  );

  tl.fromTo(
    refs.campaign.current,
    { autoAlpha: 0, y: intro.campaign.fromY },
    { autoAlpha: 1, y: 0, duration: intro.campaign.duration },
    "-=0.5",
  );

  tl.fromTo(
    refs.logo.current,
    { autoAlpha: 0, scale: intro.logo.fromScale, y: intro.logo.fromY },
    { autoAlpha: 1, scale: 1, y: 0, duration: intro.logo.duration },
    "-=0.25",
  );

  tl.fromTo(
    refs.badge.current,
    { autoAlpha: 0, scale: intro.badge.fromScale },
    { autoAlpha: 1, scale: 1, duration: intro.badge.duration },
    `-=${intro.logo.duration - intro.stagger}`,
  );

  tl.fromTo(
    refs.subtitle.current,
    { autoAlpha: 0, y: intro.subtitle.fromY },
    { autoAlpha: 1, y: 0, duration: intro.subtitle.duration },
    `-=${intro.badge.duration - intro.stagger}`,
  );

  // Los 5 pasos entran uno por uno con stagger fijo, usando un cursor
  // absoluto en la timeline (igual patrón que en la versión anterior).
  let time = tl.duration() - (intro.subtitle.duration - intro.stagger);

  stepEls.forEach((stepEl) => {
    tl.fromTo(
      stepEl,
      { autoAlpha: 0, y: intro.step.fromY, scale: intro.step.fromScale },
      { autoAlpha: 1, y: 0, scale: 1, duration: intro.step.duration },
      time,
    );
    time += intro.stagger;
  });

  tl.fromTo(
    refs.banner.current,
    { autoAlpha: 0, y: intro.banner.fromY },
    { autoAlpha: 1, y: 0, duration: intro.banner.duration },
    time,
  );

  tl.fromTo(
    refs.button.current,
    { autoAlpha: 0, scale: intro.button.fromScale, y: intro.button.fromY },
    { autoAlpha: 1, scale: 1, y: 0, duration: intro.button.duration, ease: "back.out(1.5)" },
    "-=0.1",
  );

  return tl;
}

// Motion ambiental posterior al intro: foliage/esquina meciéndose, botella
// flotando, botón respirando. Deliberadamente NO anima las 5 tarjetas de
// pasos: la legibilidad tiene prioridad. Con prefers-reduced-motion no se
// crean loops (no-op).
export function startInstructionsAmbientMotion(refs, { reducedMotion = false } = {}) {
  if (reducedMotion) return () => {};

  const { ambient } = INSTRUCTIONS_MOTION;
  const tweens = [];

  if (refs.foliageCorner.current) {
    tweens.push(
      gsap.to(refs.foliageCorner.current, {
        rotate: ambient.foliageCorner.rotate,
        duration: ambient.foliageCorner.duration,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        transformOrigin: "bottom left",
      }),
    );
  }

  if (refs.bottle.current) {
    tweens.push(
      gsap.to(refs.bottle.current, {
        y: ambient.bottle.y,
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

  return () => tweens.forEach((tween) => tween.kill());
}
