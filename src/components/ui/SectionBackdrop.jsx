import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";

/**
 * SectionBackdrop
 *
 * Decorative background for the plain sections: drifting colour blobs, a
 * circuit that flows down the section as you scroll, and a faint grain.
 *
 * The circuit is two continuous lines (one hugging each side). A faint copy of
 * each is always visible; a bright copy grows along it in step with the scroll,
 * led by a glowing head. Side branches sprout as the head passes them and the
 * nodes light up when it reaches them.
 *
 * The art repeats in tiles (1000 x 800 units, as wide as the section) so tall
 * sections like Team get the same density as short ones. The number of tiles is
 * measured from the section, so there is no wasted drawing.
 *
 * Keep-clear zones: any element inside the section marked `data-clear-backdrop`
 * (the outlined Team titles) gets a soft hole in the blobs and circuit behind it,
 * so no node, line or glow ever sits behind hollow text. The holes are measured
 * from the page and fed to a CSS mask; the grain is left alone.
 *
 * Usage: give the parent <section> the `isolate` class (and `relative`), then
 * render <SectionBackdrop /> as its first child. It sits behind the content
 * (-z-10), ignores the pointer, and clips itself so it never causes scrolling.
 */

const TILE_W = 1000;
const TILE_H = 800;

// One tile of each flow. First and last points share x = 70 so tiles join seamlessly.
const FLOWS = [
  {
    mirrored: false,
    main: [
      [70, 0], [70, 100], [140, 170], [140, 290], [300, 290], [360, 350],
      [360, 470], [220, 470], [150, 540], [150, 640], [70, 720], [70, 800],
    ],
    nodes: [4, 6, 9, 11], // main-line vertices that get a node
    branches: [
      { from: 2, pts: [[430, 170], [470, 210], [470, 250]] },
      { from: 5, pts: [[560, 350], [600, 390]] },
      { from: 8, pts: [[420, 540], [460, 580], [460, 640]] },
    ],
  },
  {
    mirrored: true,
    main: [
      [70, 0], [70, 60], [130, 120], [130, 400], [240, 400], [300, 460],
      [300, 560], [180, 560], [110, 630], [110, 740], [70, 780], [70, 800],
    ],
    nodes: [3, 6, 9, 11],
    branches: [
      { from: 2, pts: [[380, 120], [420, 160]] },
      { from: 5, pts: [[520, 460], [560, 500], [560, 560]] },
      { from: 8, pts: [[330, 630], [370, 670]] },
    ],
  },
];

const dist = (a, b) => Math.hypot(b[0] - a[0], b[1] - a[1]);

/** Build the full polyline for `tiles` stacked tiles, with cumulative lengths. */
function buildFlow(flow, tiles) {
  const pts = [];
  const vertexAt = []; // vertexAt[k][i] -> index in pts of tile k, vertex i
  for (let k = 0; k < tiles; k++) {
    vertexAt[k] = [];
    flow.main.forEach(([x, y], i) => {
      if (k > 0 && i === 0) {
        vertexAt[k][i] = pts.length - 1; // shared with previous tile's last point
        return;
      }
      pts.push([x, y + TILE_H * k]);
      vertexAt[k][i] = pts.length - 1;
    });
  }
  const cum = [0];
  for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + dist(pts[i - 1], pts[i]));
  const total = cum[cum.length - 1];
  const d = "M" + pts.map((p) => p.join(" ")).join(" L");

  const nodes = [];
  const branches = [];
  for (let k = 0; k < tiles; k++) {
    flow.nodes.forEach((v) => {
      const idx = vertexAt[k][v];
      nodes.push({ x: pts[idx][0], y: pts[idx][1], at: cum[idx] / total });
    });
    flow.branches.forEach((b) => {
      const idx = vertexAt[k][b.from];
      const start = pts[idx];
      const bpts = [start, ...b.pts.map(([x, y]) => [x, y + TILE_H * k])];
      let len = 0;
      for (let i = 1; i < bpts.length; i++) len += dist(bpts[i - 1], bpts[i]);
      const end = bpts[bpts.length - 1];
      branches.push({
        d: "M" + bpts.map((p) => p.join(" ")).join(" L"),
        at: cum[idx] / total,
        span: Math.min(0.06, len / total),
        end,
      });
    });
  }
  return { pts, cum, total, d, nodes, branches };
}

/** Point at fraction f (0..1) of the way along the main line. */
function pointAt({ pts, cum, total }, f) {
  const target = f * total;
  let lo = 0;
  let hi = cum.length - 1;
  while (lo < hi - 1) {
    const mid = (lo + hi) >> 1;
    if (cum[mid] <= target) lo = mid;
    else hi = mid;
  }
  const seg = cum[hi] - cum[lo] || 1;
  const t = (target - cum[lo]) / seg;
  return [pts[lo][0] + (pts[hi][0] - pts[lo][0]) * t, pts[lo][1] + (pts[hi][1] - pts[lo][1]) * t];
}

function Branch({ b, progress, reduce }) {
  const draw = useTransform(progress, [b.at, b.at + b.span], [0, 1], { clamp: true });
  const lit = useTransform(progress, [b.at + b.span * 0.8, b.at + b.span], [0.2, 1], { clamp: true });
  return (
    <g className="max-sm:hidden">
      <path d={b.d} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" opacity="0.14" />
      <motion.path
        d={b.d}
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        style={{ pathLength: reduce ? 1 : draw }}
      />
      <motion.circle
        cx={b.end[0]}
        cy={b.end[1]}
        r="7"
        fill="currentColor"
        style={{ opacity: reduce ? 1 : lit, filter: "drop-shadow(0 0 7px currentColor)" }}
      />
    </g>
  );
}

function Node({ n, progress, reduce }) {
  const lit = useTransform(progress, [n.at - 0.004, n.at + 0.006], [0.2, 1], { clamp: true });
  return (
    <motion.circle
      cx={n.x}
      cy={n.y}
      r="7"
      fill="currentColor"
      style={{ opacity: reduce ? 1 : lit, filter: "drop-shadow(0 0 7px currentColor)" }}
    />
  );
}

function Flow({ flow, tiles, progress, reduce }) {
  const built = useRef(null);
  const headRef = useRef(null);
  const haloRef = useRef(null);
  built.current = buildFlowCached(flow, tiles);
  const f = built.current;

  const place = (v) => {
    if (!headRef.current) return;
    const [x, y] = pointAt(f, Math.min(Math.max(v, 0), 1));
    const show = v > 0.002 && v < 0.998 ? "1" : "0";
    [headRef.current, haloRef.current].forEach((el) => {
      el.setAttribute("cx", x);
      el.setAttribute("cy", y);
      el.style.opacity = show;
    });
  };
  useMotionValueEvent(progress, "change", place);
  useEffect(() => {
    if (!reduce) place(progress.get());
  });

  return (
    <g transform={flow.mirrored ? `translate(${TILE_W} 0) scale(-1 1)` : undefined}>
      {/* faint skeleton, always visible */}
      <path d={f.d} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" opacity="0.14" />
      {/* bright line that grows with the scroll */}
      <motion.path
        d={f.d}
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        style={{ pathLength: reduce ? 1 : progress }}
      />
      {f.branches.map((b, i) => (
        <Branch key={i} b={b} progress={progress} reduce={reduce} />
      ))}
      {f.nodes.map((n, i) => (
        <Node key={i} n={n} progress={progress} reduce={reduce} />
      ))}
      {!reduce && (
        <>
          <circle ref={haloRef} r="16" fill="currentColor" opacity="0" style={{ filter: "blur(5px)", transition: "opacity .3s" }} />
          <circle ref={headRef} r="6" fill="#fff" opacity="0" style={{ filter: "drop-shadow(0 0 8px currentColor)", transition: "opacity .3s" }} />
        </>
      )}
    </g>
  );
}

// Geometry only depends on (flow, tiles); keep the last result per flow.
const cache = new WeakMap();
function buildFlowCached(flow, tiles) {
  const hit = cache.get(flow);
  if (hit && hit.tiles === tiles) return hit.value;
  const value = buildFlow(flow, tiles);
  cache.set(flow, { tiles, value });
  return value;
}

function Blobs({ tiles, flip }) {
  return (
    <div className="flex flex-col">
      {Array.from({ length: tiles }, (_, index) => {
        const mirrored = flip ? index % 2 === 0 : index % 2 === 1;
        return (
          <div key={index} className="relative aspect-[5/4] w-full shrink-0">
            <div
              className={`absolute top-[10%] h-56 w-56 animate-blob rounded-full bg-gradient-to-tr from-misc-blue/55 to-misc-lightBlue/35 blur-[60px] will-change-transform sm:h-[26rem] sm:w-[26rem] sm:blur-[80px] md:blur-[110px] dark:from-misc-blue/45 ${
                mirrored ? "right-[-5rem] sm:right-[-7rem]" : "left-[-5rem] sm:left-[-7rem]"
              } ${index % 2 ? "hidden sm:block" : ""}`}
              style={{ animationDelay: `${-index * 2.3}s` }}
            />
            <div
              className={`absolute bottom-[10%] hidden h-[28rem] w-[28rem] animate-blob rounded-full bg-gradient-to-tr from-misc-purple/55 to-misc-blue/30 blur-[90px] will-change-transform sm:block md:blur-[120px] dark:from-misc-purple/50 ${
                mirrored ? "left-[-9rem]" : "right-[-9rem]"
              }`}
              style={{ animationDelay: `${-4 - index * 1.7}s` }}
            />
          </div>
        );
      })}
    </div>
  );
}

/**
 * On phones the glows are smaller and appear on every other tile only (a full-size
 * glow is wider than the screen and floods the cards). The circuit is fainter and loses
 * its side branches there, so it does not cut across the text.
 *
 * @param {boolean} flip  Start the blob layout on the other side (variety between sections)
 */
export default function SectionBackdrop({ flip = false }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const [tiles, setTiles] = useState(3);

  // Measure the section so we render just enough tiles to cover it
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const measure = () => {
      const w = el.clientWidth || 1;
      const h = el.clientHeight || 1;
      setTiles(Math.max(1, Math.ceil(h / (w * (TILE_H / TILE_W)))));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Soft holes under [data-clear-backdrop] elements, as a CSS mask image
  const [mask, setMask] = useState(null);
  useEffect(() => {
    const el = ref.current;
    const section = el?.parentElement;
    if (!el || !section) return undefined;
    const PAD_X = 36;
    const PAD_Y = 22;
    const measure = () => {
      const root = el.getBoundingClientRect();
      const holes = [...section.querySelectorAll("[data-clear-backdrop]")].map((n) => {
        const r = n.getBoundingClientRect();
        return { x: r.left - root.left - PAD_X, y: r.top - root.top - PAD_Y, w: r.width + PAD_X * 2, h: r.height + PAD_Y * 2 };
      });
      if (!holes.length) {
        setMask(null);
        return;
      }
      const w = Math.round(root.width);
      const h = Math.round(root.height);
      const rects = holes
        .map((o) => `<rect x="${o.x.toFixed(0)}" y="${o.y.toFixed(0)}" width="${o.w.toFixed(0)}" height="${o.h.toFixed(0)}" rx="26" fill="black" filter="url(#b)"/>`)
        .join("");
      const svg =
        `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">` +
        `<defs><filter id="b" x="-20%" y="-60%" width="140%" height="220%"><feGaussianBlur stdDeviation="18"/></filter>` +
        `<mask id="m"><rect width="${w}" height="${h}" fill="white"/>${rects}</mask></defs>` +
        `<rect width="${w}" height="${h}" fill="white" mask="url(#m)"/></svg>`;
      setMask(`url("data:image/svg+xml,${encodeURIComponent(svg)}")`);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    section.querySelectorAll("[data-clear-backdrop]").forEach((n) => ro.observe(n));
    if (document.fonts?.ready) document.fonts.ready.then(measure);
    return () => ro.disconnect();
  }, [tiles]);

  // 0 when the section's top reaches 75% of the viewport, 1 when its bottom reaches 40%
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 40%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 110, damping: 28, mass: 0.5 });

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-[inherit]"
    >
      <div
        className="absolute inset-0 overflow-hidden"
        style={
          mask
            ? { maskImage: mask, WebkitMaskImage: mask, maskSize: "100% 100%", WebkitMaskSize: "100% 100%" }
            : undefined
        }
      >
      <Blobs tiles={tiles} flip={flip} />

      <svg
        viewBox={`0 0 ${TILE_W} ${TILE_H * tiles}`}
        className="absolute inset-x-0 top-0 h-auto w-full text-misc-blue/70 max-sm:opacity-40 dark:text-misc-lightBlue/60"
        style={{ aspectRatio: `${TILE_W} / ${TILE_H * tiles}` }}
      >
        {FLOWS.map((flow, i) => (
          <Flow key={i} flow={flow} tiles={tiles} progress={progress} reduce={reduce} />
        ))}
      </svg>
      </div>

      {/* Grain */}
      <div className="bg-grain absolute inset-0" />
    </div>
  );
}
