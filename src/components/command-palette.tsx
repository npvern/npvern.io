"use client";

import { Command } from "cmdk";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
  ArrowSquareOut,
  Copy,
  FileText,
  Hash,
  LinkedinLogo,
  CircleHalf,
  Wrench,
  Check,
} from "@phosphor-icons/react";
import { useLenis } from "lenis/react";
import { freezeScrollMemory } from "./smooth-scroll";
import { projects, site } from "@/content/site";

const OPEN_EVENT = "palette:open";
export const openPalette = () => window.dispatchEvent(new Event(OPEN_EVENT));

function currentTheme(): "light" | "dark" {
  const set = document.documentElement.dataset.theme;
  if (set === "light" || set === "dark") return set;
  return matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const lenis = useLenis();

  // Freeze the page behind the open palette; resume when it closes.
  useEffect(() => {
    if (!lenis) return;
    if (open) lenis.stop();
    else lenis.start();
  }, [open, lenis]);

  const goTo = (href: string) => {
    if (href === pathname) return;
    freezeScrollMemory();
    router.push(href);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_EVENT, onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_EVENT, onOpen);
    };
  }, []);

  const run = useCallback((fn: () => void) => {
    setOpen(false);
    fn();
  }, []);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      window.location.href = `mailto:${site.email}`;
    }
  };

  const toggleTheme = () => {
    const next = currentTheme() === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {}
  };

  const item =
    "flex cursor-pointer items-center gap-3 px-3 py-2.5 text-[0.95rem] text-ink data-[selected=true]:bg-signal-wash data-[selected=true]:text-ink";
  const group =
    "[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:pb-1 [&_[cmdk-group-heading]]:pt-3 [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-[0.75rem] [&_[cmdk-group-heading]]:text-ink-muted";

  return (
    <Command.Dialog
      open={open}
      onOpenChange={setOpen}
      label="Command menu"
      overlayClassName="fixed inset-0 z-[60] bg-ink/25 backdrop-blur-[2px]"
      contentClassName="sheet fixed left-1/2 top-[12vh] z-[61] w-[min(600px,calc(100vw-32px))] -translate-x-1/2 shadow-[0_24px_60px_-20px_rgb(22_25_28/0.35)]"
    >
      <div className="flex items-center gap-2 border-b border-rule px-4">
        <span aria-hidden className="font-mono text-signal">
          &gt;
        </span>
        <Command.Input
          placeholder="Go to a page, open a project, copy email"
          className="h-14 w-full bg-transparent font-mono text-[0.95rem] text-ink outline-none placeholder:text-ink-muted focus-visible:outline-none"
        />
        <kbd className="rounded-full border border-rule px-2 font-mono text-[0.7rem] text-ink-muted">esc</kbd>
      </div>
      <Command.List data-lenis-prevent className="max-h-[min(60vh,420px)] overflow-y-auto overscroll-contain py-2">
        <Command.Empty className="px-4 py-6 font-mono text-meta text-ink-muted">
          No match. Try a project name, &quot;email&quot;, or &quot;résumé&quot;.
        </Command.Empty>

        <Command.Group heading="Pages" className={group}>
          {[
            ["", "Home", "/"],
            ["01", "Projects", "/projects"],
            ["02", "Work", "/work"],
            ["03", "About", "/about"],
            ["", "Résumé", "/resume"],
            ["", "Contact", "/contact"],
          ].map(([n, label, href]) => (
            <Command.Item key={href} value={`page ${label}`} className={item} onSelect={() => run(() => goTo(href))}>
              <Hash size={16} className="text-blueprint" aria-hidden />
              {label}
              {n && <span className="ml-auto font-mono text-[0.75rem] text-ink-muted">{n}</span>}
            </Command.Item>
          ))}
        </Command.Group>

        <Command.Group heading="Projects" className={group}>
          {projects.map((p) => (
            <Command.Item
              key={p.slug}
              value={`project ${p.name} ${p.stack.join(" ")}`}
              className={item}
              onSelect={() =>
                run(() => goTo(`/projects/${p.slug}`))
              }
            >
              <Wrench size={16} className="text-blueprint" aria-hidden />
              {p.name}
              <span className="ml-auto font-mono text-[0.75rem] text-ink-muted">{p.year}</span>
            </Command.Item>
          ))}
        </Command.Group>

        <Command.Group heading="Actions" className={group}>
          <Command.Item value="copy email address contact" className={item} onSelect={copyEmail}>
            {copied ? <Check size={16} className="text-signal" aria-hidden /> : <Copy size={16} className="text-blueprint" aria-hidden />}
            {copied ? "Email copied" : "Copy email"}
            <span className="ml-auto font-mono text-[0.75rem] text-ink-muted">{site.email}</span>
          </Command.Item>
          <Command.Item value="resume résumé pdf cv download" className={item} onSelect={() => run(() => window.open(site.resume, "_blank"))}>
            <FileText size={16} className="text-blueprint" aria-hidden />
            Open résumé PDF
            <ArrowSquareOut size={14} className="ml-auto text-ink-muted" aria-hidden />
          </Command.Item>
          <Command.Item value="linkedin profile" className={item} onSelect={() => run(() => window.open(site.linkedin, "_blank"))}>
            <LinkedinLogo size={16} className="text-blueprint" aria-hidden />
            LinkedIn
            <ArrowSquareOut size={14} className="ml-auto text-ink-muted" aria-hidden />
          </Command.Item>
          <Command.Item value="toggle theme dark light mode" className={item} onSelect={() => run(toggleTheme)}>
            <CircleHalf size={16} className="text-blueprint" aria-hidden />
            Switch light or dark theme
          </Command.Item>
        </Command.Group>
      </Command.List>
      <span aria-live="polite" className="sr-only">
        {copied ? "Email copied to clipboard" : ""}
      </span>
    </Command.Dialog>
  );
}
