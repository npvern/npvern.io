import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { projects } from "@/content/site";
import { ProjectPreview } from "./project-preview";
import { Reveal } from "./reveal";
import { StatusLabel, Tags } from "./bits";

export function Projects() {
  return (
    <section id="projects" aria-labelledby="projects-title" className="mx-auto max-w-[1320px] px-4 py-20 md:px-8 md:py-28">
      <header className="max-w-[44rem]">
        <p className="flex items-center gap-3 font-mono text-meta text-ink-muted">
          <span className="h-px w-10 bg-rule" aria-hidden />
          Projects
        </p>
        <h1 id="projects-title" className="display mt-5 text-h2">
          Parts I designed, built, and tested.
        </h1>
        <p className="mt-5 max-w-[60ch] text-lede text-ink-muted">
          Each one went from a model to a physical prototype. Open any project for the full story.
        </p>
      </header>

      <ol className="mt-16 space-y-24 md:mt-24 md:space-y-32">
        {projects.map((p, i) => {
          const flip = i % 2 === 1;
          return (
            <li key={p.slug}>
              <Reveal className="grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
                <div className={`lg:col-span-7 ${flip ? "lg:order-2 lg:col-start-6" : ""}`}>
                  <ProjectPreview project={p} index={i} />
                </div>

                <div className={`lg:col-span-5 ${flip ? "lg:order-1 lg:col-start-1 lg:row-start-1" : ""}`}>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-meta">
                    <span className="text-signal">{String(i + 1).padStart(2, "0")}</span>
                    <span className="text-ink">{p.year}</span>
                    <span className="h-px w-8 bg-rule" aria-hidden />
                    <StatusLabel status={p.status} />
                  </div>

                  <h2 className="display mt-4 text-[clamp(1.9rem,1.4rem+1.6vw,2.6rem)] leading-[1.05]">
                    <Link href={`/projects/${p.slug}`} className="hover:text-signal">
                      {p.name}
                    </Link>
                  </h2>
                  <p className="mt-3 font-mono text-[0.9rem] text-ink-muted">{p.tagline}</p>
                  <p className="mt-5 max-w-[56ch]">{p.summary}</p>

                  <dl className="mt-6 flex items-baseline gap-4 border-l-2 border-signal pl-4">
                    <dt className="sr-only">Key result</dt>
                    <dd className="display shrink-0 text-[1.6rem] leading-none text-ink">{p.metric.value}</dd>
                    <dd className="font-mono text-meta text-ink-muted">{p.metric.label}</dd>
                  </dl>

                  <Tags items={p.stack} className="mt-6" />

                  <Link
                    href={`/projects/${p.slug}`}
                    className="group mt-8 inline-flex items-center gap-2 font-mono text-[0.9rem] font-medium"
                  >
                    <span className="ink-link">Read the full story</span>
                    <span className="sr-only">: {p.name}</span>
                    <ArrowRight size={15} className="text-signal transition-transform group-hover:translate-x-1" aria-hidden />
                  </Link>
                </div>
              </Reveal>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
