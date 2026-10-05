import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { projects, type Project } from "@/content/site";
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
          From CAD and the machine shop to computer vision. Open any project for the full story.
        </p>
      </header>

      <ol className="mt-16 space-y-24 md:mt-24 md:space-y-32">
        {projects.map((p, i) => {
          const flip = i % 2 === 1;
          return (
            <li key={p.slug}>
              {p.gallery.length > 0 ? (
                <Reveal className="grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
                  <div className={`lg:col-span-7 ${flip ? "lg:order-2 lg:col-start-6" : ""}`}>
                    <ProjectPreview project={p} index={i} />
                  </div>
                  <div className={`lg:col-span-5 ${flip ? "lg:order-1 lg:col-start-1 lg:row-start-1" : ""}`}>
                    <ProjectText p={p} i={i} />
                  </div>
                </Reveal>
              ) : (
                <Reveal>
                  <TextOnlyProject p={p} i={i} />
                </Reveal>
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function ProjectMeta({ p, i }: { p: Project; i: number }) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-meta">
      <span className="text-signal">{String(i + 1).padStart(2, "0")}</span>
      <span className="text-ink">{p.year}</span>
      <span className="h-px w-8 bg-rule" aria-hidden />
      <StatusLabel status={p.status} />
    </div>
  );
}

function Metric({ p }: { p: Project }) {
  return (
    <dl className="flex items-baseline gap-4 border-l-2 border-signal pl-4">
      <dt className="sr-only">Key result</dt>
      <dd className="display shrink-0 text-[1.6rem] leading-none text-ink">{p.metric.value}</dd>
      <dd className="font-mono text-meta text-ink-muted">{p.metric.label}</dd>
    </dl>
  );
}

function StoryLink({ p }: { p: Project }) {
  return (
    <Link href={`/projects/${p.slug}`} className="group inline-flex items-center gap-2 font-mono text-[0.9rem] font-medium">
      <span className="ink-link">Read the full story</span>
      <span className="sr-only">: {p.name}</span>
      <ArrowRight size={15} className="text-signal transition-transform group-hover:translate-x-1" aria-hidden />
    </Link>
  );
}

function ProjectTitle({ p }: { p: Project }) {
  return (
    <h2 className="display mt-4 text-[clamp(1.9rem,1.4rem+1.6vw,2.6rem)] leading-[1.05]">
      <Link href={`/projects/${p.slug}`} className="hover:text-signal">
        {p.name}
      </Link>
    </h2>
  );
}

/** Text column beside a project's gallery. */
function ProjectText({ p, i }: { p: Project; i: number }) {
  return (
    <>
      <ProjectMeta p={p} i={i} />
      <ProjectTitle p={p} />
      <p className="mt-3 font-mono text-[0.9rem] text-ink-muted">{p.tagline}</p>
      <p className="mt-5 max-w-[56ch]">{p.summary}</p>
      <div className="mt-6">
        <Metric p={p} />
      </div>
      <Tags items={p.stack} className="mt-6" />
      <div className="mt-8">
        <StoryLink p={p} />
      </div>
    </>
  );
}

/** A project with no images: one drawing-sheet card, story on the left, specs on the right. */
function TextOnlyProject({ p, i }: { p: Project; i: number }) {
  return (
    <article className="sheet grid lg:grid-cols-12">
      <span className="reg" aria-hidden />
      <div className="p-6 md:p-10 lg:col-span-7">
        <ProjectMeta p={p} i={i} />
        <ProjectTitle p={p} />
        <p className="mt-3 font-mono text-[0.9rem] text-ink-muted">{p.tagline}</p>
        <p className="mt-5 max-w-[60ch]">{p.summary}</p>
      </div>
      <div className="flex flex-col gap-6 border-t border-rule p-6 md:p-10 lg:col-span-5 lg:border-l lg:border-t-0">
        <Metric p={p} />
        <Tags items={p.stack} />
        <div className="mt-auto pt-2">
          <StoryLink p={p} />
        </div>
      </div>
    </article>
  );
}
