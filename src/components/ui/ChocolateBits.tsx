"use client";

import { motion, useReducedMotion } from "motion/react";

const BITS = [
  { left: "8%", top: "18%", size: 26, delay: 0, rotate: -18 },
  { left: "86%", top: "26%", size: 18, delay: 1.1, rotate: 24 },
  { left: "18%", top: "76%", size: 20, delay: 0.6, rotate: 12 },
  { left: "78%", top: "72%", size: 30, delay: 1.7, rotate: -8 },
  { left: "48%", top: "12%", size: 14, delay: 2.2, rotate: 32 },
];

/**
 * The chocolate motif: small squares that drift in the background of a scene.
 * Environmental, never the subject. Hidden when motion is reduced.
 */
export function ChocolateBits({ opacity = 0.3 }: { opacity?: number }) {
  const reduced = useReducedMotion();
  if (reduced) return null;

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {BITS.map((bit, i) => (
        <motion.span
          key={i}
          initial={{ y: 0, rotate: bit.rotate }}
          animate={{ y: [-6, 8, -6], rotate: [bit.rotate, bit.rotate + 6, bit.rotate] }}
          transition={{
            duration: 9 + i,
            delay: bit.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            left: bit.left,
            top: bit.top,
            width: bit.size,
            height: bit.size * 0.72,
            opacity,
          }}
          className="absolute rounded-[3px] bg-cocoa-500 shadow-[inset_0_-3px_0_rgba(26,15,7,0.35),inset_0_2px_0_rgba(255,255,255,0.18)]"
        />
      ))}
    </div>
  );
}
