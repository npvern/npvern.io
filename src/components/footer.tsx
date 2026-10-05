import { site } from "@/content/site";

export function Footer() {
  return (
    <footer className="border-t border-rule">
      <div className="mx-auto flex max-w-[1320px] flex-col gap-2 px-4 py-8 font-mono text-[0.75rem] text-ink-muted sm:flex-row sm:items-center sm:justify-between md:px-8">
        <p>
          {site.legalName}, {new Date().getFullYear()}
        </p>
        <p>
          Press <kbd className="rounded-full border border-rule px-1.5">Ctrl K</kbd> to search
        </p>
      </div>
    </footer>
  );
}
