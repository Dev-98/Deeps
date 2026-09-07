"use client";

import { useMemo } from "react";
import { useReducedMotion } from "motion/react";

/** The one heart shape used everywhere, so they all match. */
export const HEART_PATH =
  "M16 28.6C16 28.6 2.4 19.6 2.4 10.9A7.4 7.4 0 0 1 16 6.4a7.4 7.4 0 0 1 13.6 4.5c0 8.7-13.6 17.7-13.6 17.7z";

export function Heart({
  className = "",
  color = "currentColor",
  size = 20,
  style,
}: {
  className?: string;
  color?: string;
  size?: number;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      className={className}
      style={style}
      aria-hidden
    >
      <path d={HEART_PATH} fill={color} />
    </svg>
  );
}

const HEART_COLORS = ["#ff6f9c", "#ffb3ce", "#e0457b", "#ffd9e8", "#ff8fb3"];

/**
 * Hearts drifting up out of the world.
 *
 * Deliberately slow and slightly irregular — they should read as
 * something the place is doing, not as a particle effect someone
 * switched on.
 */
export function RisingHearts({
  count = 14,
  from = "60%",
  opacity = 0.9,
}: {
  count?: number;
  /** How far down the screen they start. */
  from?: string;
  opacity?: number;
}) {
  const reduced = useReducedMotion();

  const hearts = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const r = (n: number) =>
          ((Math.sin(i * 7.331 + n * 3.17) * 43758.5453) % 1 + 1) % 1;
        return {
          left: `${4 + r(1) * 92}%`,
          size: 11 + r(2) * 19,
          color: HEART_COLORS[Math.floor(r(3) * HEART_COLORS.length)],
          dur: `${8 + r(4) * 8}s`,
          delay: `${r(5) * 9}s`,
          hx: `${(r(6) - 0.5) * 120}px`,
          hr: `${(r(7) - 0.5) * 60}deg`,
        };
      }),
    [count],
  );

  if (reduced) return null;

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {hearts.map((h, i) => (
        <span
          key={i}
          className="anim-heart-rise absolute"
          style={
            {
              left: h.left,
              top: from,
              "--dur": h.dur,
              "--delay": h.delay,
              "--hx": h.hx,
              "--hr": h.hr,
              "--peak": opacity,
            } as React.CSSProperties
          }
        >
          <Heart size={h.size} color={h.color} />
        </span>
      ))}
    </div>
  );
}
