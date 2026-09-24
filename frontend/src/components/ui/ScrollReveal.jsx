"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Minimal scroll reveal: headings, text, cards, list items and images fade up
// as they enter the viewport. Only elements below the fold are touched, so
// nothing on screen at load ever blinks; siblings in a grid are staggered.
// After the animation the attribute is removed so hover transitions (card-fx)
// behave normally again. Disabled for prefers-reduced-motion.
const SELECTOR = [
  "main section h2",
  "main section h2 + p",
  "main section .h-section ~ p",
  "main section ul.grid > li",
  "main section ol.grid > li",
  "main section ul.space-y-5 > li",
  "main section .space-y-14 > div",
  "main section table",
  "main section details",
  "main section .relative.aspect-\\[4\\/3\\]",
  "main section .relative.aspect-\\[16\\/10\\]",
  "main section .card-fx",
  "main article section",
].join(",");

export default function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!("IntersectionObserver" in window)) return;

    const fold = window.innerHeight * 0.92;
    const seen = new Set();
    const targets = [];
    document.querySelectorAll(SELECTOR).forEach((el) => {
      if (seen.has(el) || el.closest("[data-reveal]") || el.closest("#aanbieden, form")) return;
      if (el.getBoundingClientRect().top < fold) return;
      seen.add(el);
      const parent = el.parentElement;
      const index = parent ? [...parent.children].indexOf(el) : 0;
      const stagger = el.matches("li, .card-fx") ? (index % 4) * 80 : 0;
      el.style.transitionDelay = `${stagger}ms`;
      el.setAttribute("data-reveal", "");
      targets.push(el);
    });

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const el = e.target;
          el.classList.add("is-in");
          io.unobserve(el);
          const delay = parseInt(el.style.transitionDelay, 10) || 0;
          window.setTimeout(() => {
            el.removeAttribute("data-reveal");
            el.classList.remove("is-in");
            el.style.transitionDelay = "";
          }, 800 + delay);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );
    targets.forEach((el) => io.observe(el));

    return () => {
      io.disconnect();
      targets.forEach((el) => {
        el.removeAttribute("data-reveal");
        el.classList.remove("is-in");
        el.style.transitionDelay = "";
      });
    };
  }, [pathname]);

  return null;
}
