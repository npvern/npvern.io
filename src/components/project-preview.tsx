"use client";

import Image from "next/image";
import { animate, motion, useMotionValue, useReducedMotion, type AnimationPlaybackControls } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { CaretLeft, CaretRight, ImageSquare, Play, Plus } from "@phosphor-icons/react";
import type { GalleryItem, Project } from "@/content/site";
import { SprocketDrawing } from "./sprocket-drawing";

/**
 * YouTube embed behind a click-to-play poster: nothing from YouTube loads until the visitor
 * presses play, which keeps the page fast. Leaving the slide (active = false) stops playback.
 */
function VideoSlot({ item, active }: { item: Extract<GalleryItem, { kind: "video" }>; active: boolean }) {
  const [playing, setPlaying] = useState(false);
  const [wasActive, setWasActive] = useState(active);
  if (active !== wasActive) {
    setWasActive(active);
    if (!active) setPlaying(false);
  }
  if (playing) {
    return (
      <iframe
        className="absolute inset-0 h-full w-full bg-ink"
        src={`https://www.youtube-nocookie.com/embed/${item.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
        title={item.title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    );
  }
  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      aria-label={`Play ${item.title}`}
      tabIndex={active ? 0 : -1}
      className="group/play absolute inset-0 block bg-ink"
    >
      <Image
        src={`https://i.ytimg.com/vi/${item.youtubeId}/maxresdefault.jpg`}
        alt=""
        fill
        sizes="(min-width: 1024px) 720px, 100vw"
        draggable={false}
        className="select-none object-cover opacity-90 transition-opacity group-hover/play:opacity-100"
      />
      <span className="absolute left-1/2 top-1/2 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-signal text-signal-ink shadow-[0_8px_24px_-8px_rgb(0_0_0/0.5)] transition-transform group-hover/play:scale-105 group-active/play:scale-95">
        <Play size={26} weight="fill" aria-hidden />
      </span>
    </button>
  );
}

function Slot({ item, main, priority, active = false }: { item: GalleryItem; main: boolean; priority?: boolean; active?: boolean }) {
  if (item.kind === "video") {
    if (main) return <VideoSlot item={item} active={active} />;
    return (
      <>
        <Image
          src={`https://i.ytimg.com/vi/${item.youtubeId}/hqdefault.jpg`}
          alt=""
          fill
          sizes="120px"
          draggable={false}
          className="select-none object-cover"
        />
        <span className="absolute inset-0 grid place-items-center">
          <span className="grid h-6 w-6 place-items-center rounded-full bg-signal text-signal-ink">
            <Play size={11} weight="fill" aria-hidden />
          </span>
        </span>
      </>
    );
  }
  if (item.kind === "sprocket") {
    return (
      <div className={`absolute inset-0 ${main ? "p-2" : "p-0.5"}`}>
        <SprocketDrawing />
      </div>
    );
  }
  if (item.kind === "placeholder") {
    return main ? (
      <div className="absolute inset-3 flex flex-col items-center justify-center gap-3 border border-dashed border-blueprint/60 bg-blueprint-wash p-6 text-center">
        <ImageSquare size={28} className="text-blueprint" aria-hidden />
        <p className="font-mono text-meta text-blueprint">Placeholder: image needed</p>
        <p className="max-w-[28ch] font-mono text-[0.75rem] text-ink-muted">{item.caption}</p>
      </div>
    ) : (
      <div className="absolute inset-0 grid place-items-center border border-dashed border-blueprint/60 bg-blueprint-wash">
        <Plus size={16} className="text-blueprint" aria-hidden />
      </div>
    );
  }
  const contain = item.fit === "contain";
  return (
    <Image
      src={item.src}
      alt={main ? item.alt : ""}
      fill
      sizes={main ? "(min-width: 1024px) 720px, 100vw" : "120px"}
      priority={priority}
      draggable={false}
      className={`select-none ${main && contain ? "object-contain" : "object-cover"}`}
      style={!main && item.thumbFocus ? { objectPosition: item.thumbFocus } : undefined}
    />
  );
}

/**
 * Project gallery: one main image plus a strip of smaller ones. The main frame is a slider:
 * the image strip follows a mouse drag, finger swipe, or sideways trackpad swipe 1:1, then snaps
 * to the nearest image. Arrows, thumbnails, and the arrow keys also move it; the arrows hide at the ends.
 * Framed as a drawing sheet (hardware) or an app window (software).
 */
export function ProjectPreview({ project, index, priority = false }: { project: Project; index: number; priority?: boolean }) {
  const [selected, setSelected] = useState(0);
  const reduce = useReducedMotion();
  const items = project.gallery;
  const n = items.length;
  const many = n > 1;
  const current = items[selected];
  const fig = `${String(index + 1).padStart(2, "0")}.${selected + 1}`;

  const frame = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0); // strip offset in px; image i is in view at x = -i * width
  const width = useRef(0);
  const sel = useRef(0);
  const anim = useRef<AnimationPlaybackControls | null>(null);

  /** Snap the strip to image i (clamped) and make it the selected one. */
  const settle = useCallback(
    (i: number) => {
      const target = Math.max(0, Math.min(n - 1, i));
      sel.current = target;
      setSelected(target);
      anim.current?.stop();
      const to = -target * width.current;
      if (reduce) x.jump(to);
      else anim.current = animate(x, to, { type: "spring", stiffness: 380, damping: 40, mass: 0.9 });
    },
    [n, reduce, x],
  );
  /** Arrows and keys stop at the first and last image (settle clamps). */
  const step = useCallback((d: 1 | -1) => settle(sel.current + d), [settle]);

  // At either end the arrow pointing past it disappears. If that arrow had keyboard focus,
  // hand focus to the arrow that remains so keyboard users are not dropped to the page.
  const prevBtn = useRef<HTMLButtonElement>(null);
  const nextBtn = useRef<HTMLButtonElement>(null);
  const refocus = useRef<"prev" | "next" | null>(null);
  const clickArrow = (d: 1 | -1) => {
    const target = Math.max(0, Math.min(n - 1, sel.current + d));
    const focused = document.activeElement === (d === 1 ? nextBtn.current : prevBtn.current);
    if (focused && (target === 0 || target === n - 1)) refocus.current = d === 1 ? "prev" : "next";
    step(d);
  };
  useEffect(() => {
    if (!refocus.current) return;
    (refocus.current === "prev" ? prevBtn : nextBtn).current?.focus();
    refocus.current = null;
  }, [selected]);

  /** Past the first or last image the strip resists, like a rubber band. */
  const rubber = useCallback(
    (v: number) => {
      const min = -(n - 1) * width.current;
      if (v > 0) return v * 0.25;
      if (v < min) return min + (v - min) * 0.25;
      return v;
    },
    [n],
  );

  // Keep the strip aligned when the frame resizes.
  useEffect(() => {
    const el = frame.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      width.current = el.clientWidth;
      anim.current?.stop();
      x.jump(-sel.current * width.current);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [x]);

  // Trackpad: a light sideways two-finger swipe is enough. The strip leans with the fingers, and once
  // the swipe passes a small threshold it commits and glides the rest of the way on its own. One image
  // per swipe. After a commit the touchpad keeps sending fading momentum events; those are ignored, but
  // a new push (events growing again, or reversing direction) starts the next swipe straight away, so
  // swipes can be chained without waiting for the momentum to die out. Vertical wheel scrolls the page.
  useEffect(() => {
    const el = frame.current;
    if (!el || !many) return;
    const COMMIT_PX = 35; // raw trackpad travel that counts as a deliberate swipe
    const LEAN = 1.6; // how far the strip leans per px of travel before committing
    let startIndex = 0;
    let acc = 0;
    let active = false;
    let fired = false;
    let firedDir = 0;
    let firedAt = 0;
    let peak = 0; // strongest event since the commit
    let trough = Infinity; // weakest event after that peak: momentum only ever fades
    let idle: ReturnType<typeof setTimeout> | undefined;
    const begin = () => {
      active = true;
      fired = false;
      acc = 0;
      startIndex = sel.current;
    };
    const end = () => {
      if (!fired) settle(startIndex); // a swipe too small to commit springs back
      active = false;
      fired = false;
    };
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY) || !width.current) return;
      e.preventDefault(); // stops the browser's swipe-to-go-back while over the gallery
      e.stopPropagation(); // and keeps Lenis from scrolling the page on the swipe's small vertical wobble
      clearTimeout(idle);
      idle = setTimeout(end, 180);
      // Pixel-mode deltas from touchpads; line-mode (mouse tilt wheels) gets scaled to pixels.
      const d = e.deltaMode === 1 ? e.deltaX * 16 : e.deltaX;
      const mag = Math.abs(d);
      if (!active) begin();
      else if (fired) {
        const settled = e.timeStamp - firedAt > 120; // the jitter of the committing swipe has passed
        const reversed = settled && Math.sign(d) !== firedDir && mag > 2;
        const pushedAgain = settled && trough < peak * 0.35 && mag > Math.max(trough * 3, 6);
        if (reversed || pushedAgain) begin();
        else {
          peak = Math.max(peak, mag);
          if (mag < peak) trough = Math.min(trough, mag);
          return; // still the fading momentum of the swipe that already committed
        }
      }
      acc += d;
      if (Math.abs(acc) >= COMMIT_PX) {
        fired = true;
        firedDir = Math.sign(acc);
        firedAt = e.timeStamp;
        peak = mag;
        trough = Infinity;
        settle(startIndex + firedDir);
        return;
      }
      // Lean with the fingers, unless the previous swipe's glide is still running; then let it finish.
      if (!x.isAnimating()) x.set(rubber(-startIndex * width.current - acc * LEAN));
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      el.removeEventListener("wheel", onWheel);
      clearTimeout(idle);
    };
  }, [many, settle, rubber, x]);

  // Mouse drag or finger swipe: the strip follows the pointer, then snaps by distance or flick speed.
  type Drag = { id: number; x0: number; y0: number; base: number; axis: "x" | "y" | null; lastX: number; lastT: number; v: number };
  const drag = useRef<Drag | null>(null);
  // A swipe may start on an arrow button; after a real drag, swallow that button's click.
  const swallowClick = useRef(false);
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!many || e.button !== 0) return;
    anim.current?.stop();
    drag.current = { id: e.pointerId, x0: e.clientX, y0: e.clientY, base: x.get(), axis: null, lastX: e.clientX, lastT: e.timeStamp, v: 0 };
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    const dx = e.clientX - d.x0;
    const dy = e.clientY - d.y0;
    if (!d.axis) {
      if (Math.hypot(dx, dy) < 6) return;
      d.axis = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
      if (d.axis === "y") {
        drag.current = null; // a vertical move is a page scroll, not a swipe
        settle(sel.current);
        return;
      }
      e.currentTarget.setPointerCapture(e.pointerId); // keep tracking even if the pointer leaves the frame
    }
    const dt = e.timeStamp - d.lastT;
    if (dt > 0) d.v = (e.clientX - d.lastX) / dt;
    d.lastX = e.clientX;
    d.lastT = e.timeStamp;
    x.set(rubber(d.base + dx));
  };
  const onPointerEnd = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    drag.current = null;
    if (d.axis !== "x") {
      settle(sel.current);
      return;
    }
    swallowClick.current = true;
    setTimeout(() => (swallowClick.current = false), 0);
    const dx = e.clientX - d.x0;
    const w = width.current;
    const start = Math.round(-d.base / w);
    // Speed only counts if the pointer was still moving at release; a pause then release is not a flick.
    const v = e.timeStamp - d.lastT < 80 ? d.v : 0;
    // A quick flick, or a drag past 10% of the frame, moves one image; otherwise it springs back.
    if (dx < -w * 0.1 || v < -0.3) settle(start + 1);
    else if (dx > w * 0.1 || v > 0.3) settle(start - 1);
    else settle(start);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!many) return;
    if (e.key === "ArrowRight") {
      e.preventDefault();
      step(1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      step(-1);
    }
  };

  const arrow =
    "absolute top-1/2 z-[1] grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-rule/70 bg-surface/55 text-ink backdrop-blur-sm transition-[opacity,background-color] duration-200 hover:bg-surface/85 focus-visible:opacity-100 opacity-0 group-hover/frame:opacity-100 [@media(hover:none)]:opacity-70";

  const main = (
    <div
      ref={frame}
      data-cursor={many ? "drag" : undefined}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerEnd}
      onPointerCancel={onPointerEnd}
      onClickCapture={(e) => {
        if (swallowClick.current) {
          e.preventDefault();
          e.stopPropagation();
        }
      }}
      className={`group/frame relative touch-pan-y select-none overflow-hidden ${
        !many && items[0].kind === "video" ? "aspect-video" : project.frame === "window" ? "aspect-[16/10]" : "aspect-[4/3]"
      }`}
    >
      <motion.div className="flex h-full" style={{ x }}>
        {items.map((it, i) => (
          <div key={i} className="relative h-full w-full shrink-0" aria-hidden={i !== selected}>
            <Slot item={it} main priority={priority && i === 0} active={i === selected} />
          </div>
        ))}
      </motion.div>
      {many && selected > 0 && (
        <button ref={prevBtn} type="button" onClick={() => clickArrow(-1)} aria-label="Previous image" className={`${arrow} left-3`}>
          <CaretLeft size={18} weight="bold" aria-hidden />
        </button>
      )}
      {many && selected < n - 1 && (
        <button ref={nextBtn} type="button" onClick={() => clickArrow(1)} aria-label="Next image" className={`${arrow} right-3`}>
          <CaretRight size={18} weight="bold" aria-hidden />
        </button>
      )}
    </div>
  );

  const thumbs = items.length > 1 && (
    <ul className="grid grid-cols-4 gap-2 border-t border-rule p-2 sm:grid-cols-6" aria-label={`${project.name} images`}>
      {items.map((it, i) => (
        <li key={i}>
          <button
            type="button"
            onClick={() => settle(i)}
            aria-pressed={i === selected}
            aria-label={`Show image ${i + 1}: ${it.caption}`}
            className={`relative block aspect-[4/3] w-full overflow-hidden border bg-surface transition-[border-color,opacity] ${
              i === selected ? "border-signal" : "border-rule opacity-70 hover:border-ink-muted hover:opacity-100"
            }`}
          >
            <Slot item={it} main={false} />
          </button>
        </li>
      ))}
    </ul>
  );

  const caption = (
    <figcaption className="grid grid-cols-[auto_1fr] gap-3 border-t border-rule px-3 py-2 font-mono text-[0.75rem] text-ink-muted">
      <span className="text-blueprint">FIG. {fig}</span>
      <span aria-live="polite">{current.kind === "placeholder" ? `Placeholder: ${current.caption}` : current.caption}</span>
    </figcaption>
  );

  if (project.frame === "window") {
    return (
      <figure className="sheet" onKeyDown={onKeyDown}>
        <span className="reg" aria-hidden />
        <div className="flex h-9 items-center gap-2 border-b border-rule px-3">
          <span className="h-2.5 w-2.5 rounded-full bg-[#e5655a]" aria-hidden />
          <span className="h-2.5 w-2.5 rounded-full bg-[#e9b949]" aria-hidden />
          <span className="h-2.5 w-2.5 rounded-full bg-[#5fb565]" aria-hidden />
          <span className="ml-3 font-mono text-[0.75rem] text-ink-muted">{project.slug}.py</span>
        </div>
        {main}
        {thumbs}
        {caption}
      </figure>
    );
  }

  return (
    <figure className="sheet" onKeyDown={onKeyDown}>
      <span className="reg" aria-hidden />
      {main}
      {thumbs}
      {caption}
      <div className="grid grid-cols-[1fr_auto] border-t border-rule font-mono text-[0.75rem] text-ink-muted">
        <span className="truncate px-3 py-2 uppercase text-ink">{project.name}</span>
        <span className="border-l border-rule px-3 py-2">REV {project.year}</span>
      </div>
    </figure>
  );
}
