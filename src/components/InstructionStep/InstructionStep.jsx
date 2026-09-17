import { forwardRef } from "react";
import InstructionIcon from "../InstructionIcon/InstructionIcon";
import { COPY } from "../../config/copy";
import "./InstructionStep.css";

// Resalta el handle de campaña dentro de una descripción sin acoplar el
// componente a un string fijo: solo divide sobre COPY.handle.
function renderDescription(description) {
  if (!description.includes(COPY.handle)) return description;

  const [before, after] = description.split(COPY.handle);
  return (
    <>
      {before}
      <strong className="instruction-step__handle">{COPY.handle}</strong>
      {after}
    </>
  );
}

const InstructionStep = forwardRef(function InstructionStep(
  { index, icon, title, description, className = "" },
  ref,
) {
  const number = String(index + 1).padStart(2, "0");

  return (
    <li ref={ref} className={`instruction-step ${className}`.trim()}>
      <span className="instruction-step__number">{number}</span>

      <span className="instruction-step__icon-badge">
        <InstructionIcon type={icon} className="instruction-step__icon" />
      </span>

      <h3 className="instruction-step__title">{title}</h3>

      {description && (
        <p className="instruction-step__description">{renderDescription(description)}</p>
      )}
    </li>
  );
});

export default InstructionStep;
