"use client";

import { useMemo } from "react";
import { useReducedMotion } from "motion/react";
import { HEART_PATH } from "@/components/ui/Hearts";

/**
 * The weather for chapter 09.
 *
 * Hearts, kiss marks and flame bursts — deliberately NOT rings and
 * sparks, which read as fireworks at a festival rather than as somebody
 * being loved. Three layers: bokeh far behind, flames in the middle
 * distance, hearts and kisses falling in front. All CSS-driven, so it
 * costs nothing to run.
 */

/**
 * A kiss mark, drawn as two lips rather than one blob — at 20px a single
 * outline reads as a smudge, so the upper lip, the lower lip and the gap
 * between them are separate shapes.
 */
const LIP_TOP =
  "M16 14.2c-1.9-3.4-5-4.9-7.5-3.8C6 11.5 5.1 14 6.1 16.4h19.8c1-2.4.1-4.9-2.4-6-2.5-1.1-5.6.4-7.5 3.8z";
const LIP_BOTTOM =
  "M6.4 17.6c1.4 3.9 5.2 7 9.6 8.6 4.4-1.6 8.2-4.7 9.6-8.6H6.4z";

/** A flame: pointed at the top, rounded at the base. */
const FLAME_OUTER =
  "M16 2.5c5.4 6.4 8.8 10 8.8 15.1a8.8 8.8 0 1 1-17.6 0c0-3.2 1.3-5.6 3.1-8 .5 1.6 1.3 2.7 2.4 3.4-.7-3.6.6-7 3.3-10.5z";
const FLAME_INNER =
  "M16 12.4c2.4 3 3.9 4.8 3.9 7.2a3.9 3.9 0 1 1-7.8 0c0-2.1 1.4-4 3.9-7.2z";

const FALLING = [
  { kind: "heart", color: "#ff6f9c" },
  { kind: "heart", color: "#ffb3ce" },
  { kind: "heart", color: "#e0457b" },
  { kind: "heart", color: "#ffd9e8" },
  { kind: "heart", color: "#ff8fb3" },
  { kind: "kiss", color: "#e0457b" },
  { kind: "kiss", color: "#ff6f9c" },
  { kind: "heart", color: "#f2c14e" },
] as const;

/** Hearts and kiss marks tumbling down the screen. */
export function LoveFall({ count = 46 }: { count?: number }) {
  const reduced = useReducedMotion();

  const bits = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const r = (n: number) =>
          ((Math.sin(i * 12.9898 + n * 4.1) * 43758.5453) % 1 + 1) % 1;
        const pick = FALLING[Math.floor(r(3) * FALLING.length)];
        return {
          left: `${r(1) * 100}%`,
          size: 13 + r(2) * 20,
          kind: pick.kind,
          color: pick.color,
          dur: `${5 + r(4) * 5}s`,
          delay: `${r(5) * 7}s`,
          drift: `${(r(6) - 0.5) * 190}px`,
          spin: `${(r(7) - 0.5) * 900}deg`,
        };
      }),
    [count],
  );

  if (reduced) return null;

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {bits.map((b, i) => (
        <span
          key={i}
          className="anim-confetti absolute top-0 block"
          style={
            {
              left: b.left,
              "--dur": b.dur,
              "--delay": b.delay,
              "--drift": b.drift,
              "--spin": b.spin,
            } as React.CSSProperties
          }
        >
          <svg viewBox="0 0 32 32" width={b.size} height={b.size}>
            {b.kind === "heart" ? (
              <path d={HEART_PATH} fill={b.color} />
            ) : (
              <>
                <path d={LIP_TOP} fill={b.color} />
                <path d={LIP_BOTTOM} fill={b.color} opacity={0.82} />
              </>
            )}
          </svg>
        </span>
      ))}
    </div>
  );
}

const FLAMES = [
  { x: "11%", y: "20%", s: 40, d: "3.4s", delay: "0s" },
  { x: "84%", y: "14%", s: 32, d: "3.9s", delay: "1.1s" },
  { x: "60%", y: "29%", s: 26, d: "3.1s", delay: "2.2s" },
  { x: "20%", y: "70%", s: 36, d: "4.2s", delay: "3s" },
  { x: "89%", y: "64%", s: 29, d: "3.6s", delay: "4.1s" },
  { x: "45%", y: "86%", s: 24, d: "4s", delay: "5s" },
];

/**
 * Little flames flaring up and dying back. Drawn as actual flames — a
 * scaled ellipse just looks like an orange egg, which is what the first
 * version of this was.
 */
export function Flames() {
  const reduced = useReducedMotion();
  if (reduced) return null;

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {FLAMES.map((f, i) => (
        <span
          key={i}
          className="anim-flame-flare absolute block"
          style={
            {
              left: f.x,
              top: f.y,
              "--dur": f.d,
              "--delay": f.delay,
            } as React.CSSProperties
          }
        >
          <svg
            viewBox="0 0 32 32"
            width={f.s}
            height={f.s * 1.15}
            style={{ filter: "drop-shadow(0 0 10px rgba(255,157,60,0.75))" }}
          >
            <path d={FLAME_OUTER} fill="url(#flame-o)" />
            <path d={FLAME_INNER} fill="url(#flame-i)" />
            <defs>
              <linearGradient id="flame-o" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ffd166" />
                <stop offset="45%" stopColor="#ff9d3c" />
                <stop offset="100%" stopColor="#e0457b" />
              </linearGradient>
              <linearGradient id="flame-i" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#fff6e2" />
                <stop offset="100%" stopColor="#ffd166" />
              </linearGradient>
            </defs>
          </svg>
        </span>
      ))}
    </div>
  );
}

const BOKEH = [
  { x: "10%", y: "18%", s: 140, c: "#ff8fb3", d: "13s", delay: "0s" },
  { x: "72%", y: "12%", s: 100, c: "#e0457b", d: "16s", delay: "1.5s" },
  { x: "42%", y: "48%", s: 180, c: "#f2c14e", d: "11s", delay: "3s" },
  { x: "84%", y: "70%", s: 120, c: "#ffd9e8", d: "18s", delay: "0.8s" },
  { x: "16%", y: "78%", s: 160, c: "#a12a63", d: "14s", delay: "2.2s" },
  { x: "58%", y: "84%", s: 90, c: "#ff9d3c", d: "12s", delay: "4s" },
];

export function Bokeh() {
  const reduced = useReducedMotion();
  if (reduced) return null;

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {BOKEH.map((b, i) => (
        <span
          key={i}
          className="anim-bokeh absolute rounded-full blur-2xl"
          style={
            {
              left: b.x,
              top: b.y,
              width: b.s,
              height: b.s,
              background: b.c,
              "--dur": b.d,
              "--delay": b.delay,
              "--bx": `${(i % 2 ? 1 : -1) * 24}px`,
              "--by": `${-18 - i * 5}px`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
