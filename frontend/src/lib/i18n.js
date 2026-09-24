import { ROUTES } from "@/data/site";

const norm = (p) => (p.endsWith("/") ? p : `${p}/`);

// Map a pathname to its route key, so the language switch can jump to the
// same page in the other language. Article and city pages map to their hub.
export function routeKeyFor(pathname) {
  const p = norm(pathname || "/");
  if (p.startsWith("/kennisbank/")) return "kennisbank";
  if (p.startsWith("/regios/")) return "regions";
  return Object.keys(ROUTES).find((k) => ROUTES[k].nl === p || ROUTES[k].en === p) || "home";
}

// Target of the language switch: same page if it exists, else the home page.
export const switchTarget = (key, other) => ROUTES[key][other] || ROUTES.home[other];

export const localeFor = (pathname) => (norm(pathname || "/").startsWith("/en/") ? "en" : "nl");
