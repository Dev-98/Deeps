"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useTransition } from "@/components/transitions/TransitionProvider";
import { useProgress } from "@/lib/progress";
import { wish } from "@/data/celebration";

/**
 * 08 — THE WISH.
 *
 * The lights go out here. One cake, one flame, and the flame is the only
 * light source in the room — everything else is lit by it. Blowing it out
 * takes the screen to black, and black is where the birthday starts.
 *
 * This is the hinge of the whole thing: the last quiet moment before the
 * palette stops holding back.
 */
export function TheWish() {
  const reduced = useReducedMotion() ?? false;
  const { go } = useTransition();
  const { update } = useProgress();
  const [blown, setBlown] = useState(false);
  const [step, setStep] = useState(0);

  /** Close your eyes → make a wish → blow it out, on their own timing. */
  useEffect(() => {
    if (blown) return;
    const a = window.setTimeout(() => setStep(1), reduced ? 900 : 3200);
    const b = window.setTimeout(() => setStep(2), reduced ? 1600 : 6600);
    return () => {
      window.clearTimeout(a);
      window.clearTimeout(b);
    };
  }, [blown, reduced]);

  const armed = step >= 2;

  const blowOut = useCallback(() => {
    if (blown || !armed) return;
    setBlown(true);
    update({ finalUnlocked: true });
    // The smoke, the dark, and then long enough on the black for her to
    // actually read the line before the celebration takes the screen.
    window.setTimeout(() => go("/birthday", "sweep"), reduced ? 1200 : 6200);
  }, [blown, armed, update, go, reduced]);

  return (
    <div className="mat-dark-room relative flex min-h-dvh w-full flex-col items-center justify-center overflow-hidden px-6">
      {/* the light the candle throws into the room */}
      <motion.div
        animate={{ opacity: blown ? 0 : 1 }}
        transition={{ duration: blown ? 1.2 : 0.6, ease: "easeOut" }}
        className="pointer-events-none absolute inset-0"
      >
        <div
          className={`absolute top-[26%] left-1/2 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full ${
            reduced ? "" : "anim-candle-glow"
          }`}
          style={{
            background:
              "radial-gradient(circle, rgba(255,196,110,0.30) 0%, rgba(255,157,60,0.12) 34%, transparent 66%)",
          }}
        />
      </motion.div>

      {/* everything goes out */}
      <motion.div
        animate={{ opacity: blown ? 1 : 0 }}
        transition={{ duration: 2.4, delay: blown ? 0.6 : 0, ease: "easeIn" }}
        className="pointer-events-none absolute inset-0 z-30 bg-black"
      />

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: blown ? 0 : 1 }}
        transition={{ duration: 1.1, delay: blown ? 0 : 0.5 }}
        className="relative z-10 text-[10px] font-semibold tracking-[0.4em] text-flame/70 uppercase"
      >
        {wish.eyebrow}
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: blown ? 0 : 1, y: 0 }}
        transition={{ duration: 1.1, delay: blown ? 0 : 0.9 }}
        className="relative z-10 mt-4 text-center font-[family-name:var(--font-display)] text-2xl leading-snug font-semibold text-[#ffe3bd] sm:text-3xl"
      >
        {wish.title}
      </motion.h1>

      {/* -------------------------- the cake -------------------------- */}
      <motion.button
        onClick={blowOut}
        disabled={blown || !armed}
        whileTap={blown || !armed ? undefined : { scale: 0.98 }}
        aria-label="Blow out the candle"
        className="relative z-10 mt-14 flex flex-col items-center disabled:cursor-default"
      >
        {/* flame */}
        <span className="relative mb-1 flex h-16 w-8 items-end justify-center">
          <AnimatePresence>
            {!blown && (
              <motion.span
                key="flame"
                exit={{
                  scaleY: 0.15,
                  scaleX: 0.5,
                  opacity: 0,
                  y: 6,
                  transition: { duration: 0.32, ease: "easeIn" },
                }}
                className={`relative block ${reduced ? "" : "anim-flame"}`}
                style={{ transformOrigin: "50% 100%" }}
              >
                <span
                  className="block h-9 w-[14px] rounded-[50%_50%_50%_50%/60%_60%_40%_40%]"
                  style={{
                    background:
                      "radial-gradient(ellipse at 50% 72%, #fff6e2 0%, #ffd166 32%, #ff9d3c 62%, rgba(224,69,123,0.55) 88%, transparent 100%)",
                    boxShadow: "0 0 26px 10px rgba(255,157,60,0.55)",
                  }}
                />
                <span
                  className="absolute bottom-1 left-1/2 h-3 w-[6px] -translate-x-1/2 rounded-full"
                  style={{ background: "rgba(255,255,255,0.85)" }}
                />
              </motion.span>
            )}
          </AnimatePresence>

          {/* smoke, once it's out */}
          <AnimatePresence>
            {blown && !reduced && (
              <>
                {[0, 1, 2].map((n) => (
                  <motion.span
                    key={n}
                    initial={{ opacity: 0, y: 0, scale: 0.6 }}
                    animate={{ opacity: [0, 0.5, 0], y: -90 - n * 26, scale: 2.4 }}
                    transition={{ duration: 2.6, delay: n * 0.25, ease: "easeOut" }}
                    className="absolute bottom-2 h-6 w-6 rounded-full"
                    style={{
                      background:
                        "radial-gradient(circle, rgba(230,220,210,0.55), transparent 70%)",
                      left: `${40 + n * 6}%`,
                    }}
                  />
                ))}
              </>
            )}
          </AnimatePresence>
        </span>

        {/* wick + candle */}
        <span className="relative z-10 block h-14 w-3 rounded-t-sm bg-gradient-to-b from-[#fdf3e2] via-[#f6e6cc] to-[#e8d3b4] shadow-[inset_-2px_0_3px_rgba(0,0,0,0.18)]">
          <span className="absolute -top-1 left-1/2 h-2 w-[2px] -translate-x-1/2 rounded-full bg-[#3d2511]" />
          {/* wax running down one side */}
          <span className="absolute top-4 -left-[1px] h-6 w-[4px] rounded-b-full bg-[#fdf3e2]/85" />
          <span className="absolute top-7 -right-[1px] h-4 w-[3px] rounded-b-full bg-[#fdf3e2]/70" />
        </span>

        {/* ---------------------------------------------------------------
            Five tiers, largest at the bottom. Every tier is centred on the
            same axis as the candle — the frosting, the drips and the plate
            are all children of their own tier, so nothing can drift out of
            alignment the way a single stacked block could.
        ---------------------------------------------------------------- */}
        <span className="relative -mt-1 flex flex-col items-center">
          {STACK.map((tier, i) => (
            <span
              key={i}
              className="relative block"
              style={{ width: tier.w, height: tier.h, marginTop: i === 0 ? 0 : -1 }}
            >
              {/* the sponge */}
              <span
                className="absolute inset-0 block"
                style={{
                  background: tier.sponge,
                  borderRadius: i === 0 ? "10px 10px 4px 4px" : "8px",
                  boxShadow:
                    "0 1px 0 rgba(255,240,215,0.35) inset, 0 10px 20px -12px rgba(0,0,0,0.95)",
                }}
              />

              {/* frosting across the top of this tier, centred by construction */}
              <span
                className="absolute inset-x-0 top-0 block overflow-hidden"
                style={{ height: tier.frost, borderRadius: "8px 8px 0 0" }}
              >
                <span
                  className="absolute inset-0 block"
                  style={{ background: "linear-gradient(180deg,#fff6e8,#f3e2c8)" }}
                />
                {/* drips, evenly spaced from the centre out */}
                <span className="absolute inset-x-0 bottom-0 flex translate-y-1/2 justify-center gap-[7px]">
                  {Array.from({ length: tier.drips }, (_, d) => (
                    <span
                      key={d}
                      className="block w-[7px] rounded-b-full bg-[#f3e2c8]"
                      style={{ height: 5 + ((d * 4) % 7) }}
                    />
                  ))}
                </span>
              </span>

              {/* one cherry on the top tier */}
              {i === 0 && (
                <span className="absolute -top-1.5 left-1/2 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-[#c9556b] shadow-[0_0_8px_rgba(201,85,107,0.7)]" />
              )}
            </span>
          ))}

          {/* the plate, centred under the whole stack */}
          <span className="mt-1 block h-2 w-[17rem] rounded-full bg-[#2a190c] shadow-[0_12px_26px_-8px_rgba(0,0,0,0.95)]" />
          <span className="-mt-[3px] block h-1 w-[13rem] rounded-full bg-[#1a0f07]/70" />
        </span>

      </motion.button>

      {/* close your eyes → make a wish → blow it out */}
      <div className="relative z-10 mt-12 flex h-20 flex-col items-center justify-start">
        <AnimatePresence mode="wait">
          {!blown && (
            <motion.p
              key={step}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="text-center font-[family-name:var(--font-display)] text-xl text-[#ffe3bd] sm:text-2xl"
            >
              {wish.steps[step]}
            </motion.p>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {armed && !blown && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9, delay: 0.8 }}
              className="mt-4 text-[10px] font-semibold tracking-[0.35em] text-[#ffe3bd]/55 uppercase"
            >
              {wish.hint}
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/*
        The line on the black. This sits above the blackout layer (z-50 to
        its z-30) and is the reason the chapter exists, so it is full
        strength and it holds — an earlier version of this never rendered
        at all, and the one before that was too faint to read.
      */}
      <AnimatePresence>
        {blown && (
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.6, delay: 2.2, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-none absolute inset-x-0 top-1/2 z-50 -translate-y-1/2 px-10 text-center font-[family-name:var(--font-hand)] text-4xl leading-snug text-[#ffe9b0] sm:text-5xl"
            style={{ textShadow: "0 0 34px rgba(255,214,148,0.55)" }}
          >
            {wish.after}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * The cake, bottom tier first. Widths shrink and the candle sits on the
 * centre line of every one of them.
 */
const TIERS = [
  { w: 220, h: 34, frost: 13, drips: 9, sponge: "linear-gradient(180deg,#8a5f3c 0%,#6d4526 45%,#3d2511 100%)" },
  { w: 182, h: 30, frost: 12, drips: 7, sponge: "linear-gradient(180deg,#96694333 0%,#6d4526 40%,#42280f 100%)" },
  { w: 144, h: 27, frost: 11, drips: 6, sponge: "linear-gradient(180deg,#8a5f3c 0%,#5c3a1c 45%,#3d2511 100%)" },
  { w: 108, h: 24, frost: 10, drips: 4, sponge: "linear-gradient(180deg,#966943 0%,#6d4526 45%,#42280f 100%)" },
  { w: 74, h: 21, frost: 9, drips: 3, sponge: "linear-gradient(180deg,#8a5f3c 0%,#5c3a1c 50%,#3d2511 100%)" },
];

/** Rendered top-down, so the narrowest tier is the one the candle stands on. */
const STACK = [...TIERS].reverse();
