import { ROUTES } from "@/data/site";

const norm = (p) => (p.endsWith("/") ? p : `${p}/`);

// Map a pathname to its route key, so the language switch can jump to the
// same page in the other language.
export function routeKeyFor(pathname) {
  const p = norm(pathname || "/");
  return Object.keys(ROUTES).find((k) => ROUTES[k].nl === p || ROUTES[k].en === p) || "home";
}

export const localeFor = (pathname) => (norm(pathname || "/").startsWith("/en/") ? "en" : "nl");
