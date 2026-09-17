import gsap from "gsap";

// Valores reales usados por el timeline de Instructions. Documentados
// también en docs/MOTION_SPEC.md — si cambias algo aquí, actualiza ese
// archivo.
export const INSTRUCTIONS_MOTION = {
  intro: {
    background: { duration: 0.35 },
    decoration: { duration: 0.5, fromY: -120 },
    foliage: { duration: 0.7, fromX: 200, fromY: 40 },
    campaign: { duration: 0.5, fromY: -20 },
    title: { duration: 0.5, fromY: 30 },
    step: { duration: 0.5, fromX: -30, fromScale: 0.97 },
    icon: { duration: 0.35, delay: 0.08, fromScale: 0.7, fromRotation: -5 },
    button: { duration: 0.5, fromScale: 0.9, fromY: 20 },
    stagger: 0.16,
  },
  ambient: {
    foliageLeft: { rotate: 1, x: 4, y: 3, duration: 8 },
    foliageRight: { rotate: -1, x: -3, y: 4, duration: 10 },
    button: { scale: 1.02, glowOpacity: 0.75, duration: 2.8 },
  },
  campaignGlow: {
    duration: 4.2,
  },
};

// Construye la timeline de entrada de Instructions: fondo → decoración →
// foliage → branding (copy de campaña) → título → pasos 01-05 (uno por
// uno, con su icono entrando ~80ms después) → botón.
//
// Con prefers-reduced-motion se omiten desplazamientos/overshoots y solo
// se hace un fade-in corto y simultáneo (sin perder funcionalidad).
export function createInstructionsIntroTimeline(refs, { reducedMotion = false } = {}) {
  const { intro } = INSTRUCTIONS_MOTION;
  const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

  const stepEls = refs.steps.map((stepRef) => stepRef.current).filter(Boolean);
  const allElements = [
    refs.decoration.current,
    refs.foliageLeft.current,
    refs.foliageRight.current,
    refs.campaign.current,
    refs.title.current,
    ...stepEls,
    refs.button.current,
  ];

  if (reducedMotion) {
    tl.fromTo(
      [refs.background.current, ...allElements],
      { autoAlpha: 0 },
      { autoAlpha: 1, duration: 0.25, stagger: 0.02, ease: "power1.out" },
    );
    return tl;
  }

  tl.set(allElements, { autoAlpha: 0 });

  tl.fromTo(
    refs.background.current,
    { autoAlpha: 0 },
    { autoAlpha: 1, duration: intro.background.duration, ease: "power1.out" },
  );

  tl.fromTo(
    refs.decoration.current,
    { autoAlpha: 0, y: intro.decoration.fromY },
    { autoAlpha: 1, y: 0, duration: intro.decoration.duration },
    "-=0.1",
  );

  tl.fromTo(
    refs.foliageLeft.current,
    { autoAlpha: 0, x: -intro.foliage.fromX, y: intro.foliage.fromY },
    { autoAlpha: 1, x: 0, y: 0, duration: intro.foliage.duration, ease: "back.out(1.4)" },
    "-=0.15",
  );

  tl.fromTo(
    refs.foliageRight.current,
    { autoAlpha: 0, x: intro.foliage.fromX, y: intro.foliage.fromY },
    { autoAlpha: 1, x: 0, y: 0, duration: intro.foliage.duration, ease: "back.out(1.4)" },
    "<0.08",
  );

  tl.fromTo(
    refs.campaign.current,
    { autoAlpha: 0, y: intro.campaign.fromY },
    { autoAlpha: 1, y: 0, duration: intro.campaign.duration },
    "-=0.25",
  );

  tl.fromTo(
    refs.title.current,
    { autoAlpha: 0, y: intro.title.fromY },
    { autoAlpha: 1, y: 0, duration: intro.title.duration },
    `-=${intro.campaign.duration - intro.stagger}`,
  );

  // Los 5 pasos entran uno por uno con un stagger fijo, aunque
  // visualmente estén organizados en grid (3 arriba + 2 abajo). Se usa un
  // cursor absoluto (segundos desde el inicio de la timeline) para poder
  // aplicar el mismo stagger a cada paso + su icono.
  let time = tl.duration() - (intro.title.duration - intro.stagger);

  refs.steps.forEach((stepRef) => {
    const stepEl = stepRef.current;
    if (!stepEl) {
      time += intro.stagger;
      return;
    }

    tl.fromTo(
      stepEl,
      { autoAlpha: 0, x: intro.step.fromX, scale: intro.step.fromScale },
      { autoAlpha: 1, x: 0, scale: 1, duration: intro.step.duration },
      time,
    );

    const icon = stepEl.querySelector(".instruction-step__icon-badge");
    if (icon) {
      tl.fromTo(
        icon,
        { autoAlpha: 0, scale: intro.icon.fromScale, rotation: intro.icon.fromRotation },
        { autoAlpha: 1, scale: 1, rotation: 0, duration: intro.icon.duration, ease: "back.out(1.3)" },
        time + intro.icon.delay,
      );
    }

    time += intro.stagger;
  });

  tl.fromTo(
    refs.button.current,
    { autoAlpha: 0, scale: intro.button.fromScale, y: intro.button.fromY },
    { autoAlpha: 1, scale: 1, y: 0, duration: intro.button.duration, ease: "back.out(1.5)" },
    time,
  );

  return tl;
}

// Motion ambiental posterior al intro: foliage (brisa) + respiración del
// botón + iluminación del copy de campaña. Deliberadamente NO anima las
// tarjetas de los pasos: la legibilidad tiene prioridad sobre el motion.
// Con prefers-reduced-motion no se crean loops (no-op).
export function startInstructionsAmbientMotion(refs, { reducedMotion = false } = {}) {
  if (reducedMotion) return () => {};

  const { ambient, campaignGlow } = INSTRUCTIONS_MOTION;
  const tweens = [];

  if (refs.foliageLeft.current) {
    tweens.push(
      gsap.to(refs.foliageLeft.current, {
        rotate: ambient.foliageLeft.rotate,
        x: `+=${ambient.foliageLeft.x}`,
        y: `+=${ambient.foliageLeft.y}`,
        duration: ambient.foliageLeft.duration,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      }),
    );
  }

  if (refs.foliageRight.current) {
    tweens.push(
      gsap.to(refs.foliageRight.current, {
        rotate: ambient.foliageRight.rotate,
        x: `+=${ambient.foliageRight.x}`,
        y: `+=${ambient.foliageRight.y}`,
        duration: ambient.foliageRight.duration,
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

  if (refs.campaign.current) {
    // Iluminación ambiental del copy: glow de text-shadow que crece y
    // decrece lentamente. No es un parpadeo: usa sine.inOut y una
    // duración larga (3.5-5s).
    tweens.push(
      gsap.to(refs.campaign.current, {
        "--campaign-glow": 1,
        duration: campaignGlow.duration,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      }),
    );
  }

  return () => tweens.forEach((tween) => tween.kill());
}
