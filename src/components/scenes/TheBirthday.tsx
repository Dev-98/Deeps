"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { her } from "@/data/people";
import { birthday } from "@/data/celebration";
import { Bokeh, Flames, LoveFall } from "@/components/ui/Celebration";
import { useTransition } from "@/components/transitions/TransitionProvider";

type Beat = "dark" | "blast" | "quiet" | "actually";

/**
 * 09 — THE BIRTHDAY.
 *
 * The theme break. Every restrained decision in the first eight chapters
 * exists so that this one can be loud: the palette finally spends itself
 * on gold and magenta and violet, her name fills the screen, and the
 * whole thing moves.
 *
 * Then it deliberately stops — the room goes quiet, the confetti drains
 * away, and the fake-out lands. That pause is the point of all the noise
 * before it.
 */
export function TheBirthday() {
  const reduced = useReducedMotion() ?? false;
  const { go } = useTransition();
  const [beat, setBeat] = useState<Beat>("dark");

  // Arrive in the dark, then detonate.
  useEffect(() => {
    const t = window.setTimeout(() => setBeat("blast"), reduced ? 200 : 700);
    return () => window.clearTimeout(t);
  }, [reduced]);

  const quieten = useCallback(() => setBeat("quiet"), []);
  const onward = useCallback(() => go("/video", "heart"), [go]);

  const loud = beat === "blast";
  const name = her.name.trim() || "You";

  return (
    <div className="relative min-h-dvh w-full overflow-hidden bg-[#0a0510]">
      {/* the ground, which only appears once it goes off */}
      <motion.div
        animate={{ opacity: beat === "dark" ? 0 : 1 }}
        transition={{ duration: 1.1, ease: "easeOut" }}
        className="mat-festival absolute inset-0"
      />

      {/* the weather */}
      <motion.div
        animate={{ opacity: loud ? 1 : 0 }}
        transition={{ duration: loud ? 0.8 : 2.2, ease: "easeInOut" }}
        className="absolute inset-0"
      >
        <Bokeh />
        <Flames />
        <LoveFall count={50} />
      </motion.div>

      {/* a soft floor so the type always has something to sit on */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(80% 55% at 50% 45%, rgba(10,5,16,0.34) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 flex min-h-dvh w-full flex-col items-center justify-center px-6 py-16">
        <AnimatePresence mode="wait">
          {/* ------------------------ the blast ------------------------ */}
          {(beat === "dark" || beat === "blast") && (
            <motion.div
              key="blast"
              exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.9 } }}
              className="flex w-full max-w-lg flex-col items-center text-center"
            >
              <motion.p
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: loud ? 1 : 0, y: loud ? 0 : 14 }}
                transition={{ duration: 0.7, delay: 0.25 }}
                className="text-[11px] font-bold tracking-[0.5em] text-champagne/80 uppercase"
              >
                {birthday.eyebrow}
              </motion.p>

              {/* her name, as big as the screen allows */}
              <motion.h1
                initial={{ opacity: 0, scale: 0.72, y: 26 }}
                animate={
                  loud
                    ? { opacity: 1, scale: 1, y: 0 }
                    : { opacity: 0, scale: 0.72, y: 26 }
                }
                transition={{
                  duration: 1.1,
                  delay: 0.35,
                  ease: [0.22, 1.4, 0.36, 1],
                }}
                className="text-goldleaf mt-4 font-[family-name:var(--font-display)] text-[clamp(3.6rem,20vw,7.5rem)] leading-[0.92] font-semibold break-words"
                style={{ filter: "drop-shadow(0 8px 30px rgba(10,5,16,0.55))" }}
              >
                {name}
              </motion.h1>

              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: loud ? 1 : 0 }}
                transition={{ duration: 0.9, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="mt-6 h-px w-40 bg-champagne/60"
              />

              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: loud ? 1 : 0, y: loud ? 0 : 12 }}
                transition={{ duration: 0.8, delay: 1.15 }}
                className="mt-6 font-[family-name:var(--font-hand)] text-3xl text-champagne"
              >
                {birthday.line}
              </motion.p>

              <motion.button
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: loud ? 1 : 0, y: loud ? 0 : 16 }}
                transition={{ duration: 0.8, delay: 2.6 }}
                whileTap={{ scale: 0.96 }}
                onClick={quieten}
                className="mt-14 rounded-full bg-[#0a0510]/70 px-8 py-3 text-sm font-bold text-champagne ring-1 ring-champagne/40 backdrop-blur-sm"
              >
                {birthday.hush}
              </motion.button>
            </motion.div>
          )}

          {/* ----------------------- the fake-out ---------------------- */}
          {(beat === "quiet" || beat === "actually") && (
            <motion.div
              key="quiet"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2, delay: 0.5 }}
              className="flex w-full max-w-sm flex-col items-center text-center"
            >
              <p className="font-[family-name:var(--font-display)] text-2xl leading-snug text-champagne/90 sm:text-3xl">
                {birthday.fakeout.one}
              </p>

              {beat === "quiet" ? (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.9, delay: 2.4 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setBeat("actually")}
                  className="mt-10 text-[10px] font-semibold tracking-[0.35em] text-champagne/45 uppercase"
                >
                  {birthday.fakeout.close}
                </motion.button>
              ) : (
                <>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.9 }}
                    className="mt-10 font-[family-name:var(--font-display)] text-4xl font-semibold text-gold sm:text-5xl"
                  >
                    {birthday.fakeout.two}
                  </motion.p>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 2 }}
                    className="mt-2 font-[family-name:var(--font-display)] text-4xl font-semibold text-gold sm:text-5xl"
                  >
                    {birthday.fakeout.three}
                  </motion.p>

                  <motion.button
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 3.2 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={onward}
                    className="mt-14 flex items-center gap-2.5 rounded-full bg-gold py-3 pr-3 pl-6 text-sm font-bold text-[#150a20] shadow-[0_20px_44px_-16px_rgba(242,193,78,0.95)]"
                  >
                    {birthday.fakeout.onward}
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#150a20] text-gold">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2.6}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-3 w-3"
                        aria-hidden
                      >
                        <path d="M5 12h14M13 6l6 6-6 6" />
                      </svg>
                    </span>
                  </motion.button>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* the celebration drains away for the fake-out */}
      <motion.div
        animate={{ opacity: beat === "quiet" || beat === "actually" ? 1 : 0 }}
        transition={{ duration: 2.2, ease: "easeInOut" }}
        className="pointer-events-none absolute inset-0 bg-[#0a0510]/78"
      />
    </div>
  );
}
