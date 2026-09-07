"use client";

import { useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { final } from "@/data/finale";
import { her } from "@/data/people";
import { rich } from "@/lib/rich";
import { ChocolateBits } from "@/components/ui/ChocolateBits";
import { useProgress } from "@/lib/progress";

/**
 * FINAL — ONE MORE YEAR.
 *
 * Back to the cream and cocoa of the very first screen, on purpose: the
 * story has come all the way round. No confetti, no gold, no buttons
 * except the one that starts it again. The loudest thing here is the
 * white space.
 */
export default function FinalPage() {
  const router = useRouter();
  const { progress, ready, reset } = useProgress();

  useEffect(() => {
    if (ready && !progress.worldBloomed) router.replace("/");
  }, [ready, progress.worldBloomed, router]);

  const again = useCallback(() => {
    reset();
    router.push("/");
  }, [reset, router]);

  if (!ready) return <div className="min-h-dvh w-full bg-cream" />;

  return (
    <main className="paper-grain vignette relative flex min-h-dvh w-full flex-col items-center justify-center overflow-hidden bg-cream px-8 py-20">
      <ChocolateBits opacity={0.16} />

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md text-center"
      >
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.8 }}
          className="font-[family-name:var(--font-display)] text-xl leading-relaxed text-cocoa-700 sm:text-2xl"
        >
          {rich(final.line)}
        </motion.p>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.1, delay: 2, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-10 h-px w-24 bg-caramel/60"
        />

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 2.5 }}
          className="mt-10 font-[family-name:var(--font-hand)] text-4xl text-caramel sm:text-5xl"
        >
          {final.closing}, {her.name.trim() || "you"}.
        </motion.p>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 4 }}
          onClick={again}
          className="mt-20 text-[10px] font-semibold tracking-[0.35em] text-mocha/45 uppercase"
        >
          {final.replay}
        </motion.button>
      </motion.div>
    </main>
  );
}
