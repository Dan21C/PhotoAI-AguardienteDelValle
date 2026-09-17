import { useLayoutEffect, useRef, useState } from "react";
import { STAGE } from "../../config/appConfig";
import "./TabletStage.css";

// Mantiene una composición horizontal 16:9 fija (1920x1080), escalada
// proporcionalmente al espacio disponible sin deformar ni recortar,
// sin scroll y sin elementos saliéndose de la pantalla.
export default function TabletStage({ children }) {
  const wrapperRef = useRef(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return undefined;

    const updateScale = () => {
      const { clientWidth, clientHeight } = wrapper;
      if (!clientWidth || !clientHeight) return;

      const nextScale = Math.min(
        clientWidth / STAGE.WIDTH,
        clientHeight / STAGE.HEIGHT,
      );

      setScale(nextScale);
    };

    updateScale();

    const resizeObserver = new ResizeObserver(updateScale);
    resizeObserver.observe(wrapper);

    return () => resizeObserver.disconnect();
  }, []);

  return (
    <div className="tablet-stage-wrapper" ref={wrapperRef}>
      <div
        className="tablet-stage"
        style={{
          width: `${STAGE.WIDTH}px`,
          height: `${STAGE.HEIGHT}px`,
          transform: `scale(${scale})`,
        }}
      >
        {children}
      </div>
    </div>
  );
}
