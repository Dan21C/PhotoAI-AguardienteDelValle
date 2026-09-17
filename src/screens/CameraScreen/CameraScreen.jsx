import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import BrandLogo from "../../components/BrandLogo/BrandLogo";
import CaptureButton from "../../components/CaptureButton/CaptureButton";
import AnimatedButton from "../../components/AnimatedButton/AnimatedButton";
import { useSession } from "../../context/SessionContext";
import { useCamera } from "../../hooks/useCamera";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { COPY } from "../../config/copy";
import { CAMERA_CONFIG } from "../../config/appConfig";
import {
  createCameraIntroTimeline,
  animateCountdownDigit,
  playCaptureFlash,
} from "../../animations/cameraAnimations";
import "./CameraScreen.css";

gsap.registerPlugin(useGSAP);

// Mapea el código normalizado de useCamera a copy amigable (sin strings
// técnicos del navegador en pantalla).
const ERROR_COPY = {
  "permission-denied": { title: COPY.camera.permissionDenied, hint: COPY.camera.permissionDeniedHint },
  "not-found": { title: COPY.camera.notFound, hint: COPY.camera.notFoundHint },
  "not-readable": { title: COPY.camera.notReadable, hint: COPY.camera.notReadableHint },
  overconstrained: { title: COPY.camera.genericError, hint: COPY.camera.genericErrorHint },
  unknown: { title: COPY.camera.genericError, hint: COPY.camera.genericErrorHint },
};

export default function CameraScreen() {
  const { capturePhoto, setCameraReady } = useSession();
  const reducedMotion = useReducedMotion();
  const { videoRef, videoReady, loading, errorCode, startCamera, captureFrame } = useCamera();

  const containerRef = useRef(null);
  const backgroundRef = useRef(null);
  const brandingRef = useRef(null);
  const previewFrameRef = useRef(null);
  const controlsRef = useRef(null);
  const countdownRef = useRef(null);
  const flashRef = useRef(null);
  const countdownTimeoutRef = useRef(null);

  const [countdownValue, setCountdownValue] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);

  // Auto-request al entrar a la pantalla. Si el navegador bloquea el intento
  // automático (permission-denied), el botón de error hace de fallback con
  // gesto real del usuario (ver ERROR_COPY / render de abajo).
  useEffect(() => {
    startCamera();
  }, [startCamera]);

  useEffect(() => {
    setCameraReady(videoReady);
  }, [videoReady, setCameraReady]);

  useEffect(() => () => setCameraReady(false), [setCameraReady]);

  useEffect(() => () => clearTimeout(countdownTimeoutRef.current), []);

  useGSAP(
    () => {
      const refs = { background: backgroundRef, branding: brandingRef, previewFrame: previewFrameRef, controls: controlsRef };
      const tl = createCameraIntroTimeline(refs, { reducedMotion });
      return () => tl.kill();
    },
    { scope: containerRef, dependencies: [reducedMotion] },
  );

  useEffect(() => {
    if (countdownValue == null) return undefined;
    const tween = animateCountdownDigit(countdownRef.current, { reducedMotion });
    return () => tween?.kill();
  }, [countdownValue, reducedMotion]);

  const runFlashAndCapture = useCallback(async () => {
    const [, photo] = await Promise.all([playCaptureFlash(flashRef), captureFrame()]);

    setIsCapturing(false);

    if (!photo) return;

    if (typeof navigator.vibrate === "function") {
      try {
        navigator.vibrate(50);
      } catch {
        // vibración no soportada/permitida: ignorar, es un extra opcional.
      }
    }

    capturePhoto(photo);
  }, [captureFrame, capturePhoto]);

  const handleCaptureClick = useCallback(() => {
    if (!videoReady || countdownValue !== null || isCapturing) return;

    setIsCapturing(true);

    let remaining = CAMERA_CONFIG.countdownSeconds;
    setCountdownValue(remaining);

    const tick = () => {
      remaining -= 1;
      if (remaining <= 0) {
        setCountdownValue(null);
        runFlashAndCapture();
        return;
      }
      setCountdownValue(remaining);
      countdownTimeoutRef.current = setTimeout(tick, 1000);
    };

    countdownTimeoutRef.current = setTimeout(tick, 1000);
  }, [videoReady, countdownValue, isCapturing, runFlashAndCapture]);

  const errorInfo = errorCode ? ERROR_COPY[errorCode] ?? ERROR_COPY.unknown : null;
  const showingVideo = !errorInfo;
  const statusText = loading ? COPY.camera.activating : COPY.camera.requesting;

  return (
    <div className="camera-screen" ref={containerRef}>
      <div className="camera-screen__background" ref={backgroundRef} />

      <header className="camera-screen__header" ref={brandingRef}>
        <BrandLogo className="camera-screen__logo" />
        <p className="camera-screen__subtitle">{COPY.camera.subtitle}</p>
      </header>

      <div className="camera-screen__stage">
        <div className="camera-screen__preview-frame" ref={previewFrameRef}>
          {showingVideo ? (
            <>
              <video
                ref={videoRef}
                className={`camera-screen__video${CAMERA_CONFIG.mirrorPreview ? " camera-screen__video--mirrored" : ""}`}
                autoPlay
                playsInline
                muted
              />
              <div className="camera-screen__guide" aria-hidden="true" />

              {!videoReady && (
                <div className="camera-screen__status">{statusText}</div>
              )}

              {countdownValue !== null && (
                <div className="camera-screen__countdown" ref={countdownRef}>
                  {countdownValue}
                </div>
              )}

              <div className="camera-screen__flash" ref={flashRef} aria-hidden="true" />
            </>
          ) : (
            <div className="camera-screen__error">
              <p className="camera-screen__error-title">{errorInfo.title}</p>
              <p className="camera-screen__error-hint">{errorInfo.hint}</p>
            </div>
          )}
        </div>
      </div>

      <footer className="camera-screen__controls" ref={controlsRef}>
        {errorInfo ? (
          <AnimatedButton onClick={startCamera}>
            {errorCode === "permission-denied" ? COPY.camera.activateCta : COPY.camera.retryCta}
          </AnimatedButton>
        ) : (
          <CaptureButton
            onClick={handleCaptureClick}
            disabled={!videoReady || countdownValue !== null || isCapturing}
            aria-label={COPY.camera.captureCta}
          />
        )}
      </footer>
    </div>
  );
}
