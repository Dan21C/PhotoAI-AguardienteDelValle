// Iconos placeholder simples (SVG inline, sin librería) hasta recibir el
// set de iconos oficial de marca. Ver docs/ASSETS_TODO.md.
const PATHS = {
  camera: (
    <>
      <path d="M8 7l1.5-2h5L16 7h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1h3z" />
      <circle cx="12" cy="13" r="3.5" />
    </>
  ),
  location: (
    <>
      <path d="M12 21s-6.5-6.1-6.5-11A6.5 6.5 0 0 1 18.5 10c0 4.9-6.5 11-6.5 11z" />
      <circle cx="12" cy="10" r="2.2" />
    </>
  ),
  spark: (
    <path d="M12 3l1.8 5.6L19.5 10l-5.7 1.4L12 17l-1.8-5.6L4.5 10l5.7-1.4L12 3z" />
  ),
  qr: (
    <>
      <rect x="4" y="4" width="6" height="6" rx="1" />
      <rect x="14" y="4" width="6" height="6" rx="1" />
      <rect x="4" y="14" width="6" height="6" rx="1" />
      <rect x="14" y="14" width="2.5" height="2.5" />
      <rect x="17.5" y="14" width="2.5" height="2.5" />
      <rect x="14" y="17.5" width="2.5" height="2.5" />
      <rect x="17.5" y="17.5" width="2.5" height="2.5" />
    </>
  ),
  share: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="4.5" />
      <circle cx="12" cy="12" r="3.6" />
      <circle cx="16.3" cy="7.7" r="0.9" fill="currentColor" stroke="none" />
    </>
  ),
};

export default function InstructionIcon({ type, className = "" }) {
  const content = PATHS[type];
  if (!content) return null;

  return (
    <svg
      className={`instruction-icon ${className}`.trim()}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {content}
    </svg>
  );
}
