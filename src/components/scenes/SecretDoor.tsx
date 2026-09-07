"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { door, opensTheDoor } from "@/data/door";
import { SoftButton } from "@/components/ui/SoftButton";
import { rich } from "@/lib/rich";
import { Secret } from "@/components/ui/Secret";

type Props = {
  /** Fired the moment the answer is right, before the camera moves. */
  onUnlock: () => void;
};

/**
 * 00 — THE SECRET DOOR.
 * A physical-looking door with a brass keyhole. It does not mention a
 * birthday, a date, or a reason. It asks one question.
 */
export function SecretDoor({ onUnlock }: Props) {
  const reduced = useReducedMotion();
  const [value, setValue] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [reply, setReply] = useState<string | null>(null);
  const [shake, setShake] = useState(0);
  const [opened, setOpened] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (opened || !value.trim()) return;

    if (opensTheDoor(value)) {
      setOpened(true);
      setReply(door.welcome);
      window.setTimeout(onUnlock, reduced ? 200 : 1100);
      return;
    }

    const next = Math.min(attempts, door.wrongReplies.length - 1);
    setReply(door.wrongReplies[next]);
    setAttempts((a) => a + 1);
    setShake((s) => s + 1);
  }

  return (
    <div className="anim-fade relative flex w-full max-w-sm flex-col items-center">
      {/* ---- the door itself ---- */}
      <motion.div
        key={shake}
        animate={shake && !reduced ? { x: [0, -9, 8, -5, 0] } : {}}
        transition={{ duration: 0.42 }}
        className="relative"
      >
        <div className="relative h-72 w-48 rounded-t-[5.5rem] p-3 sm:h-80 sm:w-56">
          {/* the doorway itself — warm, and always waiting behind the slab */}
          <div className="absolute inset-3 overflow-hidden rounded-t-[4.6rem] bg-gradient-to-b from-[#ffe6b8] via-caramel to-[#8a5f3c]">
            <motion.div
              animate={opened ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 1, delay: 0.35 }}
              className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(255,255,255,0.95),transparent_65%)]"
            />
          </div>

          {/*
            The door is a slab of chocolate.
            Moulded squares pressed into the face, a bevel catching the
            light along the top and left of every one, a glossy sheen
            running down the whole bar, and a bite taken out of one corner.
          */}
          <motion.div
            animate={opened && !reduced ? { rotateY: -76 } : { rotateY: 0 }}
            transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1] }}
            style={{ transformOrigin: "left center", transformPerspective: 1000 }}
            className="absolute inset-0 overflow-hidden rounded-t-[5.5rem] rounded-b-[6px]"
          >
            {/* the bar itself */}
            <span
              className="absolute inset-0 block"
              style={{
                background:
                  "linear-gradient(158deg,#7a5230 0%,#5c3a1c 34%,#42280f 68%,#2a190c 100%)",
              }}
            />

            {/* moulded squares */}
            <span className="absolute inset-[7px] grid grid-cols-3 grid-rows-5 gap-[5px] rounded-t-[4.8rem] p-[3px]">
              {Array.from({ length: 15 }, (_, i) => (
                <span
                  key={i}
                  className="relative block rounded-[3px]"
                  style={{
                    background:
                      "linear-gradient(150deg,#6d4526 0%,#553317 55%,#3a2210 100%)",
                    boxShadow:
                      "1px 1px 0 rgba(255,214,148,0.14) inset, -1px -1px 0 rgba(0,0,0,0.55) inset, 0 1px 2px rgba(0,0,0,0.4)",
                  }}
                >
                  {/* the little pressed square inside each block */}
                  <span
                    className="absolute inset-[22%] block rounded-[1px]"
                    style={{
                      background: "rgba(0,0,0,0.16)",
                      boxShadow: "0 1px 0 rgba(255,214,148,0.1)",
                    }}
                  />
                </span>
              ))}
            </span>

            {/* a sheen, the way light sits on tempered chocolate */}
            <span
              className="pointer-events-none absolute inset-0 block"
              style={{
                background:
                  "linear-gradient(104deg, rgba(255,231,196,0) 34%, rgba(255,231,196,0.16) 46%, rgba(255,231,196,0.03) 55%, rgba(255,231,196,0) 62%)",
              }}
            />

            {/* somebody has already had a bite out of the corner */}
            <span
              className="absolute -top-2 -right-2 h-12 w-12 rounded-full"
              style={{ background: "var(--color-cream)" }}
            />
            <span
              className="absolute top-4 right-1 h-6 w-6 rounded-full"
              style={{ background: "var(--color-cream)" }}
            />

            {/* keyhole, pressed into the chocolate */}
            <motion.div
              animate={
                opened && !reduced
                  ? { boxShadow: "0 0 34px 10px rgba(201,138,69,0.85)" }
                  : {}
              }
              transition={{ duration: 0.6 }}
              className="absolute top-1/2 right-5 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-caramel/90"
              style={{
                boxShadow:
                  "0 1px 0 rgba(255,231,196,0.4) inset, 0 -2px 4px rgba(0,0,0,0.5) inset",
              }}
            >
              <span className="block h-2.5 w-2.5 rounded-full bg-cocoa-900" />
              <span className="absolute bottom-1.5 h-2.5 w-1 bg-cocoa-900" />
            </motion.div>
          </motion.div>

          {/*
            Something small, pressed into the chocolate.

            This used to live in the tape drawer, which was the wrong
            place for it: the drawer is chrome you open to do a job, not
            a room you look around. Here she is already standing still,
            staring at the bar, working out what to type. Positioned
            inside the door frame (not the outer column) so the
            percentages land on a moulded square rather than on the
            question text below.
          */}
          {!opened && (
            <Secret
              id="door"
              kind="square"
              className="z-20 text-[#f3e2c8]/85"
              style={{ left: "11.5%", top: "63.5%" }}
            />
          )}

          {/* the shadow the slab casts */}
          <span className="pointer-events-none absolute -inset-x-2 -bottom-3 -z-10 h-10 rounded-full bg-cocoa-900/45 blur-xl" />
        </div>

        {/* light spilling from under the door */}
        <motion.div
          animate={{ opacity: opened ? 0.95 : 0.25 }}
          transition={{ duration: 0.8 }}
          className="mx-auto h-6 w-56 rounded-b-full bg-caramel/60 blur-lg sm:w-64"
        />
      </motion.div>

      {/* ---- the question ---- */}
      <div className="mt-10 w-full text-center">
        <p className="font-[family-name:var(--font-display)] text-xl leading-snug font-semibold text-cocoa-800 sm:text-2xl">
          {rich(door.question)}
        </p>

        <form onSubmit={submit} className="mt-6 flex flex-col items-center gap-4">
          <label className="sr-only" htmlFor="door-answer">
            {door.question}
          </label>
          <input
            id="door-answer"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            disabled={opened}
            autoComplete="off"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            placeholder={door.placeholder}
            className="w-full rounded-full border border-cocoa-300/70 bg-ivory/80 px-6 py-3 text-center text-base text-cocoa-800 placeholder:text-mocha/50 focus:border-caramel focus:outline-none disabled:opacity-60"
          />
          <SoftButton type="submit" disabled={opened || !value.trim()}>
            {opened ? "Opening\u2026" : "Try it"}
          </SoftButton>
        </form>

        <div className="mt-5 min-h-[2.5rem]">
          <AnimatePresence mode="wait">
            {reply && (
              <motion.p
                key={reply}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.35 }}
                className={`font-[family-name:var(--font-hand)] text-xl ${
                  opened ? "text-caramel" : "text-mocha"
                }`}
              >
                {rich(reply)}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {attempts >= 2 && !opened && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-2 text-xs text-mocha/70"
          >
            {door.hint}
          </motion.p>
        )}
      </div>
    </div>
  );
}
