import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import BrandLogo from "../../components/BrandLogo/BrandLogo";
import AnimatedButton from "../../components/AnimatedButton/AnimatedButton";
import { useSession } from "../../context/SessionContext";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { COPY } from "../../config/copy";
import { assets } from "../../config/assets";
import {
  createInstructionsIntroTimeline,
  startInstructionsAmbientMotion,
} from "../../animations/instructionsAnimations";
import "./InstructionsScreen.css";

gsap.registerPlugin(useGSAP);

export default function InstructionsScreen() {
  const { completeInstructions } = useSession();
  const reducedMotion = useReducedMotion();

  const containerRef = useRef(null);
  const bgTopRef = useRef(null);
  const bgLeftRef = useRef(null);
  const bgRightRef = useRef(null);
  const bgBottomRef = useRef(null);
  const skylineRef = useRef(null);
  const foliageCornerRef = useRef(null);
  const flourishRef = useRef(null);
  const bottleRef = useRef(null);
  const logoRef = useRef(null);
  const badgeRef = useRef(null);
  const subtitleRef = useRef(null);
  const campaignRef = useRef(null);
  const bannerRef = useRef(null);
  const buttonRef = useRef(null);

  const steps = COPY.instructions.steps;

  // COPY.instructions.steps siempre tiene 5 elementos (ver src/config/copy.js).
  const step1Ref = useRef(null);
  const step2Ref = useRef(null);
  const step3Ref = useRef(null);
  const step4Ref = useRef(null);
  const step5Ref = useRef(null);
  const stepRefs = [step1Ref, step2Ref, step3Ref, step4Ref, step5Ref];

  useGSAP(
    () => {
      const refs = {
        bgTop: bgTopRef,
        bgLeft: bgLeftRef,
        bgRight: bgRightRef,
        bgBottom: bgBottomRef,
        skyline: skylineRef,
        foliageCorner: foliageCornerRef,
        flourish: flourishRef,
        bottle: bottleRef,
        logo: logoRef,
        badge: badgeRef,
        subtitle: subtitleRef,
        campaign: campaignRef,
        steps: stepRefs,
        banner: bannerRef,
        button: buttonRef,
      };

      const introTl = createInstructionsIntroTimeline(refs, { reducedMotion });
      let stopAmbientMotion = () => {};

      introTl.eventCallback("onComplete", () => {
        stopAmbientMotion = startInstructionsAmbientMotion(refs, { reducedMotion });
      });

      return () => {
        introTl.kill();
        stopAmbientMotion();
      };
    },
    { scope: containerRef, dependencies: [reducedMotion] },
  );

  return (
    <div className="instructions-screen" ref={containerRef}>
      <img className="instructions-screen__bg-top" ref={bgTopRef} src={assets.instructions.backgroundTop} alt="" />
      <img className="instructions-screen__bg-left" ref={bgLeftRef} src={assets.instructions.backgroundLeft} alt="" />
      <img className="instructions-screen__bg-right" ref={bgRightRef} src={assets.instructions.backgroundRight} alt="" />
      <img className="instructions-screen__bg-bottom" ref={bgBottomRef} src={assets.instructions.backgroundBottom} alt="" />
      <img className="instructions-screen__skyline" ref={skylineRef} src={assets.instructions.skylineSilhouette} alt="" aria-hidden="true" />
      <img className="instructions-screen__foliage-corner" ref={foliageCornerRef} src={assets.instructions.foliageCorner} alt="" aria-hidden="true" />
      <img className="instructions-screen__flourish" ref={flourishRef} src={assets.instructions.flourishTopRight} alt="" aria-hidden="true" />

      <div className="instructions-screen__vignette" aria-hidden="true" />

      <img
        className="instructions-screen__bottle"
        ref={bottleRef}
        src={assets.instructions.bottle}
        alt={COPY.instructions.bottleAlt}
      />

      <div className="instructions-screen__content">
        <div className="instructions-screen__campaign" ref={campaignRef}>
          <p>{COPY.campaign.line1}</p>
          <p>{COPY.campaign.line2}</p>
          <p>{COPY.campaign.line3}</p>
        </div>

        <header className="instructions-screen__header">
          <BrandLogo ref={logoRef} className="instructions-screen__logo" />

          <img
            className="instructions-screen__badge"
            ref={badgeRef}
            src={assets.instructions.badge}
            alt={`${COPY.instructions.badge.number} ${COPY.instructions.badge.label}`}
          />

          <h1 className="instructions-screen__title" ref={subtitleRef}>
            {COPY.instructions.subtitle}
          </h1>
        </header>

        <ol className="instructions-screen__steps">
          {steps.map((stepAlt, index) => (
            <li key={stepAlt} className="instructions-screen__step">
              <img
                ref={(node) => {
                  stepRefs[index].current = node;
                }}
                src={assets.instructions.steps[index]}
                alt={stepAlt}
              />
            </li>
          ))}
        </ol>

        <img
          className="instructions-screen__banner"
          ref={bannerRef}
          src={assets.instructions.campaignBanner}
          alt={COPY.home.campaignAlt}
        />

        <footer className="instructions-screen__footer">
          <AnimatedButton
            ref={buttonRef}
            className="instructions-screen__cta"
            onClick={completeInstructions}
          >
            {COPY.instructions.cta}
            <span className="instructions-screen__cta-chevron" aria-hidden="true">
              &gt;
            </span>
          </AnimatedButton>
        </footer>
      </div>
    </div>
  );
}
