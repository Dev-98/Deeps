"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Scene } from "@/components/ui/Scene";
import { SoftButton } from "@/components/ui/SoftButton";
import { chapters } from "@/data/chapters";
import { useProgress } from "@/lib/progress";

/**
 * The end of what exists. Not a 404 and not an apology — a landing, so the
 * run she just made has somewhere to finish. It disappears the day chapter
 * 03 is built and this route redirects onward instead.
 */
export default function EndPage() {
  const router = useRouter();
  const { progress, ready, reset } = useProgress();

  // Every chapter exists now; this card is only reachable by an old link.
  useEffect(() => {
    if (ready) router.replace(progress.worldBloomed ? "/final" : "/");
  }, [ready, progress.worldBloomed, router]);

  const done = chapters.filter((c) => c.built).length;
  const left = chapters.length - done;

  return (
    <Scene className="bg-gradient-to-b from-[#f6e7d0] to-cream" vignette>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-sm text-center"
      >
        <p className="text-[10px] font-semibold tracking-[0.4em] text-caramel uppercase">
          End of the road — for now
        </p>

        <h1 className="mt-4 font-[family-name:var(--font-display)] text-3xl leading-tight font-semibold text-cocoa-800 sm:text-4xl">
          That&rsquo;s the first {done} chapters.
        </h1>

        <p className="mt-4 text-sm leading-relaxed text-mocha">
          There are {left} more, and one of them is the actual reason for all
          of this. They aren&rsquo;t built yet.
        </p>

        <ol className="mt-9 space-y-0 text-left">
          {chapters.map((c) => (
            <li
              key={c.n}
              className="flex items-center gap-3 border-b border-cocoa-300/25 py-2.5 last:border-b-0"
            >
              <span
                className={`w-6 shrink-0 font-[family-name:var(--font-display)] text-xs ${
                  c.built ? "text-caramel" : "text-cocoa-300"
                }`}
              >
                {c.n}
              </span>
              <span
                className={`flex-1 text-sm ${
                  c.built ? "font-medium text-cocoa-700" : "text-cocoa-400"
                }`}
              >
                {c.title}
              </span>
              <span
                className={`text-[9px] font-semibold tracking-[0.2em] uppercase ${
                  c.built ? "text-caramel" : "text-cocoa-300"
                }`}
              >
                {c.built ? "Built" : "Soon"}
              </span>
            </li>
          ))}
        </ol>

        <p className="mt-8 font-[family-name:var(--font-hand)] text-xl text-cocoa-500">
          {done} of {chapters.length}. Keep going.
        </p>

        <div className="mt-8 flex justify-center">
          <SoftButton
            onClick={() => {
              reset();
              router.push("/");
            }}
          >
            Run it again
          </SoftButton>
        </div>
      </motion.div>
    </Scene>
  );
}
