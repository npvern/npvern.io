import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { projects } from "@/content/site";
import { ProjectPreview } from "@/components/project-preview";
import { StatusLabel, T, Tags } from "@/components/bits";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = projects.find((x) => x.slug === slug);
  return p ? { title: `${p.name} | Vern Prayoonthong`, description: p.tagline } : {};
}

export default async function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const i = projects.findIndex((x) => x.slug === slug);
  if (i < 0) notFound();
  const p = projects[i];
  const next = projects[(i + 1) % projects.length];

  const sections = [
    { id: "problem", title: "Problem", items: p.story.problem },
    { id: "approach", title: "Approach", items: p.story.approach },
    { id: "results", title: "Results", items: p.story.results },
  ];

  return (
    <article className="mx-auto max-w-[1320px] px-4 pb-24 pt-10 md:px-8 md:pt-14">
      <Link href="/projects" className="group inline-flex items-center gap-2 font-mono text-meta text-ink-muted hover:text-ink">
        <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" aria-hidden />
        All projects
      </Link>

      <header className="mt-10 max-w-[52rem]">
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-meta">
          <span className="text-signal">{String(i + 1).padStart(2, "0")}</span>
          <span>{p.dates}</span>
          <span className="h-px w-8 bg-rule" aria-hidden />
          <StatusLabel status={p.status} />
        </p>
        <h1 className="display mt-5 text-h1">{p.name}</h1>
        <p className="mt-5 font-mono text-[1rem] text-ink-muted">{p.tagline}</p>
      </header>

      <div className="mt-12 max-w-[960px]">
        <ProjectPreview project={p} index={i} priority />
      </div>

      <div className="mt-16 grid gap-14 lg:grid-cols-12 lg:gap-12">
        <aside className="lg:col-span-4">
          <dl className="sheet grid grid-cols-[auto_1fr] gap-x-6 gap-y-4 p-6 font-mono text-meta lg:sticky lg:top-24">
            <span className="reg" aria-hidden />
            <dt className="text-ink-muted">Role</dt>
            <dd>
              <T value={p.role} />
            </dd>
            <dt className="text-ink-muted">Dates</dt>
            <dd>{p.dates}</dd>
            <dt className="text-ink-muted">Status</dt>
            <dd>
              <StatusLabel status={p.status} />
            </dd>
            <dt className="text-ink-muted">Result</dt>
            <dd>
              <span className="text-signal">{p.metric.value}</span> {p.metric.label}
            </dd>
            <dt className="col-span-2 text-ink-muted">Stack</dt>
            <dd className="col-span-2 -mt-2">
              <Tags items={p.stack} />
            </dd>
            {p.links.length > 0 && (
              <>
                <dt className="text-ink-muted">Links</dt>
                <dd className="space-y-1">
                  {p.links.map((l) => (
                    <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="ink-link flex items-center gap-1">
                      {l.label} <ArrowUpRight size={12} aria-hidden />
                    </a>
                  ))}
                </dd>
              </>
            )}
          </dl>
        </aside>

        <div className="space-y-14 lg:col-span-8">
          <p className="max-w-[62ch] text-lede">{p.summary}</p>
          {sections.map((s) => (
            <section key={s.id} aria-labelledby={s.id}>
              <h2 id={s.id} className="display text-h3">
                {s.title}
              </h2>
              <ul className="mt-5 max-w-[64ch] space-y-3">
                {s.items.map((it, k) => (
                  <li key={k} className="grid grid-cols-[1.5rem_1fr]">
                    <span aria-hidden className="font-mono text-signal">
                      +
                    </span>
                    <span>
                      <T value={it} />
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>

      <nav aria-label="Next project" className="mt-24 border-t border-rule pt-8">
        <Link href={`/projects/${next.slug}`} className="group flex items-end justify-between gap-6">
          <span>
            <span className="block font-mono text-meta text-ink-muted">Next project</span>
            <span className="display mt-2 block text-h2 group-hover:text-signal">{next.name}</span>
          </span>
          <ArrowRight size={32} className="mb-2 shrink-0 text-signal transition-transform group-hover:translate-x-2" aria-hidden />
        </Link>
      </nav>
    </article>
  );
}
