"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { beacon, captureAttribution, pushEvent } from "@/lib/tracking";

// Runs on every route change: attribution capture, first-party pageview,
// dataLayer page_view for GTM. Also tracks email link clicks site-wide.
export default function Analytics() {
  const pathname = usePathname();

  useEffect(() => {
    captureAttribution();
    beacon("pageview");
    pushEvent("page_view_spa", { page_path: pathname, page_location: window.location.href });
  }, [pathname]);

  useEffect(() => {
    const onClick = (e) => {
      const a = e.target.closest?.("a[href^='mailto:']");
      if (a) {
        pushEvent("email_click");
        beacon("email_click");
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
