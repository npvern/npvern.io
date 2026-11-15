import { coursework, site, skills } from "@/content/site";

export function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="mx-auto max-w-[1320px] px-4 py-20 md:px-8 md:py-28">
      <div className="grid gap-14 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-6">
          <p className="flex items-center gap-3 font-mono text-meta text-ink-muted">
            <span className="h-px w-10 bg-rule" aria-hidden />
            About
          </p>
          <h1 id="about-title" className="display mt-5 text-h2">
            I design parts, then build them to find out if they work.
          </h1>
          <div className="mt-8 max-w-[60ch] space-y-5 text-lede text-ink-muted">
            <p>
              I&apos;m Vern, a Mechanical Engineering student at Carnegie Mellon, minoring in Robotics. I like owning a part
              the whole way through: sketching the idea, modeling it, running the numbers, machining it, and bolting it into
              the assembly to see what breaks. On CMU Lunabotics, our drive sprocket went through four redesigns, each one
              easier to machine and assemble than the last.
            </p>
            <p>
              Most of what I know came from iterations like that. A part that fits in CAD doesn&apos;t always fit on the
              bench, and the fix is usually simpler than my first idea. I&apos;m most interested in mechanical design,
              robotics, and manufacturing, especially parts that are easy to build.
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
