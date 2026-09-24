// Static-export image loader. Images are pre-resized at build-asset time into
// /images/<name>-<width>.webp (see README). Next asks for a width; we return the
// smallest pre-built size that covers it, capped at the largest we have.
const WIDTHS = [480, 828, 1200, 1920, 2560];
const MAX = { hero: 1200, residential: 1920, commercial: 1920, industrial: 1920, special: 1920 };

export default function imageLoader({ src, width }) {
  const m = src.match(/^\/images\/([a-z-]+)\.webp$/);
  if (!m) return src;
  const name = m[1];
  const cap = MAX[name] || 2560;
  const w = WIDTHS.find((x) => x >= width && x <= cap) || Math.min(cap, WIDTHS[WIDTHS.length - 1]);
  return `/images/${name}-${w}.webp`;
}
