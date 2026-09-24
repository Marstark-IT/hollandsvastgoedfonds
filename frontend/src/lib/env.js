// Public build-time settings. Set these as GitHub Actions variables (or in
// frontend/.env.local) and rebuild; empty values switch the feature off.
export const GTM_ID = (process.env.NEXT_PUBLIC_GTM_ID || "").trim();
