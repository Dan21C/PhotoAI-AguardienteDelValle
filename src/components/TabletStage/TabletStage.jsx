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
      {/* Centrado vía position:absolute + márgenes negativos fijos (no
          flexbox): combinar `display:flex` con `transform:scale()` en el
          hijo produjo un centrado vertical intermitente en Chromium
          (a veces top:0, a veces top:-156px con el mismo scale, mismo
          layout). Este patrón evita esa condición de carrera. */}
      <div
        className="tablet-stage"
        style={{
          width: `${STAGE.WIDTH}px`,
          height: `${STAGE.HEIGHT}px`,
          marginLeft: `${-STAGE.WIDTH / 2}px`,
          marginTop: `${-STAGE.HEIGHT / 2}px`,
          transform: `scale(${scale})`,
        }}
      >
        {children}
      </div>
    </div>
  );
}
