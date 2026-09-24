// Mark: a Dutch stepped gable (trapgevel) with an H cut out of the facade and one
// accent window. Wordmark set in the site font. `light` is for dark backgrounds.
export function LogoMark({ className = "h-10 w-auto", light = false }) {
  const body = light ? "#FFFFFF" : "#0F3B5F";
  return (
    <svg viewBox="0 0 40 48" className={className} aria-hidden="true">
      <path
        fill={body}
        fillRule="evenodd"
        d="M2 43V24h6v-9h6V6h12v9h6v9h6v19H2Zm10-17v14h5v-5h6v5h5V26h-5v5h-6v-5h-5Z"
      />
      <rect x="2" y="45" width="36" height="3" fill="#C75B0B" />
    </svg>
  );
}

export default function Logo({ light = false, className = "" }) {
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <LogoMark light={light} className="h-11 w-auto shrink-0" />
      <span className={`flex flex-col leading-none ${light ? "text-white" : "text-brand"}`}>
        <span className="text-[1.3rem] font-extrabold tracking-tight">Hollands</span>
        <span className="mt-1 text-[0.78rem] font-semibold uppercase tracking-[0.2em] opacity-80">
          Vastgoedfonds
        </span>
      </span>
    </span>
  );
}
