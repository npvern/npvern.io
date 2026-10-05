"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import type * as THREE from "three";

/*
  Real geometry: the CMU Lunabotics mobility assembly, exported from Onshape as STEP,
  tessellated offline (fasteners removed) into /models/track.bin.gz.
  Format: u32 header length, JSON header, then per group Int16 xyz positions + Uint32 indices.
*/

type Header = {
  center: [number, number, number];
  scale: number;
  groups: { name: string; vertices: number; indices: number }[];
};

type Status = "loading" | "ready" | "error";

function cssVar(name: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

async function loadModel(): Promise<{ header: Header; buf: ArrayBuffer }> {
  const res = await fetch("/models/track.bin.gz");
  if (!res.ok || !res.body) throw new Error(`model ${res.status}`);
  // Some hosts send the .gz already decoded; check the gzip magic number before inflating.
  const raw = await res.arrayBuffer();
  const bytes = new Uint8Array(raw);
  let buf = raw;
  if (bytes[0] === 0x1f && bytes[1] === 0x8b) {
    const stream = new Blob([raw]).stream().pipeThrough(new DecompressionStream("gzip"));
    buf = await new Response(stream).arrayBuffer();
  }
  const len = new DataView(buf).getUint32(0, true);
  const header = JSON.parse(new TextDecoder().decode(new Uint8Array(buf, 4, len))) as Header;
  return { header, buf: buf.slice(4 + len) };
}

export function TrackViewer() {
  const host = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<Status>("loading");
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    let disposed = false;
    let cleanup = () => {};

    (async () => {
      try {
        const [T, { OrbitControls }, { header, buf }] = await Promise.all([
          import("three"),
          import("three/examples/jsm/controls/OrbitControls.js"),
          loadModel(),
        ]);
        if (disposed) return;

        const renderer = new T.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        el.appendChild(renderer.domElement);
        renderer.domElement.setAttribute("aria-hidden", "true");

        const scene = new T.Scene();
        const camera = new T.PerspectiveCamera(30, 1, 0.1, 200);
        const viewDir = new T.Vector3(-1.25, 0.6, 1.05);

        const root = new T.Group();
        // Track runs along Z; turn it so the drive sprocket end faces the viewer.
        root.rotation.y = -Math.PI / 2;
        scene.add(root);

        const fill: Record<string, THREE.MeshBasicMaterial> = {};
        const line: Record<string, THREE.LineBasicMaterial> = {};
        const s = header.scale / 12; // normalize the ~31 in assembly to about 2.6 scene units
        let offset = 0;
        const geoms: THREE.BufferGeometry[] = [];

        for (const g of header.groups) {
          const pos = new Int16Array(buf, offset, g.vertices * 3);
          offset += g.vertices * 6;
          if (offset % 4) offset += 2;
          const idx = new Uint32Array(buf, offset, g.indices);
          offset += g.indices * 4;

          const geo = new T.BufferGeometry();
          const f = new Float32Array(pos.length);
          for (let i = 0; i < pos.length; i++) f[i] = pos[i] * s;
          geo.setAttribute("position", new T.BufferAttribute(f, 3));
          geo.setIndex(new T.BufferAttribute(idx.slice(), 1));
          geoms.push(geo);

          const hot = g.name === "drive";
          fill[g.name] = new T.MeshBasicMaterial({
            polygonOffset: true,
            polygonOffsetFactor: 1,
            polygonOffsetUnits: 1,
            transparent: hot,
            opacity: hot ? 0.9 : 1,
          });
          root.add(new T.Mesh(geo, fill[g.name]));

          const edges = new T.EdgesGeometry(geo, g.name === "tread" ? 40 : 28);
          geoms.push(edges);
          line[g.name] = new T.LineBasicMaterial();
          root.add(new T.LineSegments(edges, line[g.name]));
        }

        const applyColors = () => {
          const surface = new T.Color(cssVar("--surface"));
          const ink = new T.Color(cssVar("--ink"));
          const blue = new T.Color(cssVar("--blueprint"));
          const signal = new T.Color(cssVar("--signal"));
          for (const name of Object.keys(fill)) {
            const hot = name === "drive";
            fill[name].color.copy(hot ? surface.clone().lerp(signal, 0.35) : surface);
            line[name].color.copy(hot ? signal : name === "tread" ? blue : ink);
          }
          render();
        };

        const bounds = new T.Box3().setFromObject(root);
        const radius = bounds.getBoundingSphere(new T.Sphere()).radius;
        root.position.sub(bounds.getCenter(new T.Vector3()));

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableZoom = false;
        controls.enablePan = false;
        // On touch screens the page must keep scrolling, so the model only sways.
        controls.enabled = matchMedia("(pointer: fine)").matches;
        controls.enableDamping = true;
        controls.minPolarAngle = Math.PI * 0.18;
        controls.maxPolarAngle = Math.PI * 0.62;
        // A slow sway keeps the drive sprocket end facing the viewer. Stops while dragging.
        let dragging = false;
        controls.addEventListener("start", () => (dragging = true));
        controls.addEventListener("end", () => (dragging = false));
        const baseYaw = root.rotation.y;
        const t0 = performance.now();

        const resize = () => {
          const w = el.clientWidth;
          const h = el.clientHeight;
          renderer.setSize(w, h, false);
          renderer.domElement.style.width = "100%";
          renderer.domElement.style.height = "100%";
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          // Fit the assembly's bounding sphere to whichever field of view is tighter.
          const vfov = (camera.fov * Math.PI) / 180;
          const hfov = 2 * Math.atan(Math.tan(vfov / 2) * camera.aspect);
          const dist = (radius / Math.sin(Math.min(vfov, hfov) / 2)) * 0.9;
          camera.position.copy(viewDir).normalize().multiplyScalar(dist);
          camera.lookAt(0, 0, 0);
          controls.update();
          render();
        };
        function render() {
          renderer.render(scene, camera);
        }

        // Only animate while the viewer is on screen.
        let visible = true;
        let raf = 0;
        const loop = () => {
          raf = 0;
          if (!visible) return;
          const moved = controls.update();
          if (!reduce && !dragging) {
            root.rotation.y = baseYaw + Math.sin((performance.now() - t0) / 4000) * 0.22;
            render();
          } else if (moved) render();
          raf = requestAnimationFrame(loop);
        };
        const io = new IntersectionObserver(([e]) => {
          visible = e.isIntersecting;
          if (visible && !raf) raf = requestAnimationFrame(loop);
        });
        io.observe(el);

        const ro = new ResizeObserver(resize);
        ro.observe(el);
        const mo = new MutationObserver(applyColors);
        mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
        const mq = matchMedia("(prefers-color-scheme: dark)");
        mq.addEventListener("change", applyColors);

        resize();
        applyColors();
        setStatus("ready");
        raf = requestAnimationFrame(loop);

        cleanup = () => {
          cancelAnimationFrame(raf);
          io.disconnect();
          ro.disconnect();
          mo.disconnect();
          mq.removeEventListener("change", applyColors);
          controls.dispose();
          geoms.forEach((g) => g.dispose());
          Object.values(fill).forEach((m) => m.dispose());
          Object.values(line).forEach((m) => m.dispose());
          renderer.dispose();
          renderer.domElement.remove();
        };
      } catch {
        if (!disposed) setStatus("error");
      }
    })();

    return () => {
      disposed = true;
      cleanup();
    };
  }, [reduce]);

  return (
    <div className="relative h-full w-full">
      <div ref={host} className="absolute inset-0 cursor-grab active:cursor-grabbing" />
      {status === "loading" && (
        <div className="absolute inset-0 grid place-items-center">
          <p className="font-mono text-meta text-ink-muted">
            Loading model<span className="caret">_</span>
          </p>
        </div>
      )}
      {status === "error" && (
        <div className="absolute inset-0 grid place-items-center p-6 text-center">
          <p className="max-w-[30ch] font-mono text-meta text-ink-muted">
            The 3D model could not load in this browser. Photos and CAD of the track are on the Projects page.
          </p>
        </div>
      )}
    </div>
  );
}
