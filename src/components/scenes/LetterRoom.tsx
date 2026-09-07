"use client";

import { useCallback, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  gateLetterId,
  letterCopy,
  letters,
  type Letter,
  type Tone,
} from "@/data/letters";
import { rich } from "@/lib/rich";
import { Toast } from "@/components/ui/Toast";
import { Secret } from "@/components/ui/Secret";
import { useTransition } from "@/components/transitions/TransitionProvider";
import { useProgress } from "@/lib/progress";

/** Paper and wax for each kind of letter. */
const TONES: Record<
  Tone,
  { paper: string; edge: string; wax: string; waxRim: string; ink: string }
> = {
  warm: {
    paper: "linear-gradient(150deg,#fdf3e2 0%,#f3e2c8 100%)",
    edge: "rgba(109,69,38,0.28)",
    wax: "#c98a45",
    waxRim: "#a06a2f",
    ink: "#533418",
  },
  playful: {
    paper: "linear-gradient(150deg,#fdeee9 0%,#f6dcd6 100%)",
    edge: "rgba(201,85,107,0.3)",
    wax: "#c9556b",
    waxRim: "#a13f53",
    ink: "#6d2b39",
  },
  tender: {
    paper: "linear-gradient(150deg,#f4e7d4 0%,#e6d0b0 100%)",
    edge: "rgba(61,37,17,0.35)",
    wax: "#6d4526",
    waxRim: "#3d2511",
    ink: "#3d2511",
  },
  forbid: {
    paper: "linear-gradient(150deg,#e8dcc8 0%,#d4c2a4 100%)",
    edge: "rgba(26,15,7,0.4)",
    wax: "#2a190c",
    waxRim: "#0f0803",
    ink: "#2a190c",
  },
};

/** Where each envelope lies on the desk, and how crooked. */
const LAYOUT = [
  { rotate: -4, x: -6 },
  { rotate: 3, x: 8 },
  { rotate: -2, x: -3 },
  { rotate: 5, x: 5 },
];

/**
 * 04 — THE LETTER ROOM.
 *
 * A dark desk under a lamp with four sealed envelopes lying on it. Tapping
 * one breaks the wax, lifts the flap and slides the note out. Read
 * envelopes stay visibly opened, so the desk records where she's been.
 */
export function LetterRoom() {
  const reduced = useReducedMotion() ?? false;
  const { progress, addToList } = useProgress();
  const { go } = useTransition();
  const [open, setOpen] = useState<Letter | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const read = progress.lettersOpened;
  const allRead = letters.every((l) => read.includes(l.id));
  /** The forbidden envelope is the way onward — the rest are hers to skip. */
  const canLeave = read.includes(gateLetterId);

  function openLetter(letter: Letter) {
    const first = !read.includes(letter.id);
    addToList("lettersOpened", letter.id);
    setOpen(letter);
    if (first && letter.tone === "forbid" && read.length === 0) {
      window.setTimeout(() => flash(letterCopy.forbidNudge), 900);
    }
  }

  function flash(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(null), 2400);
  }

  const leave = useCallback(() => go("/memories", "sweep"), [go]);

  return (
    <div className="mat-desk mat-spotlight relative flex min-h-dvh w-full flex-col items-center px-6 pt-16 pb-28">
      <header className="relative z-10 max-w-sm text-center">
        <p className="text-[10px] font-semibold tracking-[0.4em] text-caramel uppercase">
          {letterCopy.eyebrow}
        </p>
        <h1 className="mt-3 font-[family-name:var(--font-display)] text-3xl leading-tight font-semibold text-[#fdf7ec] sm:text-4xl">
          {letterCopy.title}
        </h1>
        <p className="mt-3 text-sm text-[#e6d4bd]/75">
          {allRead
            ? letterCopy.allRead
            : canLeave
              ? letterCopy.gateOpened
              : letterCopy.subtitle}
        </p>
      </header>

      <div className="relative z-10 mt-11 flex w-full max-w-sm flex-col gap-5">
        {letters.map((letter, n) => (
          <Envelope
            key={letter.id}
            letter={letter}
            index={n}
            opened={read.includes(letter.id)}
            onOpen={() => openLetter(letter)}
            reduced={reduced}
          />
        ))}
      </div>

      <AnimatePresence>
        {canLeave && !open && (
          <motion.button
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            whileTap={{ scale: 0.96 }}
            onClick={leave}
            className="relative z-10 mt-12 flex items-center gap-2.5 rounded-full bg-caramel py-3 pr-3 pl-6 text-sm font-bold text-cocoa-900 shadow-[0_16px_36px_-16px_rgba(201,138,69,0.95)]"
          >
            {letterCopy.onward}
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-cocoa-900/85 text-cream">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
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
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && <LetterSheet letter={open} onClose={() => setOpen(null)} />}
      </AnimatePresence>

      {/* something small, left on the desk */}
      <Secret
        id="letters"
        kind="key"
        className="text-[#e6d4bd]/80"
        style={{ left: "7%", bottom: "9%" }}
        onFound={() => flash("You found something.")}
      />

      <Toast message={toast} />
    </div>
  );
}

/* ------------------------------------------------------------------ */

function Envelope({
  letter,
  index,
  opened,
  onOpen,
  reduced,
}: {
  letter: Letter;
  index: number;
  opened: boolean;
  onOpen: () => void;
  reduced: boolean;
}) {
  const t = TONES[letter.tone];
  const l = LAYOUT[index % LAYOUT.length];

  return (
    <motion.button
      onClick={onOpen}
      initial={{ opacity: 0, y: 26, rotate: 0 }}
      animate={{ opacity: 1, y: 0, rotate: reduced ? 0 : l.rotate }}
      transition={{
        duration: 0.75,
        delay: 0.25 + index * 0.11,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileTap={{ scale: 0.97, rotate: 0 }}
      style={{ marginLeft: reduced ? 0 : l.x }}
      className="relative block w-full text-left"
      aria-label={`Open the envelope: ${letter.label}`}
    >
      <span
        className="relative block overflow-hidden rounded-[14px] px-5 pt-6 pb-5"
        style={{
          background: t.paper,
          boxShadow: `0 1px 0 rgba(255,255,255,0.7) inset, 0 20px 34px -20px rgba(0,0,0,0.85)`,
        }}
      >
        {/* the flap */}
        <span
          className="pointer-events-none absolute inset-x-0 top-0 block"
          style={{
            height: opened ? 10 : 62,
            transition: "height 500ms cubic-bezier(0.22,1,0.36,1)",
            background: `linear-gradient(180deg, rgba(0,0,0,0.06), rgba(0,0,0,0))`,
            borderBottom: `1px solid ${t.edge}`,
            clipPath: opened
              ? "polygon(0 0, 100% 0, 100% 100%, 0 100%)"
              : "polygon(0 0, 100% 0, 50% 100%, 0 0)",
          }}
        />

        <span className="relative flex items-center gap-4">
          <span className="flex-1">
            <span
              className="block font-[family-name:var(--font-hand)] text-2xl leading-tight"
              style={{ color: t.ink }}
            >
              {letter.label}
            </span>
            {letter.hint && (
              <span
                className="mt-0.5 block text-[10px] font-semibold tracking-[0.25em] uppercase opacity-55"
                style={{ color: t.ink }}
              >
                {letter.hint}
              </span>
            )}
          </span>

          {/* wax seal, or the broken remains of one */}
          <span className="relative flex h-11 w-11 shrink-0 items-center justify-center">
            <span
              className="absolute inset-0 rounded-full transition-opacity duration-500"
              style={{
                background: `radial-gradient(circle at 34% 30%, ${t.wax}, ${t.waxRim})`,
                boxShadow: `0 2px 6px rgba(0,0,0,0.4), 0 0 0 1px ${t.waxRim} inset`,
                opacity: opened ? 0.28 : 1,
              }}
            />
            <span
              className="relative font-[family-name:var(--font-display)] text-sm font-bold text-[#fdf7ec]"
              style={{ opacity: opened ? 0.4 : 1 }}
            >
              {opened ? "" : "♥"}
            </span>
            {opened && (
              <span className="relative text-[9px] font-bold tracking-[0.15em] text-cocoa-700/60 uppercase">
                Read
              </span>
            )}
          </span>
        </span>
      </span>
    </motion.button>
  );
}

/* ------------------------------------------------------------------ */

function LetterSheet({
  letter,
  onClose,
}: {
  letter: Letter;
  onClose: () => void;
}) {
  const t = TONES[letter.tone];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-40 flex items-center justify-center bg-cocoa-900/70 px-5 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={letter.label}
    >
      <motion.div
        initial={{ y: 90, opacity: 0, rotate: -1.5 }}
        animate={{ y: 0, opacity: 1, rotate: 0 }}
        exit={{ y: 60, opacity: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="paper-grain relative w-full max-w-sm overflow-hidden rounded-lg px-7 pt-9 pb-7"
        style={{
          background: t.paper,
          boxShadow: "0 40px 80px -30px rgba(0,0,0,0.9)",
        }}
      >
        {/* ruled margin, like a real sheet */}
        <span
          className="pointer-events-none absolute inset-y-0 left-5 w-px"
          style={{ background: t.edge, opacity: 0.4 }}
        />

        <p
          className="text-[10px] font-semibold tracking-[0.3em] uppercase opacity-55"
          style={{ color: t.ink }}
        >
          {letter.label}
        </p>

        <div className="mt-5 space-y-4">
          {letter.body.map((para, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 + i * 0.18 }}
              className="text-[0.95rem] leading-relaxed"
              style={{ color: t.ink }}
            >
              {rich(para)}
            </motion.p>
          ))}
        </div>

        {letter.signoff && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.35 + letter.body.length * 0.18 }}
            className="mt-7 text-right font-[family-name:var(--font-hand)] text-2xl"
            style={{ color: t.ink }}
          >
            {letter.signoff}
          </motion.p>
        )}

        <div className="mt-7 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-full border px-5 py-2 text-xs font-semibold"
            style={{ borderColor: t.edge, color: t.ink }}
          >
            Fold it back up
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
