"use client";

import { AnimatePresence, motion } from "motion/react";

/**
 * Deliberately not a HUD. A quiet line that appears and leaves.
 */
export function Toast({ message }: { message: string | null }) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          key={message}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="pointer-events-none fixed inset-x-0 bottom-8 z-50 flex justify-center px-6"
        >
          <span className="rounded-full bg-cocoa-800/90 px-5 py-2 text-xs font-medium tracking-wide text-cream backdrop-blur">
            {message}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
