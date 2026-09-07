"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { beforeYouLines, bloomLine } from "@/data/beforeYou";
import { rich } from "@/lib/rich";
import { useIsomorphicLayoutEffect } from "@/components/animations/useIsomorphicLayoutEffect";
import { Heart } from "@/components/ui/Hearts";
import { HeartPile } from "@/components/ui/HeartPile";

type Props = {
  /** Called only when she taps to leave the bloomed world. */
  onLeave: () => void;
};

/**
 * A place, not a text slide.
 *
 * The world underneath is always painted in full colour — a pink sky over
 * a blue evening world. Two overlays sit on top (one drains the colour,
 * one keeps it at night) and each line she reads pulls both of them back
 * a little.
 *
 * What's waiting underneath is not a sunrise. It's a field of hearts.
 */
export function BeforeYou({ onLeave }: Props) {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [blooming, setBlooming] = useState(false);
  const [settledIn, setSettledIn] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const isLast = index === beforeYouLines.length - 1;
  const mood = MOOD[Math.min(index, MOOD.length - 1)];

  function advance() {
    if (blooming) return;
    if (!isLast) {
      setIndex((i) => i + 1);
      return;
    }
    setBlooming(true);
  }

  useIsomorphicLayoutEffect(() => {
    if (!blooming) return;

    if (reduced) {
      const t = window.setTimeout(() => setSettledIn(true), 1400);
      return () => window.clearTimeout(t);
    }

    const ctx = gsap.context(() => {
      gsap
        .timeline({ onComplete: () => setSettledIn(true) })
        // dawn
        .to(".layer-drain", { opacity: 0, duration: 2.4, ease: "power2.inOut" })
        .to(".layer-night", { opacity: 0, duration: 2.4, ease: "power2.inOut" }, "<")
        .to(".sky-stars", { opacity: 0, duration: 1.1 }, "<")
        .to(".sky-moon", { y: -40, opacity: 0, duration: 1.6, ease: "power2.in" }, "<")
        .to(".sky-sun", { y: 0, opacity: 1, duration: 2.6, ease: "power2.out" }, "<0.2")
        // the field fills in
        .to(
          ".bloom-prop",
          {
            scaleY: 1,
            opacity: 1,
            duration: 0.85,
            ease: "back.out(2.2)",
            stagger: { each: 0.045, from: "center" },
          },
          "-=1.7",
        )
        // and then you happened
        .to(
          ".figure-her",
          { x: 0, opacity: 1, duration: 1.2, ease: "power3.out" },
          "-=0.8",
        )
        .to(".figure-me", { x: -4, duration: 1.2, ease: "power3.out" }, "<")
        .to(".bloom-line", { opacity: 1, y: 0, duration: 1 }, "-=0.4")
        .to({}, { duration: 0.5 });
    }, rootRef);

    return () => ctx.revert();
  }, [blooming, reduced]);

  /** Under reduced motion the same states are reached, just without the show. */
  const settled = blooming && reduced;

  return (
    <div
      ref={rootRef}
      className={`relative min-h-dvh w-full overflow-hidden ${
        blooming && !reduced ? "bloom-running" : ""
      }`}
    >
      {/* ------------------------- the world ------------------------- */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#f6bcd8] via-[#ffd4e6] to-[#ffe9f0]" />
        {/* a cooler wash at the edges, so the pink sits in something blue */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 80% at 50% 78%, transparent 30%, rgba(109,129,171,0.45) 88%)",
          }}
        />

        {/* the sun, waiting just under the horizon */}
        <div
          className="sky-sun absolute left-1/2 h-48 w-48 rounded-full opacity-0"
          style={{
            top: "40%",
            transform: settled
              ? "translate(-50%, 0)"
              : "translate(-50%, 110px)",
            opacity: settled ? 1 : undefined,
            background:
              "radial-gradient(circle, #fffafc 0%, #ffc2da 40%, rgba(255,143,179,0) 72%)",
          }}
        />

        <div
          className="sky-moon absolute top-[12%] right-[18%] h-11 w-11 rounded-full bg-[#f3ede1] shadow-[0_0_50px_16px_rgba(243,237,225,0.4)]"
          style={{ opacity: settled ? 0 : 1 }}
        />
        <div
          className="sky-stars absolute inset-0"
          style={{ opacity: settled ? 0 : 1 }}
        >
          {STARS.map((s, i) => (
            <span
              key={i}
              className="absolute rounded-full bg-white"
              style={{ left: s.x, top: s.y, width: s.r, height: s.r, opacity: s.o }}
            />
          ))}
        </div>

        {/* hills */}
        <svg
          viewBox="0 0 100 40"
          preserveAspectRatio="none"
          className="absolute inset-x-0 bottom-[24%] h-[20%] w-full"
          aria-hidden
        >
          <path
            d="M0 40 L0 24 Q 16 10 30 21 T 58 17 Q 74 6 88 19 T 100 15 L100 40 Z"
            fill="#9fb0d9"
            opacity="0.62"
          />
        </svg>
        <svg
          viewBox="0 0 100 40"
          preserveAspectRatio="none"
          className="absolute inset-x-0 bottom-[21%] h-[15%] w-full"
          aria-hidden
        >
          <path
            d="M0 40 L0 27 Q 22 15 42 25 T 76 21 Q 90 13 100 23 L100 40 Z"
            fill="#6d81ab"
            opacity="0.7"
          />
        </svg>

        {/* the ground */}
        <div className="absolute inset-x-0 bottom-0 h-[22%] bg-gradient-to-b from-[#7d90bd] to-[#3b4a72]" />

        {/* what grows when the world blooms — a field of hearts */}
        <div className="pointer-events-none absolute inset-x-0 bottom-[21.5%] h-[16%]">
          {PROPS.map((p, i) => (
            <span
              key={i}
              aria-hidden
              className="bloom-prop absolute bottom-0 flex origin-bottom flex-col items-center"
              style={{
                left: p.x,
                opacity: settled ? 1 : 0,
                transform: settled ? "scaleY(1)" : "scaleY(0)",
              }}
            >
              <span
                className={reduced ? "" : "anim-heart-beat"}
                style={
                  {
                    "--dur": `${2 + (i % 5) * 0.35}s`,
                    "--delay": `${(i % 7) * 0.28}s`,
                  } as React.CSSProperties
                }
              >
                <Heart size={p.w} color={p.c} />
              </span>
              <span
                className="block w-[2px] rounded-full"
                style={{ height: p.h, background: "#5c6f9c" }}
              />
            </span>
          ))}
        </div>

        {/*
          And hearts lifting out of it — which don't leave. They gather at
          the top of the sky and pile up for as long as she stands here.
        */}
        {(blooming || settled) && <HeartPile active sunTop={40} />}

        {/* the two of you, standing off to one side */}
        <div className="pointer-events-none absolute bottom-[21.5%] left-[26%] flex items-end gap-2">
          <Figure className="figure-me" tone="#2b3352" height={72} />
          <Figure
            className="figure-her"
            tone="#3f4a72"
            height={66}
            style={{
              opacity: settled ? 1 : 0,
              transform: settled ? "none" : "translateX(-30px)",
            }}
          />
        </div>

        {/* ---- the mood, pulled back one line at a time ---- */}
        <div
          className="layer-drain pointer-events-none absolute inset-0"
          style={{
            background: "#6f6a66",
            mixBlendMode: "color",
            opacity: settled ? 0 : blooming ? undefined : mood.drain,
          }}
        />
        <div
          className="layer-night pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, #0b0805 0%, #17100a 58%, #241a10 100%)",
            opacity: settled ? 0 : blooming ? undefined : mood.night,
          }}
        />
      </div>

      {/* ------------------------- the words ------------------------- */}
      <button
        onClick={advance}
        disabled={blooming}
        aria-label="Continue"
        className="absolute inset-0 z-10 w-full cursor-pointer disabled:cursor-default"
      >
        {/* the line sits in the sky, clear of the landscape */}
        <span className="absolute inset-x-0 top-0 flex h-[62%] items-center justify-center px-8">
          <span className="relative flex w-full max-w-xl items-center justify-center">
            <AnimatePresence mode="wait" initial={false}>
              {!blooming && (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, y: 18, filter: "blur(9px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -18, filter: "blur(9px)" }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className="anim-fade block text-center font-[family-name:var(--font-display)] text-[1.75rem] leading-[1.3] text-[#fdf7ec] drop-shadow-[0_3px_24px_rgba(11,8,5,0.9)] sm:text-[2.6rem]"
                >
                  {rich(beforeYouLines[index])}
                </motion.span>
              )}
            </AnimatePresence>

            <span className="bloom-line absolute inset-x-0 translate-y-5 text-center font-[family-name:var(--font-display)] text-[1.6rem] leading-[1.3] font-semibold text-[#5a2340] opacity-0 sm:text-[2.2rem]">
              {rich(bloomLine)}
            </span>
          </span>
        </span>

        {!blooming && (
          <span className="absolute inset-x-0 bottom-10 flex flex-col items-center gap-3">
            <span className="text-[10px] font-semibold tracking-[0.35em] text-[#fdf7ec]/75 uppercase drop-shadow-[0_1px_8px_rgba(11,8,5,0.9)]">
              {isLast ? "Tap" : "Tap to continue"}
            </span>
            <span className="flex gap-1.5">
              {beforeYouLines.map((_, i) => (
                <span
                  key={i}
                  className={`h-1 rounded-full transition-all duration-500 ${
                    i <= index ? "w-7 bg-[#ff8fb3]" : "w-2.5 bg-[#fdf7ec]/35"
                  }`}
                />
              ))}
            </span>
          </span>
        )}
      </button>

      {/* the world has bloomed — she leaves when she's ready, not before */}
      <AnimatePresence>
        {settledIn && (
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-x-0 bottom-12 z-20 flex flex-col items-center gap-4"
          >
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={onLeave}
              className="flex items-center gap-2.5 rounded-full bg-[#e0457b] py-3 pr-3 pl-6 text-sm font-bold text-[#fff2f7] shadow-[0_16px_38px_-14px_rgba(224,69,123,0.95)]"
            >
              Show me
              <span className="relative flex h-6 w-6 items-center justify-center rounded-full bg-[#fff2f7]">
                {!reduced && (
                  <motion.span
                    animate={{ scale: [1, 1.6], opacity: [0.6, 0] }}
                    transition={{ duration: 1.9, repeat: Infinity, ease: "easeOut" }}
                    className="absolute inset-0 rounded-full border border-[#ffd9e8]"
                  />
                )}
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#e0457b"
                  strokeWidth={2.4}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-3 w-3"
                  aria-hidden
                >
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** A person, drawn as simply as a person can be drawn. */
function Figure({
  className,
  tone,
  height,
  style,
}: {
  className: string;
  tone: string;
  height: number;
  style?: React.CSSProperties;
}) {
  const width = Math.round(height * 0.42);
  return (
    <span
      className={`${className} relative block`}
      style={{ width, height, ...style }}
      aria-hidden
    >
      <span
        className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-t-full"
        style={{ width, height: height * 0.72, background: tone }}
      />
      <span
        className="absolute top-0 left-1/2 -translate-x-1/2 rounded-full"
        style={{ width: width * 0.66, height: width * 0.66, background: tone }}
      />
    </span>
  );
}

/** How grey and how dark the world is at each line. */
const MOOD = [
  { drain: 0.97, night: 0.7 },
  { drain: 0.9, night: 0.58 },
  { drain: 0.76, night: 0.44 },
  { drain: 0.58, night: 0.3 },
];

const STARS = [
  { x: "10%", y: "9%", r: 3, o: 0.95 },
  { x: "23%", y: "20%", r: 2, o: 0.7 },
  { x: "37%", y: "7%", r: 2, o: 0.85 },
  { x: "46%", y: "25%", r: 3, o: 0.6 },
  { x: "57%", y: "12%", r: 2, o: 0.9 },
  { x: "68%", y: "23%", r: 2, o: 0.65 },
  { x: "79%", y: "8%", r: 3, o: 0.85 },
  { x: "89%", y: "19%", r: 2, o: 0.7 },
  { x: "5%", y: "29%", r: 2, o: 0.55 },
  { x: "32%", y: "33%", r: 2, o: 0.5 },
  { x: "63%", y: "34%", r: 2, o: 0.55 },
  { x: "93%", y: "31%", r: 2, o: 0.6 },
];

/**
 * The field that arrives with the bloom.
 * `w` is the size of the heart, `h` the length of the stem it sits on.
 */
const PROPS = [
  { x: "3%", w: 22, h: 22, c: "#ff8fb3" },
  { x: "9%", w: 14, h: 38, c: "#e0457b" },
  { x: "15%", w: 26, h: 16, c: "#ffb3ce" },
  { x: "22%", w: 13, h: 30, c: "#ff6f9c" },
  { x: "30%", w: 19, h: 24, c: "#ffd9e8" },
  { x: "38%", w: 24, h: 18, c: "#ff8fb3" },
  { x: "45%", w: 15, h: 42, c: "#e0457b" },
  { x: "52%", w: 20, h: 14, c: "#ffb3ce" },
  { x: "58%", w: 13, h: 26, c: "#ff6f9c" },
  { x: "65%", w: 25, h: 20, c: "#ffd9e8" },
  { x: "72%", w: 15, h: 36, c: "#ff8fb3" },
  { x: "79%", w: 21, h: 15, c: "#e0457b" },
  { x: "86%", w: 14, h: 32, c: "#ff6f9c" },
  { x: "93%", w: 23, h: 19, c: "#ffb3ce" },
];
