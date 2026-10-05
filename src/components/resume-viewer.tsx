"use client";

import Image from "next/image";
import { useSyncExternalStore } from "react";
import { site } from "@/content/site";

/**
 * Shows the real PDF where the browser has a built-in PDF viewer (desktop Chrome, Edge,
 * Firefox, Safari). Elsewhere, mostly phones, it shows a pre-rendered image of the page
 * (public/resume.png, from scripts/render-resume.py) that opens the PDF when tapped.
 */
export function ResumeViewer() {
  const inlinePdf = useSyncExternalStore(
    () => () => {},
    () => navigator.pdfViewerEnabled === true,
    () => false,
  );

  if (inlinePdf) {
    return (
      <iframe
        // Shaped like a letter page plus the viewer's toolbar, so the whole page shows at full
        // width with nothing to scroll inside the frame; the wheel then scrolls the page itself.
        src={`${site.resume}#toolbar=1&view=FitH`}
        title={`${site.legalName} résumé`}
        className="block aspect-[8.5/11.35] w-full bg-surface"
      />
    );
  }

  return (
    <a href={site.resume} target="_blank" rel="noopener noreferrer" className="block" aria-label="Open the résumé PDF">
      <Image
        src="/resume.png"
        alt={`${site.legalName} résumé, page 1`}
        width={1700}
        height={2200}
        sizes="(min-width: 1024px) 900px, 100vw"
        priority
        className="h-auto w-full"
      />
    </a>
  );
}
