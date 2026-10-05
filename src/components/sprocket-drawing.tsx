"use client";

import { motion, useReducedMotion } from "motion/react";
import { useId, useRef } from "react";

/*
  Front view of the Lunabotics drive sprocket, generated from the two known values:
  6 teeth, 5.40 in outside diameter. Tooth form and hub are schematic, not the
  manufacturing geometry, and the title block says so.
  Units: 1 in = 100 SVG units, origin at the sprocket center.
*/

const TEETH = 6;
const OD = 5.4;
const S = 100;
const RO = (OD / 2) * S; // tip radius
const RR = 1.98 * S; // root radius (schematic)
const TIP_HALF = 9; // degrees of land at each tooth tip
const ROOT_HALF = 13; // degrees of root arc between teeth

const rad = (d: number) => ((d - 90) * Math.PI) / 180;
const pt = (r: number, d: number) => [r * Math.cos(rad(d)), r * Math.sin(rad(d))] as const;
const f = (n: number) => n.toFixed(2);

function profilePath() {
  const pitch = 360 / TEETH;
  let d = "";
  for (let i = 0; i < TEETH; i++) {
    const c = i * pitch;
    const [ax, ay] = pt(RO, c - TIP_HALF);
    const [bx, by] = pt(RO, c + TIP_HALF);
    const rootStart = c + pitch / 2 - ROOT_HALF;
    const rootEnd = c + pitch / 2 + ROOT_HALF;
    const [cx1, cy1] = pt(RR + 0.42 * S, c + TIP_HALF + 4);
    const [rx1, ry1] = pt(RR, rootStart);
    const [rx2, ry2] = pt(RR, rootEnd);
    const nextTip = c + pitch - TIP_HALF;
    const [cx2, cy2] = pt(RR + 0.42 * S, nextTip - 4);
    const [nx, ny] = pt(RO, nextTip);
    if (i === 0) d += `M${f(ax)} ${f(ay)} `;
    d += `A${RO} ${RO} 0 0 1 ${f(bx)} ${f(by)} `;
    d += `Q${f(cx1)} ${f(cy1)} ${f(rx1)} ${f(ry1)} `;
    d += `A${RR} ${RR} 0 0 1 ${f(rx2)} ${f(ry2)} `;
    d += `Q${f(cx2)} ${f(cy2)} ${f(nx)} ${f(ny)} `;
  }
  return d + "Z";
}

const PROFILE = profilePath();

export function SprocketDrawing() {
  const reduce = useReducedMotion();
  const svgRef = useRef<SVGSVGElement>(null);
  const uid = useId();
  const readout = useRef<SVGTSpanElement>(null);

  // Same initial markup on server and client; reduced motion only zeroes the duration.
  const draw = (delay: number, duration = 1.4) => ({
    initial: { pathLength: 0 },
    whileInView: { pathLength: 1 },
    viewport: { once: true },
    transition: reduce ? { duration: 0 } : { delay, duration, ease: [0.65, 0, 0.35, 1] as const },
  });
  const fade = (delay: number) => ({
    initial: { opacity: 0 },
    whileInView: { opacity: 1 },
    viewport: { once: true },
    transition: reduce ? { duration: 0 } : { delay, duration: 0.5 },
  });

  const onMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const svg = svgRef.current;
    const ctm = svg?.getScreenCTM();
    if (!svg || !ctm || !readout.current) return;
    const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(ctm.inverse());
    const xi = p.x / S;
    const yi = -p.y / S;
    readout.current.textContent = `X ${xi >= 0 ? "+" : ""}${xi.toFixed(3)}  Y ${yi >= 0 ? "+" : ""}${yi.toFixed(3)} in`;
  };
  const onLeave = () => {
    if (readout.current) readout.current.textContent = "X +0.000  Y +0.000 in";
  };

  const [d1x, d1y] = pt(RO, 0);
  const [d2x, d2y] = pt(RO, 60);
  const arcR = RO + 34;
  const [a1x, a1y] = pt(arcR, 0);
  const [a2x, a2y] = pt(arcR, 60);
  const [lx, ly] = pt(arcR + 16, 30);

  return (
    <figure className="h-full w-full" data-cursor="crosshair">
      <svg
        ref={svgRef}
        viewBox="-400 -350 800 800"
        role="img"
        aria-labelledby={`${uid}-t ${uid}-d`}
        className="block h-full w-full select-none"
        onPointerMove={onMove}
        onPointerLeave={onLeave}
      >
        <title id={`${uid}-t`}>Drive sprocket, front view</title>
        <desc id={`${uid}-d`}>
          Schematic drawing of the 6-tooth, 5.40 inch diameter drive sprocket from the CMU Lunabotics tracked drive.
        </desc>

        {/* center lines */}
        <motion.g {...fade(0.1)} stroke="var(--blueprint)" strokeWidth="0.8" strokeDasharray="22 5 4 5" fill="none">
          <line x1={-RO - 40} y1="0" x2={RO + 40} y2="0" />
          <line x1="0" y1={-RO - 40} x2="0" y2={RO + 40} />
          <circle r={(RR + RO) / 2} />
        </motion.g>

        {/* part outline */}
        <g fill="var(--blueprint-wash)" stroke="var(--ink)" strokeWidth="2.2" strokeLinejoin="round">
          <motion.path d={PROFILE} {...draw(0.2, 1.8)} />
          <motion.circle r={0.95 * S} fill="none" {...draw(0.9)} />
          <motion.circle r={0.5 * S} fill="var(--surface)" {...draw(1.1)} />
        </g>

        {/* OD dimension, horizontal */}
        <motion.g {...fade(1.6)} stroke="var(--blueprint)" strokeWidth="0.9" fill="var(--blueprint)">
          <line x1={-RO} y1={RO + 20} x2={-RO} y2={RO + 62} />
          <line x1={RO} y1={RO + 20} x2={RO} y2={RO + 62} />
          <line x1={-RO + 2} y1={RO + 52} x2={RO - 2} y2={RO + 52} />
          <path d={`M${-RO} ${RO + 52} l12 -4 v8 z M${RO} ${RO + 52} l-12 -4 v8 z`} stroke="none" />
        </motion.g>
        <motion.text
          {...fade(1.8)}
          x="0"
          y={RO + 45}
          textAnchor="middle"
          className="fill-signal font-mono"
          fontSize="22"
          fontWeight="500"
          style={{ paintOrder: "stroke" }}
          stroke="var(--surface)"
          strokeWidth="8"
        >
          Ø5.40
        </motion.text>

        {/* angular tooth pitch */}
        <motion.g {...fade(2)} stroke="var(--blueprint)" strokeWidth="0.9" fill="none">
          <line x1={d1x} y1={d1y - 6} x2={a1x} y2={a1y - 10} />
          <line x1={d2x} y1={d2y} x2={a2x + 6} y2={a2y - 4} />
          <path d={`M${f(a1x)} ${f(a1y)} A${arcR} ${arcR} 0 0 1 ${f(a2x)} ${f(a2y)}`} />
        </motion.g>
        <motion.text {...fade(2.1)} x={lx + 6} y={ly} className="fill-blueprint font-mono" fontSize="16">
          60° TYP
        </motion.text>
        <motion.text {...fade(2.2)} x={-RO - 30} y={-RO + 10} className="fill-blueprint font-mono" fontSize="16">
          6X TEETH
        </motion.text>

        {/* title block */}
        <g className="font-mono" fontSize="13" style={{ whiteSpace: "pre" }}>
          <rect x="70" y="360" width="330" height="82" fill="var(--surface)" stroke="var(--rule)" />
          <line x1="70" y1="387" x2="400" y2="387" stroke="var(--rule)" />
          <line x1="70" y1="414" x2="400" y2="414" stroke="var(--rule)" />
          <line x1="250" y1="360" x2="250" y2="414" stroke="var(--rule)" />
          <text x="80" y="378" className="fill-ink">DRIVE SPROCKET</text>
          <text x="260" y="378" className="fill-ink-muted">CMU LUNABOTICS</text>
          <text x="80" y="405" className="fill-ink-muted">SCHEMATIC, NTS</text>
          <text x="260" y="405" className="fill-ink-muted">DRN NPV</text>
          <text x="80" y="433" className="fill-signal">
            <tspan ref={readout}>X +0.000  Y +0.000 in</tspan>
          </text>
        </g>
      </svg>
      <figcaption className="sr-only">
        Move the pointer over the drawing to read coordinates in inches from the sprocket center.
      </figcaption>
    </figure>
  );
}
