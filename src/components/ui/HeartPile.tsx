"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { HEART_PATH } from "@/components/ui/Hearts";

/**
 * The hearts don't leave. They collect.
 *
 * Once the world has bloomed, a heart lifts out of the field every couple
 * of seconds and flies up to the ceiling, where it stays. They stack in
 * neat rows and the pile grows downward the longer she stands there —
 * until the top of the pile reaches the sun, the sun flares, and the whole
 * lot is blown away. Then it quietly starts again.
 *
 * Nothing here is required and nothing is explained. It's for the person
 * who doesn't tap straight through.
 */

const COLORS = ["#ff6f9c", "#ffb3ce", "#e0457b", "#ffd9e8", "#ff8fb3", "#ff5c8d"];

type Settled = {
  key: number;
  slot: number;
  /** Where it lifted off from, as a percentage across the screen. */
  fromLeft: number;
  size: number;
  color: string;
  tilt: number;
};

export function HeartPile({
  active,
  /** How far down the screen the sun sits, in percent. The ceiling for the pile. */
  sunTop = 40,
  columns = 7,
  /** Milliseconds between one heart lifting off and the next. */
  every = 620,
}: {
  active: boolean;
  sunTop?: number;
  columns?: number;
  every?: number;
}) {
  const reduced = useReducedMotion();
  const [hearts, setHearts] = useState<Settled[]>([]);
  const [gusting, setGusting] = useState(false);
  const next = useRef(0);

  const ROW_H = 5.2; // vh per row
  const TOP = 3; // where the first row sits
  const rows = Math.max(2, Math.floor((sunTop - TOP - 2) / ROW_H));
  const capacity = rows * columns;

  /**
   * One heart at a time, forever, until the pile is full.
   *
   * Driven off the animation frame rather than setInterval on purpose:
   * browsers throttle timers to about one tick a minute in a tab that
   * isn't in front, which would leave her with a nearly empty sky. The
   * frame loop stops when the page isn't being drawn and picks up exactly
   * where it left off when she comes back, which is the behaviour we
   * actually want.
   */
  useEffect(() => {
    if (!active || reduced || gusting) return;

    let raf = 0;
    let last = performance.now();
    let owed = 0;

    const tick = (now: number) => {
      owed += now - last;
      last = now;

      if (owed >= every) {
        owed = 0;
        setHearts((prev) => {
          if (prev.length >= capacity) return prev;
          const i = next.current++;
          const r = (n: number) =>
            ((Math.sin(i * 9.137 + n * 2.71) * 43758.5453) % 1 + 1) % 1;
          return [
            ...prev,
            {
              key: i,
              slot: prev.length,
              fromLeft: 8 + r(1) * 84,
              size: 26 + r(2) * 14,
              color: COLORS[Math.floor(r(3) * COLORS.length)],
              tilt: (r(4) - 0.5) * 40,
            },
          ];
        });
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, reduced, gusting, capacity, every]);

  // Full pile: the sun takes them.
  useEffect(() => {
    if (hearts.length < capacity || gusting) return;
    const flare = window.setTimeout(() => setGusting(true), 700);
    return () => window.clearTimeout(flare);
  }, [hearts.length, capacity, gusting]);

  useEffect(() => {
    if (!gusting) return;
    const clear = window.setTimeout(() => {
      setHearts([]);
      setGusting(false);
    }, 1500);
    return () => window.clearTimeout(clear);
  }, [gusting]);

  const slots = useMemo(
    () => (slot: number) => {
      const row = Math.floor(slot / columns);
      const col = slot % columns;
      // every other row is nudged half a column across, so it stacks
      // like actual objects instead of a spreadsheet
      const offset = row % 2 ? 0.5 : 0;
      return {
        left: `${((col + 0.5 + offset) / (columns + 0.5)) * 100}%`,
        top: `${TOP + row * ROW_H}%`,
      };
    },
    [columns],
  );

  if (reduced) return null;

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* the sun flares when the pile reaches it */}
      <motion.div
        animate={
          gusting
            ? { opacity: [0, 0.85, 0], scale: [0.6, 2.4, 3.2] }
            : { opacity: 0, scale: 0.6 }
        }
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute left-1/2 h-56 w-56 -translate-x-1/2 rounded-full"
        style={{
          top: `${sunTop - 14}%`,
          background:
            "radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(255,194,218,0.6) 40%, rgba(255,143,179,0) 72%)",
        }}
      />

      <AnimatePresence>
        {hearts.map((h) => {
          const s = slots(h.slot);
          return (
            <motion.span
              key={h.key}
              initial={{
                left: `${h.fromLeft}%`,
                top: "88%",
                opacity: 0,
                scale: 0.4,
                rotate: 0,
              }}
              animate={
                gusting
                  ? {
                      left: `${h.fromLeft > 50 ? 118 : -18}%`,
                      top: `${-10 - (h.slot % 5) * 6}%`,
                      opacity: 0,
                      scale: 1.25,
                      rotate: h.tilt * 6,
                      transition: {
                        duration: 1.2,
                        delay: (h.slot % columns) * 0.03,
                        ease: [0.36, 0, 0.66, -0.56],
                      },
                    }
                  : {
                      left: s.left,
                      top: s.top,
                      opacity: 1,
                      scale: 1,
                      rotate: h.tilt,
                      transition: {
                        duration: 2.6,
                        ease: [0.22, 1, 0.36, 1],
                      },
                    }
              }
              className="absolute"
              style={{ marginLeft: -h.size / 2 }}
            >
              <svg viewBox="0 0 32 32" width={h.size} height={h.size}>
                <path d={HEART_PATH} fill={h.color} />
              </svg>
            </motion.span>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
