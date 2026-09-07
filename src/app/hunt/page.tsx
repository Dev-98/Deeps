"use client";

import { useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { huntCopy, secretDefs } from "@/data/secrets";
import { rich } from "@/lib/rich";
import { useProgress } from "@/lib/progress";
import { useTransition } from "@/components/transitions/TransitionProvider";

/**
 * 07 — THE SECRET HUNT.
 *
 * The room that only exists for someone who was looking. Deliberately
 * off the main path: nothing in the story requires it, and nothing later
 * refers to it. It's a reward, not a checkpoint.
 */
export default function HuntPage() {
  const router = useRouter();
  const { progress, ready } = useProgress();
  const { go } = useTransition();

  const found = secretDefs.filter((d) =>
    progress.secretsFound.includes(`hunt:${d.id}`),
  );

  useEffect(() => {
    if (ready && found.length < secretDefs.length) router.replace("/");
  }, [ready, found.length, router]);

  const back = useCallback(() => go("/memories", "doorway"), [go]);

  if (!ready) return <div className="min-h-dvh w-full bg-[#0a0510]" />;

  return (
    <main
      className="relative flex min-h-dvh w-full flex-col items-center justify-center overflow-hidden px-7 py-16"
      style={{
        background:
          "radial-gradient(90% 55% at 50% 18%, rgba(242,193,78,0.16) 0%, transparent 60%), linear-gradient(180deg,#150a20 0%,#0a0510 100%)",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-sm text-center"
      >
        <p className="text-[10px] font-semibold tracking-[0.4em] text-gold uppercase">
          {huntCopy.eyebrow}
        </p>
        <h1 className="mt-4 font-[family-name:var(--font-display)] text-3xl leading-tight font-semibold text-champagne sm:text-4xl">
          {huntCopy.title}
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-champagne/60">
          {huntCopy.body}
        </p>

        <ul className="mt-9 space-y-0 text-left">
          {secretDefs.map((s, i) => (
            <motion.li
              key={s.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 + i * 0.12 }}
              className="flex items-center gap-3 border-b border-gold/15 py-2.5 last:border-b-0"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                strokeLinecap="round"
                className="h-3.5 w-3.5 shrink-0 text-gold"
                aria-hidden
              >
                <path d="M4 12l5 5L20 6" />
              </svg>
              <span className="text-sm text-champagne/75">{s.where}</span>
            </motion.li>
          ))}
        </ul>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.3 }}
          className="mt-9 font-[family-name:var(--font-hand)] text-2xl leading-snug text-gold"
        >
          {rich(huntCopy.reward)}
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.7 }}
          whileTap={{ scale: 0.96 }}
          onClick={back}
          className="mt-10 rounded-full bg-gold px-8 py-3 text-sm font-bold text-[#150a20] shadow-[0_18px_40px_-16px_rgba(242,193,78,0.9)]"
        >
          {huntCopy.onward}
        </motion.button>
      </motion.div>
    </main>
  );
}
