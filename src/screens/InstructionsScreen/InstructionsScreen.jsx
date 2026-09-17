import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import AnimatedButton from "../../components/AnimatedButton/AnimatedButton";
import InstructionStep from "../../components/InstructionStep/InstructionStep";
import { useSession } from "../../context/SessionContext";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { COPY } from "../../config/copy";
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
  const backgroundRef = useRef(null);
  const decorationRef = useRef(null);
  const foliageLeftRef = useRef(null);
  const foliageRightRef = useRef(null);
  const campaignRef = useRef(null);
  const titleRef = useRef(null);
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
        background: backgroundRef,
        decoration: decorationRef,
        foliageLeft: foliageLeftRef,
        foliageRight: foliageRightRef,
        campaign: campaignRef,
        title: titleRef,
        steps: stepRefs,
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
      <div className="instructions-screen__background" ref={backgroundRef} />

      <div className="instructions-screen__decoration" ref={decorationRef} aria-hidden="true" />

      <div
        className="instructions-screen__foliage instructions-screen__foliage--left"
        ref={foliageLeftRef}
        aria-hidden="true"
      />
      <div
        className="instructions-screen__foliage instructions-screen__foliage--right"
        ref={foliageRightRef}
        aria-hidden="true"
      />

      <div className="instructions-screen__content">
        <header className="instructions-screen__header">
          <div className="instructions-screen__campaign" ref={campaignRef}>
            <p>{COPY.campaign.line1}</p>
            <p>{COPY.campaign.line2}</p>
            <p>{COPY.campaign.line3}</p>
          </div>

          <h1 className="instructions-screen__title" ref={titleRef}>
            {COPY.instructions.title}
          </h1>
        </header>

        <ol className="instructions-screen__steps">
          {steps.map((step, index) => (
            <InstructionStep
              key={step.title}
              ref={(node) => {
                stepRefs[index].current = node;
              }}
              index={index}
              icon={step.icon}
              title={step.title}
              description={step.description}
              className={index === 4 ? "instruction-step--wide" : ""}
            />
          ))}
        </ol>

        <footer className="instructions-screen__footer">
          <AnimatedButton
            ref={buttonRef}
            className="instructions-screen__cta"
            onClick={completeInstructions}
          >
            {COPY.instructions.cta}
          </AnimatedButton>
        </footer>
      </div>
    </div>
  );
}
