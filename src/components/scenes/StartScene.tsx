"use client";

import { motion } from "motion/react";
import { ChocolateBits } from "@/components/ui/ChocolateBits";

/**
 * 00a — START. No birthday, no name, no explanation.
 * The only job of this screen is to make her curious enough to tap.
 *
 * The reveal is pure CSS so this screen is readable the instant the HTML
 * lands, whether or not the JavaScript has caught up.
 */
export function StartScene({ onBegin }: { onBegin: () => void }) {
  return (
    <div className="relative flex w-full max-w-md flex-col items-center text-center">
      <ChocolateBits opacity={0.28} />

      <p
        style={{ animationDelay: "0.3s" }}
        className="anim-rise text-[11px] font-semibold tracking-[0.4em] text-mocha uppercase"
      >
        Do not open this in public
      </p>

      <h1
        style={{ animationDelay: "0.7s" }}
        className="anim-rise mt-6 font-[family-name:var(--font-display)] text-4xl leading-tight text-cocoa-700 sm:text-5xl"
      >
        There&rsquo;s a door here.
      </h1>

      <p
        style={{ animationDelay: "1.3s" }}
        className="anim-fade mt-4 max-w-xs text-sm leading-relaxed text-mocha"
      >
        It only opens for one person. Inconveniently for you, that person is
        you.
      </p>

      <motion.button
        onClick={onBegin}
        whileTap={{ scale: 0.95 }}
        style={{ animationDelay: "1.9s" }}
        className="anim-rise group mt-12 flex flex-col items-center gap-3"
      >
        <span className="relative flex h-16 w-16 items-center justify-center rounded-full border border-cocoa-300/70">
          <span className="anim-breathe absolute inset-0 rounded-full border border-caramel/70" />
          <span className="h-3 w-3 rounded-full bg-cocoa-600" />
        </span>
        <span className="text-[11px] font-semibold tracking-[0.35em] text-cocoa-500 uppercase">
          Tap
        </span>
      </motion.button>
    </div>
  );
}
