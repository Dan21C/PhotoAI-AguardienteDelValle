import { createContext, useCallback, useContext, useMemo, useReducer } from "react";
import { SCREENS } from "../config/appConfig";

const initialState = {
  currentScreen: SCREENS.HOME,
  originalPhoto: null,
  selectedLocation: null,
  generatedPhoto: null,
  finalPhoto: null,
  downloadUrl: null,
  qrValue: null,
  isProcessing: false,
  cameraReady: false,
};

const ACTIONS = {
  START_EXPERIENCE: "START_EXPERIENCE",
  COMPLETE_INSTRUCTIONS: "COMPLETE_INSTRUCTIONS",
  CAPTURE_PHOTO: "CAPTURE_PHOTO",
  RETAKE_PHOTO: "RETAKE_PHOTO",
  CONFIRM_PHOTO: "CONFIRM_PHOTO",
  SELECT_LOCATION: "SELECT_LOCATION",
  START_GENERATION: "START_GENERATION",
  SET_GENERATED_PHOTO: "SET_GENERATED_PHOTO",
  CONFIRM_RESULT: "CONFIRM_RESULT",
  SET_QR: "SET_QR",
  FINISH_EXPERIENCE: "FINISH_EXPERIENCE",
  RESET_SESSION: "RESET_SESSION",
  SET_CAMERA_READY: "SET_CAMERA_READY",
};

function sessionReducer(state, action) {
  switch (action.type) {
    case ACTIONS.START_EXPERIENCE:
      return { ...state, currentScreen: SCREENS.INSTRUCTIONS };

    case ACTIONS.COMPLETE_INSTRUCTIONS:
      return { ...state, currentScreen: SCREENS.CAMERA };

    case ACTIONS.SET_CAMERA_READY:
      return { ...state, cameraReady: action.payload };

    case ACTIONS.CAPTURE_PHOTO:
      return {
        ...state,
        originalPhoto: action.payload,
        currentScreen: SCREENS.PHOTO_REVIEW,
      };

    case ACTIONS.RETAKE_PHOTO:
      return {
        ...state,
        originalPhoto: null,
        currentScreen: SCREENS.CAMERA,
      };

    case ACTIONS.CONFIRM_PHOTO:
      return { ...state, currentScreen: SCREENS.LOCATION };

    case ACTIONS.SELECT_LOCATION:
      return {
        ...state,
        selectedLocation: action.payload,
        currentScreen: SCREENS.PROCESSING,
      };

    case ACTIONS.START_GENERATION:
      return { ...state, isProcessing: true };

    case ACTIONS.SET_GENERATED_PHOTO:
      return {
        ...state,
        generatedPhoto: action.payload,
        isProcessing: false,
        currentScreen: SCREENS.RESULT,
      };

    case ACTIONS.CONFIRM_RESULT:
      return {
        ...state,
        finalPhoto: action.payload,
        currentScreen: SCREENS.QR,
      };

    case ACTIONS.SET_QR:
      return {
        ...state,
        qrValue: action.payload.qrValue,
        downloadUrl: action.payload.downloadUrl,
      };

    case ACTIONS.FINISH_EXPERIENCE:
      return { ...state, currentScreen: SCREENS.THANK_YOU };

    case ACTIONS.RESET_SESSION:
      return { ...initialState };

    default:
      return state;
  }
}

const SessionContext = createContext(null);

export function SessionProvider({ children }) {
  const [state, dispatch] = useReducer(sessionReducer, initialState);

  const startExperience = useCallback(
    () => dispatch({ type: ACTIONS.START_EXPERIENCE }),
    [],
  );

  const completeInstructions = useCallback(
    () => dispatch({ type: ACTIONS.COMPLETE_INSTRUCTIONS }),
    [],
  );

  const setCameraReady = useCallback(
    (ready) => dispatch({ type: ACTIONS.SET_CAMERA_READY, payload: ready }),
    [],
  );

  const capturePhoto = useCallback(
    (photo) => dispatch({ type: ACTIONS.CAPTURE_PHOTO, payload: photo }),
    [],
  );

  const retakePhoto = useCallback(
    () => dispatch({ type: ACTIONS.RETAKE_PHOTO }),
    [],
  );

  const confirmPhoto = useCallback(
    () => dispatch({ type: ACTIONS.CONFIRM_PHOTO }),
    [],
  );

  const selectLocation = useCallback(
    (location) => dispatch({ type: ACTIONS.SELECT_LOCATION, payload: location }),
    [],
  );

  const startGeneration = useCallback(
    () => dispatch({ type: ACTIONS.START_GENERATION }),
    [],
  );

  const setGeneratedPhoto = useCallback(
    (photo) => dispatch({ type: ACTIONS.SET_GENERATED_PHOTO, payload: photo }),
    [],
  );

  const confirmResult = useCallback(
    (finalPhoto) => dispatch({ type: ACTIONS.CONFIRM_RESULT, payload: finalPhoto }),
    [],
  );

  const setQR = useCallback(
    (qrValue, downloadUrl) =>
      dispatch({ type: ACTIONS.SET_QR, payload: { qrValue, downloadUrl } }),
    [],
  );

  const finishExperience = useCallback(
    () => dispatch({ type: ACTIONS.FINISH_EXPERIENCE }),
    [],
  );

  const resetSession = useCallback(
    () => dispatch({ type: ACTIONS.RESET_SESSION }),
    [],
  );

  const value = useMemo(
    () => ({
      ...state,
      startExperience,
      completeInstructions,
      setCameraReady,
      capturePhoto,
      retakePhoto,
      confirmPhoto,
      selectLocation,
      startGeneration,
      setGeneratedPhoto,
      confirmResult,
      setQR,
      finishExperience,
      resetSession,
    }),
    [
      state,
      startExperience,
      completeInstructions,
      setCameraReady,
      capturePhoto,
      retakePhoto,
      confirmPhoto,
      selectLocation,
      startGeneration,
      setGeneratedPhoto,
      confirmResult,
      setQR,
      finishExperience,
      resetSession,
    ],
  );

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession debe usarse dentro de <SessionProvider>");
  }
  return context;
}
