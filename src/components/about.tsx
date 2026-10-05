import { coursework, site, skills, todo } from "@/content/site";
import { T } from "./bits";

export function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="mx-auto max-w-[1320px] px-4 py-20 md:px-8 md:py-28">
      <div className="grid gap-14 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-6">
          <h1 id="about-title" className="display text-h2">
            About
          </h1>
          <div className="mt-6 max-w-[60ch] space-y-5 text-lede text-ink-muted">
            <p>
              I&apos;m {site.legalName.replace(" Prayoonthong", "")}, a mechanical engineering student at Carnegie Mellon
              with a minor in robotics, graduating in May 2028.
            </p>
            <p>
              On CMU Lunabotics I lead the mobility subteam, where I design drivetrain parts and then machine them myself.
              Before that I interned at NSTDA in Bangkok, building a computer vision system that detects and counts objects.
            </p>
            <p className="text-body">
              <T value={todo("One or two sentences in your own words: what kind of problems you want to work on")} />
            </p>
          </div>

          <dl className="mt-10 grid max-w-[34rem] grid-cols-[auto_1fr] gap-x-6 gap-y-2 font-mono text-meta">
            <dt className="text-ink-muted">School</dt>
            <dd>{site.school}</dd>
            <dt className="text-ink-muted">Degree</dt>
            <dd>{site.degree}</dd>
            <dt className="text-ink-muted">Graduation</dt>
            <dd>{site.graduation}</dd>
            <dt className="text-ink-muted">Based in</dt>
            <dd>{site.location}</dd>
          </dl>
        </div>

        <div className="lg:col-span-6 lg:pt-3">
          <div className="sheet grid sm:grid-cols-2">
            <span className="reg" aria-hidden />
            {skills.map((g, i) => (
              <div
                key={g.area}
                className={`p-6 ${i % 2 === 1 ? "sm:border-l sm:border-rule" : ""} ${i > 1 ? "border-t border-rule" : i === 1 ? "border-t border-rule sm:border-t-0" : ""}`}
              >
                <h2 className="font-mono text-meta text-blueprint">{g.area}</h2>
                <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
                  {g.items.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="mt-5 max-w-[60ch] font-mono text-meta text-ink-muted">
            Coursework: {coursework.join(", ")}.
          </p>
        </div>
      </div>

    </section>
  );
}
