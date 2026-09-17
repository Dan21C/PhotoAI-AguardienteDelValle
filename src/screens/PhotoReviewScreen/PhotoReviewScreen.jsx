import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import AnimatedButton from "../../components/AnimatedButton/AnimatedButton";
import { useSession } from "../../context/SessionContext";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { COPY } from "../../config/copy";
import { createPhotoReviewIntroTimeline } from "../../animations/photoReviewAnimations";
import "./PhotoReviewScreen.css";

gsap.registerPlugin(useGSAP);

export default function PhotoReviewScreen() {
  const { originalPhoto, retakePhoto, confirmPhoto } = useSession();
  const reducedMotion = useReducedMotion();

  const containerRef = useRef(null);
  const photoPanelRef = useRef(null);
  const copyPanelRef = useRef(null);
  const retakeRef = useRef(null);
  const confirmRef = useRef(null);

  useGSAP(
    () => {
      const refs = {
        photoPanel: photoPanelRef,
        copyPanel: copyPanelRef,
        actionButtons: [retakeRef.current, confirmRef.current],
      };
      const tl = createPhotoReviewIntroTimeline(refs, { reducedMotion });
      return () => tl.kill();
    },
    { scope: containerRef, dependencies: [reducedMotion] },
  );

  return (
    <div className="photo-review-screen" ref={containerRef}>
      <div className="photo-review-screen__background" />

      <div className="photo-review-screen__content">
        <div className="photo-review-screen__photo-panel" ref={photoPanelRef}>
          {originalPhoto?.url && (
            <img
              className="photo-review-screen__image"
              src={originalPhoto.url}
              alt=""
            />
          )}
        </div>

        <div className="photo-review-screen__copy-panel" ref={copyPanelRef}>
          <p className="photo-review-screen__eyebrow">{COPY.photoReview.eyebrow}</p>
          <h1 className="photo-review-screen__title">{COPY.photoReview.title}</h1>
          <p className="photo-review-screen__subtitle">{COPY.photoReview.subtitle}</p>

          <div className="photo-review-screen__actions">
            <AnimatedButton
              ref={retakeRef}
              className="photo-review-screen__retake"
              onClick={retakePhoto}
            >
              {COPY.photoReview.retakeCta}
            </AnimatedButton>

            <AnimatedButton ref={confirmRef} onClick={confirmPhoto}>
              {COPY.photoReview.confirmCta}
            </AnimatedButton>
          </div>
        </div>
      </div>
    </div>
  );
}
