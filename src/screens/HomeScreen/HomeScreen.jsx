import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import BrandBottle from "../../components/BrandBottle/BrandBottle";
import BrandLogo from "../../components/BrandLogo/BrandLogo";
import AnimatedButton from "../../components/AnimatedButton/AnimatedButton";
import { useSession } from "../../context/SessionContext";
import { COPY } from "../../config/copy";
import {
  createHomeIntroTimeline,
  startAmbientMotion,
  startEnergyPulses,
} from "../../animations/homeAnimations";
import "./HomeScreen.css";

gsap.registerPlugin(useGSAP);

export default function HomeScreen() {
  const { startExperience } = useSession();

  const containerRef = useRef(null);
  const backgroundRef = useRef(null);
  const decorationRef = useRef(null);
  const foliageLeftRef = useRef(null);
  const foliageRightRef = useRef(null);
  const bottleRef = useRef(null);
  const logoRef = useRef(null);
  const campaignRef = useRef(null);
  const headlineRef = useRef(null);
  const descriptionRef = useRef(null);
  const buttonRef = useRef(null);

  useGSAP(
    () => {
      const refs = {
        background: backgroundRef,
        decoration: decorationRef,
        foliageLeft: foliageLeftRef,
        foliageRight: foliageRightRef,
        bottle: bottleRef,
        logo: logoRef,
        campaign: campaignRef,
        headline: headlineRef,
        description: descriptionRef,
        button: buttonRef,
      };

      const introTl = createHomeIntroTimeline(refs);
      let stopAmbientMotion = () => {};
      let stopEnergyPulses = () => {};

      introTl.eventCallback("onComplete", () => {
        stopAmbientMotion = startAmbientMotion(refs);
        stopEnergyPulses = startEnergyPulses(refs);
      });

      return () => {
        introTl.kill();
        stopAmbientMotion();
        stopEnergyPulses();
      };
    },
    { scope: containerRef },
  );

  return (
    <div className="home-screen" ref={containerRef}>
      <div className="home-screen__background" ref={backgroundRef} />

      <div className="home-screen__decoration" ref={decorationRef} aria-hidden="true" />

      <div className="home-screen__foliage home-screen__foliage--left" ref={foliageLeftRef} aria-hidden="true" />
      <div className="home-screen__foliage home-screen__foliage--right" ref={foliageRightRef} aria-hidden="true" />

      <div className="home-screen__content">
        <div className="home-screen__copy">
          <BrandLogo ref={logoRef} className="home-screen__logo" />

          <div className="home-screen__campaign" ref={campaignRef}>
            <p>{COPY.campaign.line1}</p>
            <p>{COPY.campaign.line2}</p>
            <p>{COPY.campaign.line3}</p>
          </div>

          <h1 className="home-screen__headline" ref={headlineRef}>
            {COPY.home.headline}
          </h1>

          <p className="home-screen__description" ref={descriptionRef}>
            {COPY.home.description.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </p>

          <AnimatedButton
            ref={buttonRef}
            className="home-screen__cta"
            onClick={startExperience}
          >
            {COPY.home.cta}
          </AnimatedButton>
        </div>

        <div className="home-screen__bottle-wrapper">
          <BrandBottle ref={bottleRef} />
        </div>
      </div>
    </div>
  );
}
