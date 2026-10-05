"use client";

import { ReactLenis, useLenis } from "lenis/react";
import type { LenisOptions } from "lenis";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/*
  Sections land below the sticky nav via `scroll-padding-top` in globals.css.
  Lenis reads that value itself, so scrollTo needs no extra offset.
*/

const options: LenisOptions = {
  autoRaf: true,
  lerp: 0.1,
  // Same-page hash links (#projects) glide to their section.
  anchors: true,
  // A click that leaves the page kills leftover momentum.
  stopInertiaOnNavigate: true,
  // Smoothing is skipped and scrollTo jumps instantly for prefers-reduced-motion (Lenis default, stated here on purpose).
  respectReducedMotion: true,
};

/**
 * Lenis smooth scroll for the whole page.
 * - Same-path hash links: we cancel the browser jump and Next's Link navigation;
 *   Lenis' own `anchors` handler then runs the smooth scroll.
 * - Route changes: start at the top, or glide to the hash when arriving at "/#section".
 */
let navigating = false;
/** Call right before a client-side route change so the current page's scroll position is kept. */
export function freezeScrollMemory() {
  navigating = true;
}

function RouteSync() {
  const lenis = useLenis();
  const pathname = usePathname();
  const fromHistory = useRef(false);
  const firstRun = useRef(true);
  // Last scroll position per page, so back/forward returns exactly where you were.
  const positions = useRef(new Map<string, number>());
  const current = useRef(pathname);

  useLenis((l) => {
    // While a navigation is in flight the old page's scroll gets clamped by the new, shorter page; ignore it.
    if (!navigating) positions.current.set(current.current, l.scroll);
  });

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest("a");
      if (!a || !a.href || a.target === "_blank") return;
      const url = new URL(a.href);
      if (url.origin !== location.origin) return;
      if (url.pathname !== location.pathname) {
        freezeScrollMemory();
        return;
      }
      if (!url.hash) return;
      e.preventDefault();
      if (location.hash !== url.hash) history.pushState(null, "", url.hash);
      // The browser would move focus on a native jump; keep that for keyboard and screen reader users.
      const target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
      if (target) {
        if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
        target.focus({ preventScroll: true });
      }
    };
    // Back/forward restores the saved position instead of resetting to the top.
    const onPop = () => {
      freezeScrollMemory();
      fromHistory.current = true;
    };
    // Capture phase, so this runs before Next's Link and before Lenis' bubble listener.
    document.addEventListener("click", onClick, true);
    window.addEventListener("popstate", onPop);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("popstate", onPop);
    };
  }, []);

  useEffect(() => {
    if (!lenis) return;
    current.current = pathname;
    navigating = false;
    const first = firstRun.current;
    firstRun.current = false;
    if (fromHistory.current) {
      fromHistory.current = false;
      const saved = positions.current.get(pathname);
      if (saved !== undefined) {
        // Lenis still holds the previous page's height; re-measure so the target is not clamped.
        requestAnimationFrame(() => {
          lenis.resize();
          lenis.scrollTo(saved, { immediate: true, force: true });
        });
      }
      return;
    }
    const hash = window.location.hash;
    if (hash && document.querySelector(hash)) {
      lenis.resize();
      lenis.scrollTo(hash, { force: true });
    } else if (!first) {
      lenis.scrollTo(0, { immediate: true, force: true });
    }
  }, [lenis, pathname]);

  return null;
}

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis root options={options}>
      <RouteSync />
      {children}
    </ReactLenis>
  );
}
