import type { Metadata } from "next";
import { ArrowUpRight, DownloadSimple } from "@phosphor-icons/react/dist/ssr";
import { site } from "@/content/site";
import { ResumeViewer } from "@/components/resume-viewer";

export const metadata: Metadata = {
  title: "Résumé | Vern Prayoonthong",
  description: "Résumé of Nattapat (Vern) Prayoonthong, mechanical engineering student at Carnegie Mellon.",
};

export default function ResumePage() {
  return (
    <section aria-labelledby="resume-title" className="mx-auto max-w-[1320px] px-4 py-16 md:px-8 md:py-24">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <h1 id="resume-title" className="display text-h2">
          Résumé
        </h1>
        <div className="flex flex-wrap gap-3 font-mono text-[0.9rem]">
          <a
            href={site.resume}
            download="NattapatVernPrayoonthong_Resume.pdf"
            className="inline-flex h-11 items-center gap-2 bg-signal px-4 font-medium text-signal-ink transition-transform active:translate-y-[1px]"
          >
            <DownloadSimple size={16} weight="bold" aria-hidden /> Download PDF
          </a>
          <a
            href={site.resume}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 items-center gap-2 border border-rule bg-surface px-4 hover:border-ink"
          >
            Open in new tab <ArrowUpRight size={13} aria-hidden />
          </a>
        </div>
      </div>

      <div className="sheet mx-auto mt-10 max-w-[960px] md:mt-12">
        <span className="reg" aria-hidden />
        <ResumeViewer />
      </div>
    </section>
  );
}
