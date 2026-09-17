import gsap from "gsap";

// Valores reales usados por Photo Review. Documentados también en
// docs/MOTION_SPEC.md.
export const PHOTO_REVIEW_MOTION = {
  photo: { duration: 0.45, fromScale: 0.96 },
  copy: { duration: 0.4, fromX: 20 },
  actions: { duration: 0.4, stagger: 0.1, fromY: 16 },
};

// Entrada breve: foto (scale+fade) → copy (x+fade) → botones (stagger).
// Sin ambient motion: la composición debe quedarse estable para decidir.
export function createPhotoReviewIntroTimeline(refs, { reducedMotion = false } = {}) {
  const { photo, copy, actions } = PHOTO_REVIEW_MOTION;
  const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

  const actionButtons = refs.actionButtons?.filter(Boolean) ?? [];

  if (reducedMotion) {
    tl.fromTo(
      [refs.photoPanel.current, refs.copyPanel.current, ...actionButtons],
      { autoAlpha: 0 },
      { autoAlpha: 1, duration: 0.2, stagger: 0.02, ease: "power1.out" },
    );
    return tl;
  }

  tl.set([refs.copyPanel.current, ...actionButtons], { autoAlpha: 0 });

  tl.fromTo(
    refs.photoPanel.current,
    { autoAlpha: 0, scale: photo.fromScale },
    { autoAlpha: 1, scale: 1, duration: photo.duration },
  );

  tl.fromTo(
    refs.copyPanel.current,
    { autoAlpha: 0, x: copy.fromX },
    { autoAlpha: 1, x: 0, duration: copy.duration },
    "-=0.2",
  );

  tl.fromTo(
    actionButtons,
    { autoAlpha: 0, y: actions.fromY },
    { autoAlpha: 1, y: 0, duration: actions.duration, stagger: actions.stagger },
    "-=0.15",
  );

  return tl;
}
