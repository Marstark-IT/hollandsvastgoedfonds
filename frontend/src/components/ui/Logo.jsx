// Brand logo (ChatGPT-made artwork, background removed): navy version for light
// backgrounds, white version for the dark footer. Plain <img> with intrinsic
// size so it never shifts layout; files live in public/brand.
export default function Logo({ light = false, className = "h-11 w-auto sm:h-[54px]", priority = false }) {
  return (
    <img
      src={light ? "/brand/logo-white.png" : "/brand/logo-dark.png"}
      alt="Hollands Vastgoedfonds"
      width={600}
      height={188}
      className={className}
      decoding="async"
      {...(priority ? { fetchPriority: "high" } : { loading: "lazy" })}
    />
  );
}
