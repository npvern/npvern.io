import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { work } from "@/content/site";

/** Short display hash from the org name, so the log reads like `git log --oneline`. */
function shortHash(s: string) {
  let h = 2166136261;
  for (const c of s) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return (h >>> 0).toString(16).padStart(8, "0").slice(0, 7);
}

export function Work() {
  return (
    <section id="work" aria-labelledby="work-title" className="border-y border-rule bg-surface/70">
      <div className="mx-auto grid max-w-[1320px] gap-12 px-4 py-20 md:px-8 md:py-28 lg:grid-cols-12">
        <div className="self-start lg:sticky lg:top-28 lg:col-span-4">
          <h1 id="work-title" className="display text-h2">
            Work log
          </h1>
          <p className="mt-5 max-w-[36ch] text-ink-muted">
            Engineering roles, newest first. The full list is on my{" "}
            <Link href="/resume" className="ink-link text-ink">
              résumé
            </Link>
            .
          </p>
        </div>

        <ol className="relative lg:col-span-8">
          <span aria-hidden className="absolute bottom-2 left-[7px] top-2 w-px bg-rule" />
          {work.map((j) => (
            <li key={j.org} className="relative pb-14 pl-10 last:pb-0">
              <span
                aria-hidden
                className={`absolute left-0 top-[7px] h-[15px] w-[15px] rounded-full border-2 ${
                  j.current ? "border-signal bg-signal" : "border-blueprint bg-surface"
                }`}
              />
              <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-meta">
                <span className="text-blueprint">{shortHash(j.org)}</span>
                {j.current && (
                  <span className="rounded-full border border-signal px-2 text-[0.72rem] text-signal">HEAD</span>
                )}
                <span className="text-ink-muted">{j.dates}</span>
              </p>
              <h2 className="mt-2 text-[1.35rem] font-semibold leading-snug">
                {j.role}, <span className="text-ink-muted">{j.org}</span>
              </h2>
              <p className="font-mono text-meta text-ink-muted">{j.place}</p>
              <ul className="mt-4 max-w-[64ch] space-y-2">
                {j.points.map((pt) => (
                  <li key={pt} className="grid grid-cols-[1.25rem_1fr]">
                    <span aria-hidden className="font-mono text-signal">
                      +
                    </span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
              {j.link && (
                <a
                  href={j.link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-1.5 font-mono text-meta text-ink hover:text-signal"
                >
                  <span className="ink-link">{j.link.label}</span>
                  <ArrowUpRight size={13} aria-hidden />
                </a>
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
