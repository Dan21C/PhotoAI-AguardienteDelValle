import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import BrandBottle from "../../components/BrandBottle/BrandBottle";
import BrandLogo from "../../components/BrandLogo/BrandLogo";
import AnimatedButton from "../../components/AnimatedButton/AnimatedButton";
import { useSession } from "../../context/SessionContext";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { COPY } from "../../config/copy";
import { assets } from "../../config/assets";
import {
  createHomeIntroTimeline,
  startAmbientMotion,
  startEnergyPulses,
} from "../../animations/homeAnimations";
import "./HomeScreen.css";

gsap.registerPlugin(useGSAP);

export default function HomeScreen() {
  const { startExperience } = useSession();
  const reducedMotion = useReducedMotion();

  const containerRef = useRef(null);
  const backgroundRef = useRef(null);
  const crowdRef = useRef(null);
  const frameRef = useRef(null);
  const bottleRef = useRef(null);
  const badgeRef = useRef(null);
  const logoRef = useRef(null);
  const campaignRef = useRef(null);
  const headlineRef = useRef(null);
  const descriptionRef = useRef(null);
  const buttonRef = useRef(null);
  const taglinesRef = useRef(null);

  useGSAP(
    () => {
      const refs = {
        background: backgroundRef,
        crowd: crowdRef,
        frame: frameRef,
        bottle: bottleRef,
        badge: badgeRef,
        logo: logoRef,
        campaign: campaignRef,
        headline: headlineRef,
        description: descriptionRef,
        button: buttonRef,
        taglines: taglinesRef,
      };

      const introTl = createHomeIntroTimeline(refs, { reducedMotion });
      let stopAmbientMotion = () => {};
      let stopEnergyPulses = () => {};

      introTl.eventCallback("onComplete", () => {
        stopAmbientMotion = startAmbientMotion(refs, { reducedMotion });
        stopEnergyPulses = startEnergyPulses(refs, { reducedMotion });
      });

      return () => {
        introTl.kill();
        stopAmbientMotion();
        stopEnergyPulses();
      };
    },
    { scope: containerRef, dependencies: [reducedMotion] },
  );

  return (
    <div className="home-screen" ref={containerRef}>
      <img
        className="home-screen__background"
        ref={backgroundRef}
        src={assets.home.background}
        alt=""
      />

      <img
        className="home-screen__crowd"
        ref={crowdRef}
        src={assets.home.crowd}
        alt=""
        aria-hidden="true"
      />

      <div className="home-screen__vignette" aria-hidden="true" />

      <div className="home-screen__frame" ref={frameRef} aria-hidden="true" />

      <div className="home-screen__bottle-wrapper">
        <BrandBottle ref={bottleRef} />
      </div>

      <div className="home-screen__content">
        <div className="home-screen__badge" ref={badgeRef}>
          <span className="home-screen__badge-number">{COPY.home.badge.number}</span>
          <span className="home-screen__badge-label">{COPY.home.badge.label}</span>
        </div>

        <div className="home-screen__copy">
          <BrandLogo ref={logoRef} className="home-screen__logo" />

          <div className="home-screen__campaign-frame">
            <img
              className="home-screen__campaign"
              ref={campaignRef}
              src={assets.home.campaignLockup}
              alt={COPY.home.campaignAlt}
            />
          </div>

          <h1 className="home-screen__headline" ref={headlineRef}>
            <span className="home-screen__headline-primary">{COPY.home.headline[0]}</span>
            <span className="home-screen__headline-secondary">{COPY.home.headline[1]}</span>
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
            <span className="home-screen__cta-chevron" aria-hidden="true">
              &gt;
            </span>
          </AnimatedButton>
        </div>
      </div>

      <div className="home-screen__taglines" ref={taglinesRef}>
        {COPY.home.taglines.map((tagline) => (
          <span key={tagline} className="home-screen__tagline">
            {tagline}
          </span>
        ))}
      </div>
    </div>
  );
}
