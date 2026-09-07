"use client";

import { motion, useReducedMotion } from "motion/react";
import { useProgress } from "@/lib/progress";

const SHAPES: Record<string, string> = {
  heart: "M12 20s-7-4.6-7-9.4A3.9 3.9 0 0112 8a3.9 3.9 0 017 2.6C19 15.4 12 20 12 20z",
  star: "M12 3l2.5 5.6L20 9.4l-4 4 1 6-5-2.9L7 19.4l1-6-4-4 5.5-.8z",
  key: "M14 7a4 4 0 11-3.2 6.4L5 19H3v-2l5.6-5.8A4 4 0 0114 7z",
  flower:
    "M12 8a2.5 2.5 0 100 5 2.5 2.5 0 000-5zM12 3v3M12 15v3M4.5 10.5l2.6 1M16.9 12.5l2.6 1M7 5.5l1.8 2.3M15.2 15.2l1.8 2.3",
  square: "M6 6h12v12H6zM6 12h12M12 6v12",
};

/**
 * One hidden thing.
 *
 * Sits wherever it's placed, glinting once every few seconds. Once found
 * it stays found — and stays visible, so the chapter remembers.
 *
 * HOW VISIBLE IT ENDS UP, and why this bit matters:
 *
 *   effective opacity = the colour's alpha  ×  the glint's resting opacity
 *                     = 0.85 (per scene)    ×  0.6 (`glint` keyframes)
 *                     ≈ 0.5
 *
 * The target is roughly 45–55% at rest, flaring to full on the glint.
 * The first version had 0.45 × 0.25 ≈ 0.11, which is invisible on a dark
 * background — the two numbers were tuned separately and multiplied into
 * nothing. If you change one, do the multiplication.
 */
export function Secret({
  id,
  kind,
  className = "",
  style,
  onFound,
}: {
  id: string;
  kind: keyof typeof SHAPES;
  className?: string;
  style?: React.CSSProperties;
  onFound?: () => void;
}) {
  const reduced = useReducedMotion();
  const { progress, addToList } = useProgress();
  const found = progress.secretsFound.includes(`hunt:${id}`);

  function take() {
    if (found) return;
    addToList("secretsFound", `hunt:${id}`);
    onFound?.();
  }

  return (
    <motion.button
      onClick={take}
      whileTap={{ scale: 0.8 }}
      aria-label={found ? "Found" : "Something small"}
      style={style}
      className={`absolute z-20 flex h-8 w-8 items-center justify-center ${className}`}
    >
      {/* a soft halo, so it reads against a busy or dark background */}
      {!found && (
        <span
          className={`absolute inset-0 rounded-full bg-current blur-[7px] ${
            reduced ? "opacity-20" : "anim-glint-halo"
          }`}
        />
      )}

      <span
        className={`relative flex h-full w-full items-center justify-center ${
          found ? "" : reduced ? "opacity-70" : "anim-glint"
        }`}
      >
        {found && (
          <span className="absolute inset-0 rounded-full bg-gold/25 blur-[6px]" />
        )}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={found ? 2 : 1.9}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`relative h-[18px] w-[18px] ${
            found ? "text-gold" : "text-current"
          }`}
        >
          <path d={SHAPES[kind]} />
        </svg>
      </span>
    </motion.button>
  );
}
