"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useState } from "react";

type Mode = "default" | "link" | "crosshair" | "drag";

/**
 * Dot inside a ring. Mouse only: never mounts on touch devices or with reduced motion.
 * Over a drawing (data-cursor="crosshair") it becomes a drafting crosshair; over a
 * swipeable gallery (data-cursor="drag") the ring stretches sideways.
 */
export function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [mode, setMode] = useState<Mode>("default");
  const [visible, setVisible] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const rx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.4 });
  const ry = useSpring(y, { stiffness: 500, damping: 40, mass: 0.4 });

  useEffect(() => {
    const mq = matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    const apply = () => {
      setEnabled(mq.matches);
      document.documentElement.classList.toggle("has-cursor", mq.matches);
    };
    apply();
    mq.addEventListener("change", apply);
    return () => {
      mq.removeEventListener("change", apply);
      document.documentElement.classList.remove("has-cursor");
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
      const t = e.target as Element | null;
      if (t?.closest("[data-cursor='crosshair']")) setMode("crosshair");
      else if (t?.closest("a, button, [role='option'], input, label")) setMode("link");
      else if (t?.closest("[data-cursor='drag']")) setMode("drag");
      else setMode("default");
    };
    const leave = () => setVisible(false);
    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  const ringSize = mode === "link" ? 44 : mode === "crosshair" ? 0 : 30;
  const ringWidth = mode === "drag" ? 58 : ringSize;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[80]" style={{ opacity: visible ? 1 : 0 }}>
      <motion.div
        className="absolute left-0 top-0 rounded-full border border-ink/70"
        style={{ x: rx, y: ry, translateX: "-50%", translateY: "-50%" }}
        animate={{ width: ringWidth, height: ringSize, opacity: mode === "crosshair" ? 0 : 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 26 }}
      />
      <motion.div className="absolute left-0 top-0" style={{ x, y }}>
        {mode === "crosshair" ? (
          <>
            <span className="absolute left-[-14px] top-0 h-px w-[28px] bg-signal" />
            <span className="absolute left-0 top-[-14px] h-[28px] w-px bg-signal" />
          </>
        ) : (
          <span className="absolute left-[-3px] top-[-3px] h-[6px] w-[6px] rounded-full bg-signal" />
        )}
      </motion.div>
    </div>
  );
}
