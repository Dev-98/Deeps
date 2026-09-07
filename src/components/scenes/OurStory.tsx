"use client";

import { useCallback, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { mapIntro, memories, type Memory } from "@/data/memories";
import { RisingHearts } from "@/components/ui/Hearts";
import { MemoryIcon } from "@/components/ui/MemoryIcon";
import { MemoryScene } from "@/components/scenes/MemoryScene";
import { Toast } from "@/components/ui/Toast";
import { Secret } from "@/components/ui/Secret";
import { useTransition } from "@/components/transitions/TransitionProvider";
import { useProgress } from "@/lib/progress";

/**
 * 02 — OUR STORY.
 * Not a vertical timeline. A small illustrated country with places in it.
 * The camera zooms into a place until the map becomes the memory.
 */
export function OurStory() {
  const reduced = useReducedMotion();
  const { progress, addToList } = useProgress();
  const { go } = useTransition();
  const [open, setOpen] = useState<Memory | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const opened = progress.unlockedMemories;

  const isAvailable = useMemo(
    () => (m: Memory) => !m.unlockedBy || opened.includes(m.unlockedBy),
    [opened],
  );

  const allFound = memories.every((m) => opened.includes(m.id));

  const goOnward = useCallback(() => go("/game", "doorway"), [go]);

  function tap(memory: Memory) {
    if (!isAvailable(memory)) {
      flash("Not yet — there's somewhere you haven't been.");
      return;
    }
    const first = !opened.includes(memory.id);
    addToList("unlockedMemories", memory.id);
    setOpen(memory);
    if (first) window.setTimeout(() => flash("Memory unlocked"), 700);
  }

  function flash(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(null), 2200);
  }

  /** The camera pushes toward whichever place is being entered. */
  const camera = open
    ? { scale: reduced ? 1 : 1.55, x: `${(50 - open.x) * 1.1}%`, y: `${(50 - open.y) * 1.1}%` }
    : { scale: 1, x: "0%", y: "0%" };

  return (
    <div className="relative flex min-h-dvh w-full flex-col items-center justify-center overflow-hidden">
      {/*
        The map keeps the world chapter 01 bloomed into: a pink sky over a
        blue evening. The romance runs through the middle of the story
        rather than waiting for the birthday to arrive.
      */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg,#f7cfe0 0%,#f4d6e4 34%,#dfd3e8 62%,#c9cee4 100%)",
        }}
      />
      <RisingHearts count={9} from="88%" opacity={0.35} />
      <header className="pointer-events-none absolute top-10 z-20 px-6 text-center">
        <p className="text-[10px] font-semibold tracking-[0.4em] text-[#c9556b] uppercase">
          Chapter Two
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-semibold text-[#5a2340] sm:text-4xl">
          {mapIntro.title}
        </h1>
        <p className="mt-2 text-sm text-[#7c5a72]">
          {allFound ? mapIntro.complete : mapIntro.subtitle}
        </p>
      </header>

      <motion.div
        animate={camera}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="relative aspect-[4/5] w-full max-w-xl sm:aspect-[16/10]"
      >
        {/* the land */}
        <div
          className="absolute inset-4 rounded-[2.5rem]"
          style={{
            background:
              "linear-gradient(150deg,#ffeaf3 0%,#fbdcea 38%,#e6d9ef 68%,#c8d2ea 100%)",
            boxShadow:
              "inset 0 0 60px rgba(109,129,171,0.22), 0 24px 50px -30px rgba(90,70,120,0.5)",
          }}
        />

        {/* soft terrain, so it reads as a place and not a chart */}
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-4 h-[calc(100%-2rem)] w-[calc(100%-2rem)] rounded-[2.5rem]"
          aria-hidden
        >
          <ellipse cx="24" cy="86" rx="23" ry="10" fill="#9fb0d9" opacity="0.3" />
          <ellipse cx="74" cy="14" rx="25" ry="10" fill="#ffb3ce" opacity="0.28" />
          <ellipse cx="60" cy="58" rx="16" ry="7" fill="#9fb0d9" opacity="0.2" />
          {/* the river */}
          <path
            d="M2 44 Q 20 34 34 46 T 66 42 T 98 50"
            fill="none"
            stroke="#7f93c4"
            strokeOpacity="0.35"
            strokeWidth="5"
            vectorEffect="non-scaling-stroke"
          />
        </svg>



        {/* something small, up in the hills */}
        <Secret
          id="map"
          kind="star"
          className="text-[#7b8dc0]/85"
          style={{ left: "63%", top: "13%" }}
          onFound={() => flash("You found something.")}
        />

        {/* the road between places */}
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full"
          aria-hidden
        >
          <path
            d={roadThrough(memories)}
            fill="none"
            stroke="#c9556b"
            strokeOpacity="0.45"
            strokeWidth="0.6"
            strokeDasharray="2 2.4"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        {/* the places */}
        {memories.map((memory, i) => {
          const available = isAvailable(memory);
          const visited = opened.includes(memory.id);

          return (
            <motion.button
              key={memory.id}
              onClick={() => tap(memory)}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + i * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              whileTap={{ scale: 0.9 }}
              style={{ left: `${memory.x}%`, top: `${memory.y}%` }}
              aria-label={available ? memory.title : "Locked place"}
              className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
            >
              <span
                className={[
                  "relative flex h-12 w-12 items-center justify-center rounded-full border transition-colors",
                  available
                    ? visited
                      ? "border-[#e0457b] bg-[#e0457b] text-[#fff2f7] shadow-[0_8px_20px_-8px_rgba(224,69,123,0.9)]"
                      : "border-[#c9556b]/70 bg-[#fffafc] text-[#c9556b]"
                    : "border-[#8fa0c9]/45 bg-[#dfe4f2]/50 text-[#7f93c4]/70",
                ].join(" ")}
              >
                {available && !visited && !reduced && (
                  <motion.span
                    animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                    className="absolute inset-0 rounded-full border border-[#e0457b]"
                  />
                )}
                <MemoryIcon
                  name={available ? memory.icon : "lock"}
                  className="h-5 w-5"
                />
              </span>
              {available && (
                <span className="mt-2 block max-w-[7rem] text-center text-[11px] leading-tight font-semibold tracking-wide text-[#6d3550]">
                  {memory.title}
                </span>
              )}
            </motion.button>
          );
        })}
      </motion.div>

      <footer className="absolute bottom-9 z-20 flex flex-col items-center gap-4">
        <span className="text-[10px] font-semibold tracking-[0.3em] text-[#7c5a72]/75 uppercase">
          {opened.length} / {memories.length} Places
        </span>

        <AnimatePresence>
          {allFound && !open && (
            <motion.button
              key="onward"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
              whileTap={{ scale: 0.96 }}
              onClick={goOnward}
              className="flex items-center gap-2.5 rounded-full bg-[#e0457b] py-2.5 pr-3 pl-5 text-[#fff2f7] shadow-[0_14px_34px_-12px_rgba(224,69,123,0.95)]"
            >
              <span className="text-sm font-semibold">Something just opened</span>
              <span className="relative flex h-6 w-6 items-center justify-center rounded-full bg-[#fff2f7]">
                {!reduced && (
                  <motion.span
                    animate={{ scale: [1, 1.6], opacity: [0.6, 0] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
                    className="absolute inset-0 rounded-full border border-[#e0457b]"
                  />
                )}
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#2a190c"
                  strokeWidth={2.2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-3 w-3"
                  aria-hidden
                >
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </span>
            </motion.button>
          )}
        </AnimatePresence>
      </footer>

      <AnimatePresence>
        {open && <MemoryScene memory={open} onClose={() => setOpen(null)} />}
      </AnimatePresence>

      <Toast message={toast} />

    </div>
  );
}

/** A soft path threading the pins in order. */
function roadThrough(list: Memory[]) {
  if (!list.length) return "";
  return list
    .map((m, i) => {
      if (i === 0) return `M ${m.x} ${m.y}`;
      const prev = list[i - 1];
      const cx = (prev.x + m.x) / 2;
      return `Q ${cx} ${prev.y} ${m.x} ${m.y}`;
    })
    .join(" ");
}
