"use client";

import { useCallback, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { gameCopy, questions } from "@/data/questions";
import { rich } from "@/lib/rich";
import { useTransition } from "@/components/transitions/TransitionProvider";
import { useProgress } from "@/lib/progress";
import { Secret } from "@/components/ui/Secret";

type Phase = "intro" | "playing" | "verdict";

/**
 * 03 — THE GAME.
 *
 * A deck of cards on a dark table under one warm light. Each question is
 * the card on top; answering flicks it away and the next one is already
 * waiting underneath. Nothing here is a test — a wrong answer just gets a
 * better line — so there is no score shown until the very end.
 */
export function TheGame({ onFinish }: { onFinish: () => void }) {
  const reduced = useReducedMotion() ?? false;
  const { update } = useProgress();
  const { go } = useTransition();

  const [phase, setPhase] = useState<Phase>("intro");
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);

  const q = questions[i];
  const answered = picked !== null;
  const gotIt = answered && picked === q?.correct;

  function pick(option: number) {
    if (answered) return;
    setPicked(option);
    if (option === q.correct) setScore((s) => s + 1);
  }

  function next() {
    if (i + 1 < questions.length) {
      setI(i + 1);
      setPicked(null);
      return;
    }
    update({ quizScore: score });
    setPhase("verdict");
  }

  const leave = useCallback(() => {
    onFinish();
    go("/letters", "fold");
  }, [onFinish, go]);

  const reply = !answered
    ? null
    : gotIt
      ? q.right
      : (q.replies?.[picked] ?? q.wrong);

  return (
    <div className="mat-desk mat-spotlight relative flex min-h-dvh w-full flex-col items-center justify-center overflow-hidden px-6 py-14">
      {/*
        Something small, left on the table. Deliberately outside the phase
        switch: when it lived inside the intro it vanished the moment she
        pressed "Deal me in", and the only way back was resetting the whole
        site — that is a trap, not a hiding place.
      */}
      <Secret
        id="game"
        kind="heart"
        className="text-[#e6d4bd]/80"
        style={{ left: "7%", bottom: "8%" }}
      />
      <AnimatePresence mode="wait">
        {/* ------------------------------ intro ----------------------- */}
        {phase === "intro" && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -18 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 w-full max-w-sm text-center"
          >
            <p className="text-[10px] font-semibold tracking-[0.4em] text-caramel uppercase">
              {gameCopy.eyebrow}
            </p>
            <h1 className="mt-4 font-[family-name:var(--font-display)] text-3xl leading-tight font-semibold text-[#fdf7ec] sm:text-4xl">
              {gameCopy.title}
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-[#e6d4bd]/75">
              {gameCopy.subtitle}
            </p>

            <FannedDeck />

            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={() => setPhase("playing")}
              className="mt-10 rounded-full bg-caramel px-8 py-3 text-sm font-bold text-cocoa-900 shadow-[0_16px_34px_-16px_rgba(201,138,69,0.95)]"
            >
              {gameCopy.begin}
            </motion.button>
          </motion.div>
        )}

        {/* ----------------------------- playing ---------------------- */}
        {phase === "playing" && (
          <motion.div
            key="playing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 flex w-full max-w-sm flex-col items-center"
          >
            <div className="mb-6 flex items-center gap-1.5">
              {questions.map((_, n) => (
                <span
                  key={n}
                  className={`h-1 rounded-full transition-all duration-500 ${
                    n < i
                      ? "w-5 bg-caramel"
                      : n === i
                        ? "w-8 bg-[#fdf7ec]"
                        : "w-2 bg-[#fdf7ec]/25"
                  }`}
                />
              ))}
            </div>

            {/* the deck: two dim cards behind the live one */}
            <div className="relative w-full">
              {i + 1 < questions.length && (
                <div className="mat-paper-dim absolute inset-x-3 -top-3 h-full rotate-[1.4deg] rounded-3xl" />
              )}
              {i + 2 < questions.length && (
                <div className="mat-paper-dim absolute inset-x-6 -top-6 h-full -rotate-[1.1deg] rounded-3xl opacity-70" />
              )}

              <AnimatePresence mode="wait">
                <motion.div
                  key={q.id}
                  initial={{ opacity: 0, y: 26, rotate: -2 }}
                  animate={{ opacity: 1, y: 0, rotate: 0 }}
                  exit={{
                    opacity: 0,
                    x: reduced ? 0 : 240,
                    rotate: reduced ? 0 : 12,
                    transition: { duration: 0.45 },
                  }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="mat-paper relative rounded-3xl px-6 pt-7 pb-6"
                >
                  <span className="absolute top-5 right-6 font-[family-name:var(--font-display)] text-xs text-cocoa-300">
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <h2 className="pr-8 text-left font-[family-name:var(--font-display)] text-xl leading-snug font-semibold text-cocoa-800">
                    {rich(q.prompt)}
                  </h2>

                  <div className="mt-6 flex flex-col gap-2.5">
                    {q.options.map((opt, n) => {
                      const isPicked = picked === n;
                      const isAnswer = n === q.correct;
                      const reveal = answered && isAnswer;

                      return (
                        <motion.button
                          key={n}
                          whileTap={answered ? undefined : { scale: 0.98 }}
                          onClick={() => pick(n)}
                          disabled={answered}
                          className={[
                            "flex items-center gap-3 rounded-2xl border px-4 py-3 text-left text-sm transition-colors",
                            reveal
                              ? "border-caramel bg-caramel/15 font-semibold text-cocoa-800"
                              : isPicked
                                ? "border-rose/50 bg-rose/10 text-cocoa-700"
                                : "border-cocoa-300/45 text-cocoa-700",
                            answered ? "cursor-default" : "hover:bg-cocoa-50/60",
                          ].join(" ")}
                        >
                          <span
                            className={[
                              "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold",
                              reveal
                                ? "border-caramel bg-caramel text-cocoa-900"
                                : isPicked
                                  ? "border-rose bg-rose text-ivory"
                                  : "border-cocoa-300 text-cocoa-400",
                            ].join(" ")}
                          >
                            {reveal ? "✓" : isPicked ? "✕" : "ABC"[n]}
                          </span>
                          <span className="flex-1">{opt}</span>
                        </motion.button>
                      );
                    })}
                  </div>

                  <AnimatePresence>
                    {reply && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden pt-5 text-left font-[family-name:var(--font-hand)] text-2xl leading-tight text-cocoa-600"
                      >
                        {rich(reply)}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>
              </AnimatePresence>
            </div>

            <AnimatePresence>
              {answered && (
                <motion.button
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, delay: 0.35 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={next}
                  className="mt-8 rounded-full bg-[#fdf7ec] px-7 py-2.5 text-sm font-bold text-cocoa-800"
                >
                  {i + 1 < questions.length ? "Next" : "That's all of them"}
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* ----------------------------- verdict ---------------------- */}
        {phase === "verdict" && (
          <motion.div
            key="verdict"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 w-full max-w-sm text-center"
          >
            <p className="text-[10px] font-semibold tracking-[0.4em] text-caramel uppercase">
              Final score, apparently
            </p>
            <p className="mt-5 font-[family-name:var(--font-display)] text-6xl font-semibold text-[#fdf7ec]">
              {score}
              <span className="text-2xl text-[#e6d4bd]/50">/{questions.length}</span>
            </p>
            <p className="mt-4 font-[family-name:var(--font-hand)] text-2xl text-caramel">
              {gameCopy.verdicts[Math.min(score, gameCopy.verdicts.length - 1)]}
            </p>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.1 }}
              className="mat-paper mt-12 rounded-3xl px-6 py-7"
            >
              <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-cocoa-800">
                {gameCopy.doorTitle}
              </h2>
              <p className="mt-2 text-sm text-mocha">{gameCopy.doorBody}</p>
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={leave}
                className="mt-6 w-full rounded-full bg-cocoa-600 py-3 text-sm font-bold text-cream"
              >
                {gameCopy.doorAction}
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

/** Three cards fanned face-down, purely so the intro has something to hold. */
function FannedDeck() {
  return (
    <div className="relative mx-auto mt-10 h-28 w-52" aria-hidden>
      {[-14, 0, 14].map((deg, n) => (
        <motion.div
          key={n}
          initial={{ opacity: 0, y: 20, rotate: 0 }}
          animate={{ opacity: 1, y: 0, rotate: deg }}
          transition={{ duration: 0.8, delay: 0.3 + n * 0.12, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformOrigin: "50% 120%" }}
          className="mat-paper absolute inset-x-10 top-0 h-28 rounded-2xl"
        >
          <span className="absolute inset-2 rounded-xl border border-cocoa-300/40" />
          <span className="absolute inset-0 flex items-center justify-center text-2xl text-cocoa-300/70">
            ?
          </span>
        </motion.div>
      ))}
    </div>
  );
}
