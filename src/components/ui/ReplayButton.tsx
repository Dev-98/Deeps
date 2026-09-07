"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { useProgress } from "@/lib/progress";

/**
 * Start the whole thing again.
 *
 * Small and out of the way — it only appears once there is something to
 * reset, and it asks once before throwing the run away, so nobody wipes
 * their progress with a stray tap. The storyboard asks for replay/reset;
 * this is it.
 */

/**
 * From The Wish onward the screen belongs to the story. No reset button,
 * no counter, no chrome of any kind — nothing competes with the candle,
 * the celebration or the video.
 */
const HIDDEN_ON = ["/wish", "/birthday", "/video", "/final", "/hunt"];

export function ReplayButton() {
  const router = useRouter();
  const pathname = usePathname();
  const { started, ready, reset } = useProgress();
  const [asking, setAsking] = useState(false);

  if (!ready || !started) return null;
  if (HIDDEN_ON.includes(pathname)) return null;

  function startOver() {
    reset();
    setAsking(false);
    router.push("/");
  }

  return (
    <div className="fixed top-4 left-4 z-50 flex items-center gap-2">
      <button
        onClick={() => setAsking((a) => !a)}
        aria-label="Start over"
        className="flex h-9 w-9 items-center justify-center rounded-full border border-cocoa-400/35 bg-cream/70 text-cocoa-600 backdrop-blur-sm transition-colors hover:bg-cream"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          strokeLinecap="round"
          className="h-4 w-4"
          aria-hidden
        >
          <path d="M3 12a9 9 0 1 0 3-6.7M3 4v5h5" />
        </svg>
      </button>

      <AnimatePresence>
        {asking && (
          <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.25 }}
            className="flex items-center gap-1 rounded-full border border-cocoa-400/35 bg-cream/90 py-1 pr-1 pl-3 backdrop-blur-sm"
          >
            <span className="text-xs text-mocha">Start over?</span>
            <button
              onClick={startOver}
              className="rounded-full bg-cocoa-600 px-3 py-1 text-xs font-semibold text-cream"
            >
              Yes
            </button>
            <button
              onClick={() => setAsking(false)}
              className="rounded-full px-2 py-1 text-xs text-mocha"
            >
              No
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
