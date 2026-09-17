import { useCallback, useEffect, useRef, useState } from "react";
import { CAMERA_CONFIG } from "../config/appConfig";

// Mapea errores reales de getUserMedia a códigos estables que la UI puede
// traducir a copy amigable (ver COPY.camera). Nunca se exponen mensajes
// técnicos del navegador al usuario.
function mapErrorToCode(error) {
  switch (error?.name) {
    case "NotAllowedError":
    case "SecurityError":
      return "permission-denied";
    case "NotFoundError":
    case "DevicesNotFoundError":
      return "not-found";
    case "NotReadableError":
    case "TrackStartError":
      return "not-readable";
    case "OverconstrainedError":
    case "ConstraintNotSatisfiedError":
      return "overconstrained";
    default:
      return "unknown";
  }
}

// Encapsula getUserMedia/MediaStream. No conoce SessionContext ni copy:
// solo hardware/browser media. CameraScreen conecta esto con la sesión.
export function useCamera() {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const startingRef = useRef(false);
  const capturingRef = useRef(false);
  const isMountedRef = useRef(true);

  const [videoReady, setVideoReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorCode, setErrorCode] = useState(null);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;

    if (videoRef.current) {
      videoRef.current.onloadedmetadata = null;
      videoRef.current.srcObject = null;
    }

    if (isMountedRef.current) setVideoReady(false);
  }, []);

  const startCamera = useCallback(async () => {
    if (startingRef.current || streamRef.current) return;
    startingRef.current = true;

    if (isMountedRef.current) {
      setErrorCode(null);
      setLoading(true);
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia(CAMERA_CONFIG.constraints);

      if (!isMountedRef.current) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }

      streamRef.current = stream;

      const video = videoRef.current;
      if (video) {
        video.srcObject = stream;
        video.onloadedmetadata = () => {
          if (!isMountedRef.current) return;
          if (video.videoWidth > 0 && video.videoHeight > 0) {
            setVideoReady(true);
          }
        };
        await video.play().catch(() => {});
      }

      if (isMountedRef.current) setLoading(false);
    } catch (error) {
      if (isMountedRef.current) {
        setErrorCode(mapErrorToCode(error));
        setLoading(false);
      }
    } finally {
      startingRef.current = false;
    }
  }, []);

  const captureFrame = useCallback(() => {
    const video = videoRef.current;

    if (
      capturingRef.current ||
      !video ||
      video.videoWidth === 0 ||
      video.videoHeight === 0
    ) {
      return Promise.resolve(null);
    }

    capturingRef.current = true;

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    // drawImage lee los frames decodificados del video, sin aplicar el
    // transform CSS (mirror) usado solo para el preview en pantalla: la
    // captura sale sin espejar de forma natural (CAMERA_CONFIG.mirrorCapture).
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          capturingRef.current = false;

          if (!blob || !isMountedRef.current) {
            resolve(null);
            return;
          }

          resolve({
            blob,
            url: URL.createObjectURL(blob),
            width: canvas.width,
            height: canvas.height,
            mimeType: "image/jpeg",
            capturedAt: Date.now(),
          });
        },
        "image/jpeg",
        CAMERA_CONFIG.jpegQuality,
      );
    });
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      stopCamera();
    };
  }, [stopCamera]);

  return {
    videoRef,
    videoReady,
    loading,
    errorCode,
    startCamera,
    stopCamera,
    captureFrame,
  };
}
