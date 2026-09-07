"use client";

import { motion } from "motion/react";
import type { ComponentPropsWithoutRef } from "react";

type Props = ComponentPropsWithoutRef<"button"> & {
  tone?: "solid" | "ghost";
};

/**
 * Touch-first: every affordance responds to tap, never to hover alone.
 */
export function SoftButton({
  tone = "solid",
  className = "",
  children,
  ...rest
}: Props) {
  const base =
    "relative select-none rounded-full px-7 py-3 text-sm font-semibold tracking-wide transition-colors disabled:opacity-40 disabled:cursor-not-allowed";
  const tones = {
    solid:
      "bg-cocoa-600 text-cream shadow-[0_8px_24px_-10px_rgba(42,25,12,0.8)] hover:bg-cocoa-500",
    ghost:
      "border border-cocoa-300/60 text-cocoa-600 hover:bg-cocoa-50/70",
  } as const;

  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      whileHover={{ y: -1 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className={`${base} ${tones[tone]} ${className}`}
      {...(rest as ComponentPropsWithoutRef<typeof motion.button>)}
    >
      {children}
    </motion.button>
  );
}
