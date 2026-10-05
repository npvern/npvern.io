"use client";

import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, EnvelopeSimple, LinkedinLogo } from "@phosphor-icons/react";
import { site } from "@/content/site";
import { TrackViewer } from "./track-viewer";

const ease = [0.16, 1, 0.3, 1] as const;

export function Hero() {
  const reduce = useReducedMotion();
  // Same initial markup on server and client; reduced motion only zeroes the duration.
  const rise = (i: number) => ({
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: reduce ? { duration: 0 } : { delay: 0.08 * i, duration: 0.7, ease },
  });

  return (
    <section
      aria-labelledby="hero-title"
      className="mx-auto grid max-w-[1320px] items-center gap-12 px-4 pb-16 pt-10 md:px-8 md:pt-16 lg:min-h-[calc(100dvh-4rem)] lg:grid-cols-12 lg:gap-8 lg:pb-20"
    >
      <div className="lg:col-span-6">
        <motion.p {...rise(0)} className="flex items-center gap-2.5 font-mono text-meta text-ink-muted">
          <span className="relative flex h-2 w-2" aria-hidden>
            <span className="absolute inset-0 animate-ping rounded-full bg-signal/50 motion-reduce:animate-none" />
            <span className="relative h-2 w-2 rounded-full bg-signal" />
          </span>
          {site.status}
        </motion.p>

        <motion.h1 {...rise(1)} id="hero-title" className="display mt-6 text-h1">
          <span className="block">
            Nattapat <span className="text-signal">(Vern)</span>
          </span>
          <span className="block">Prayoonthong</span>
        </motion.h1>

        <motion.p {...rise(2)} className="mt-6 max-w-[34rem] text-lede text-ink-muted">
          Mechanical engineering student at Carnegie Mellon, minor in robotics. I take parts from{" "}
          <span className="text-ink">CAD</span> through the <span className="text-ink">mill</span> to a{" "}
          <span className="text-signal">working assembly</span>.
        </motion.p>

        <motion.ul {...rise(3)} className="mt-8 space-y-3 font-mono text-[0.95rem]" aria-label="Contact">
          <li>
            <a href={`mailto:${site.email}`} className="group inline-flex items-center gap-3 text-ink hover:text-signal">
              <EnvelopeSimple size={18} className="text-blueprint" aria-hidden />
              <span className="ink-link">{site.email}</span>
            </a>
          </li>
          <li>
            <a
              href={site.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 text-ink hover:text-signal"
            >
              <LinkedinLogo size={18} className="text-blueprint" aria-hidden />
              <span className="ink-link">linkedin.com/in/npvern</span>
              <ArrowUpRight size={13} className="text-ink-muted" aria-hidden />
            </a>
          </li>
        </motion.ul>

        <motion.div {...rise(4)} className="mt-10">
          <Link
            href="/projects"
            className="group inline-flex h-12 items-center gap-3 bg-signal px-6 font-mono text-[0.9rem] font-medium text-signal-ink transition-transform active:translate-y-[1px]"
          >
            See my projects
            <ArrowRight size={16} weight="bold" className="transition-transform group-hover:translate-x-1" aria-hidden />
          </Link>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: reduce ? 0 : 0.6 }}
        className="mx-auto w-full max-w-[560px] lg:col-span-6 lg:col-start-7 lg:max-w-none lg:pl-8"
      >
        <figure className="sheet" data-cursor="crosshair">
          <span className="reg" aria-hidden />
          <div
            className="relative aspect-[5/4] w-full"
            role="img"
            aria-label="3D model of the CMU Lunabotics tracked mobility assembly, with the drive sprocket side plates highlighted. Drag to rotate."
          >
            <TrackViewer />
          </div>
          <figcaption className="grid grid-cols-[1fr_auto] border-t border-rule font-mono text-[0.75rem] text-ink-muted xl:grid-cols-[1fr_auto_auto]">
            <span className="px-3 py-2 text-ink">LUNABOTICS MOBILITY ASM</span>
            <span className="flex items-center gap-2 border-l border-rule px-3 py-2">
              <span className="h-[2px] w-4 bg-signal" aria-hidden />
              Drive sprocket mounts
            </span>
            <span className="hidden border-l border-rule px-3 py-2 xl:block">Drag to rotate</span>
          </figcaption>
        </figure>
      </motion.div>
    </section>
  );
}
