"use client";

import { AnimatePresence, motion } from "motion/react";
import { usePathname } from "next/navigation";
import { secretDefs } from "@/data/secrets";
import { useProgress } from "@/lib/progress";
import { useTransition } from "@/components/transitions/TransitionProvider";

/**
 * The quietest possible HUD.
 *
 * Doesn't exist until she's found her first one. Never explains itself.
 * When the fifth lands it turns gold and becomes the way into the room
 * that only opens for people who were paying attention.
 */

/**
 * From The Wish onward the screen belongs to the story. No reset button,
 * no counter, no chrome of any kind — nothing competes with the candle,
 * the celebration or the video.
 */
const HIDDEN_ON = ["/wish", "/birthday", "/video", "/final", "/hunt"];

export function HuntCounter() {
  const pathname = usePathname();
  const { progress, ready } = useProgress();
  const { go } = useTransition();

  /**
   * Counted against the definitions, not against whatever is in saved
   * progress: an id left over from a chapter that no longer exists would
   * otherwise pad the total and open the room early.
   */
  const found = secretDefs.filter((d) =>
    progress.secretsFound.includes(`hunt:${d.id}`),
  ).length;

  if (!ready || found === 0) return null;
  if (HIDDEN_ON.includes(pathname)) return null;
  const all = found >= secretDefs.length;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-4 right-4 z-50"
      >
        <button
          onClick={all ? () => go("/hunt", "doorway") : undefined}
          disabled={!all}
          className={`flex items-center gap-2 rounded-full border px-3 py-1.5 backdrop-blur-sm transition-colors ${
            all
              ? "border-gold/70 bg-gold/20 text-gold"
              : "border-cocoa-400/30 bg-cocoa-900/25 text-cocoa-200/70"
          }`}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-3 w-3"
            aria-hidden
          >
            <path d="M12 3l2.5 5.6L20 9.4l-4 4 1 6-5-2.9L7 19.4l1-6-4-4 5.5-.8z" />
          </svg>
          <span className="text-[10px] font-bold tracking-[0.2em]">
            {found} / {secretDefs.length}
          </span>
          {all && (
            <motion.span
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.8, repeat: Infinity }}
              className="text-[9px] font-bold tracking-[0.15em] uppercase"
            >
              Open
            </motion.span>
          )}
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
