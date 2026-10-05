import Link from "next/link";
import { ArrowRight, ArrowUpRight, EnvelopeSimple, FileText, LinkedinLogo } from "@phosphor-icons/react/dist/ssr";
import { site } from "@/content/site";
import { CopyEmail } from "./copy-email";

export function Contact() {
  return (
    <section aria-labelledby="contact-title" className="mx-auto max-w-[1320px] px-4 py-20 md:px-8 md:py-28">
      <h1 id="contact-title" className="display text-h2">
        Contact
      </h1>
      <p className="mt-5 max-w-[60ch] text-lede text-ink-muted">
        I&apos;m looking for mechanical and robotics internships.
      </p>

      <div className="sheet mt-12 md:mt-16">
        <span className="reg" aria-hidden />
        <div className="p-6 md:p-10">
          <p className="flex items-center gap-2 font-mono text-meta text-blueprint">
            <EnvelopeSimple size={15} aria-hidden /> Email
          </p>
          <a
            href={`mailto:${site.email}`}
            className="display mt-3 block break-all text-[clamp(1.8rem,1rem+3.6vw,3.6rem)] leading-none hover:text-signal"
          >
            {site.email}
          </a>
          <div className="mt-8">
            <CopyEmail />
          </div>
        </div>

        <ul className="grid border-t border-rule font-mono text-[0.95rem] sm:grid-cols-2">
          <li>
            <a
              href={site.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 p-6 hover:bg-signal-wash md:px-10"
            >
              <LinkedinLogo size={20} className="text-blueprint" aria-hidden />
              <span>
                <span className="block text-meta text-ink-muted">LinkedIn</span>
                <span className="ink-link">linkedin.com/in/npvern</span>
              </span>
              <ArrowUpRight size={15} className="ml-auto text-ink-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
            </a>
          </li>
          <li className="border-t border-rule sm:border-l sm:border-t-0">
            <Link href="/resume" className="group flex items-center gap-3 p-6 hover:bg-signal-wash md:px-10">
              <FileText size={20} className="text-blueprint" aria-hidden />
              <span>
                <span className="block text-meta text-ink-muted">Résumé</span>
                <span className="ink-link">View or download</span>
              </span>
              <ArrowRight size={15} className="ml-auto text-ink-muted transition-transform group-hover:translate-x-0.5" aria-hidden />
            </Link>
          </li>
        </ul>
      </div>
    </section>
  );
}
