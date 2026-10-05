"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useSyncExternalStore } from "react";
import { useLenis } from "lenis/react";
import { MagnifyingGlass, List } from "@phosphor-icons/react";
import { site } from "@/content/site";
import { openPalette } from "./command-palette";

const pages = [
  { href: "/projects", n: "01", label: "Projects" },
  { href: "/work", n: "02", label: "Work" },
  { href: "/about", n: "03", label: "About" },
];

export function Nav() {
  const pathname = usePathname();
  const isMac = useSyncExternalStore(
    () => () => {},
    () => /Mac|iPhone|iPad/.test(navigator.platform),
    () => false,
  );
  // Scroll position as a hairline under the nav, written straight to the DOM on each Lenis frame.
  const progress = useRef<HTMLSpanElement>(null);
  useLenis((lenis) => {
    if (progress.current) progress.current.style.transform = `scaleX(${lenis.progress || 0})`;
  });
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);
  const onContact = isActive("/contact");

  return (
    <header className="sticky top-0 z-40 border-b border-rule/70 bg-base/85 backdrop-blur-md">
      <nav aria-label="Primary" className="mx-auto flex h-16 max-w-[1320px] items-center gap-6 px-4 md:px-8">
        <Link
          href="/"
          aria-current={pathname === "/" ? "page" : undefined}
          className="font-mono text-[0.9rem] font-medium tracking-tight"
        >
          vern<span className="text-signal">.</span>prayoonthong
        </Link>

        <ul className="ml-10 hidden items-center gap-8 lg:flex">
          {pages.map((pg) => {
            const on = isActive(pg.href);
            return (
              <li key={pg.href}>
                <Link
                  href={pg.href}
                  aria-current={on ? "page" : undefined}
                  className={`relative font-mono text-meta transition-colors ${
                    on ? "text-ink" : "text-ink-muted hover:text-ink"
                  }`}
                >
                  <span className={on ? "text-signal" : ""}>{pg.n}</span> {pg.label}
                  <span
                    aria-hidden
                    className={`absolute -bottom-[22px] left-0 h-[2px] bg-signal transition-[width] duration-300 ${
                      on ? "w-full" : "w-0"
                    }`}
                  />
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="ml-auto flex items-center gap-3 md:gap-5">
          <button
            type="button"
            onClick={openPalette}
            className="hidden h-10 w-56 items-center gap-2 border border-rule bg-surface/60 px-3 text-left font-mono text-meta text-ink-muted transition-colors hover:border-ink-muted md:flex"
          >
            <MagnifyingGlass size={15} weight="bold" aria-hidden />
            <span>Search</span>
            <kbd className="ml-auto rounded-full border border-rule px-2 py-[1px] text-[0.7rem]">
              {isMac ? "⌘" : "Ctrl"} K
            </kbd>
          </button>
          <a
            href={site.resume}
            target="_blank"
            rel="noopener noreferrer"
            className="ink-link hidden font-mono text-meta text-ink-muted hover:text-ink md:inline"
          >
            Résumé
          </a>
          <Link
            href="/contact"
            aria-current={onContact ? "page" : undefined}
            className={`hidden h-10 items-center border border-ink px-4 font-mono text-meta font-medium transition-colors hover:bg-ink hover:text-base active:translate-y-[1px] sm:flex ${
              onContact ? "bg-ink text-base" : ""
            }`}
          >
            Contact
          </Link>
          <button
            type="button"
            onClick={openPalette}
            className="flex h-10 items-center gap-2 border border-rule bg-surface/60 px-3 font-mono text-meta md:hidden"
          >
            <List size={16} weight="bold" aria-hidden />
            Menu
          </button>
        </div>
      </nav>
      <span
        ref={progress}
        aria-hidden
        className="absolute bottom-[-1px] left-0 h-px w-full origin-left bg-signal"
        style={{ transform: "scaleX(0)" }}
      />
    </header>
  );
}
