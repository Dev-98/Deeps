"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { tapeCopy, tapes, type Tape } from "@/data/tapes";

/**
 * THE CASSETTE DRAWER.
 *
 * Lives in the root layout, which is the whole point: the <audio> element
 * never unmounts, so whatever she puts on keeps playing as she moves from
 * the door to the map to the cake. A chapter about songs would have
 * stopped at its own exit.
 *
 * Closed, it's a tape peeking in from the right edge — reels turning if
 * something's on. Open, it's a deck and a rack of cassettes; choosing one
 * flies it up out of its slot into the deck and the reels start.
 *
 * That flight used to be a shared `layoutId` between the rack copy and
 * the deck copy. It looked lovely and it was quietly broken: swapping
 * tapes asked Motion to resolve two shared-layout transitions in the same
 * frame (one flying back to the rack, one flying to the deck) and a tape
 * could get stranded at opacity 0 with a half-applied projection — an
 * empty deck while the audio played. It is now a plain enter/exit
 * animation offset toward the column the tape came from: deterministic,
 * nothing measured, nothing to strand.
 *
 * Nothing ever autoplays. She has to pick.
 */
export function MusicDrawer() {
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [open, setOpen] = useState(false);
  const [loadedId, setLoadedId] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const [broken, setBroken] = useState<string[]>([]);

  const loaded = tapes.find((t) => t.id === loadedId) ?? null;

  /** Chapter 10 is a video. Nothing competes with it. */
  const silent = pathname === "/video";

  useEffect(() => {
    if (!silent) return;
    audioRef.current?.pause();
    setPlaying(false);
    setOpen(false);
  }, [silent]);

  // Load and start whatever she just chose.
  useEffect(() => {
    const el = audioRef.current;
    if (!el || !loaded) return;

    el.src = loaded.src;
    el.volume = tapeCopy.volume;
    el.loop = true;
    void el
      .play()
      .then(() => setPlaying(true))
      .catch(() => setPlaying(false));
  }, [loaded]);

  const choose = useCallback(
    (tape: Tape) => {
      if (broken.includes(tape.id)) return;
      if (tape.id === loadedId) {
        // tapping the loaded one ejects it
        audioRef.current?.pause();
        setPlaying(false);
        setLoadedId(null);
        return;
      }
      setLoadedId(tape.id);
    },
    [broken, loadedId],
  );

  const toggle = useCallback(() => {
    const el = audioRef.current;
    if (!el || !loaded) return;
    if (playing) {
      el.pause();
      setPlaying(false);
    } else {
      void el
        .play()
        .then(() => setPlaying(true))
        .catch(() => setPlaying(false));
    }
  }, [loaded, playing]);

  if (silent) return null;

  return (
    <>
      <audio
        ref={audioRef}
        preload="none"
        onError={() => {
          if (loaded) setBroken((b) => [...b, loaded.id]);
          setPlaying(false);
        }}
      />

      {/* ----------------------- the peeking tape ---------------------- */}
      <AnimatePresence>
        {!open && (
          <motion.button
            /*
              Re-keyed per chapter so it nudges again in each new room.
              It nudges three times and then SETTLES — a tap target that
              never stops moving is genuinely irritating to hit on a phone.
            */
            key={pathname}
            initial={{ x: 64, opacity: 0 }}
            animate={
              reduced ? { x: 0, opacity: 1 } : { x: [64, 0, -7, 0], opacity: 1 }
            }
            exit={{ x: 64, opacity: 0 }}
            transition={
              reduced
                ? { duration: 0.3 }
                : {
                    x: {
                      duration: 2.4,
                      times: [0, 0.35, 0.65, 1],
                      repeat: 2,
                      repeatDelay: 2.6,
                      ease: "easeInOut",
                    },
                    opacity: { duration: 0.6 },
                  }
            }
            onClick={() => setOpen(true)}
            aria-label="Open the tapes"
            className="fixed right-0 bottom-[7%] z-50 flex items-center"
          >
            <span
              className="relative flex h-[74px] w-[52px] items-center justify-center rounded-l-xl pr-1"
              style={{
                background: `linear-gradient(140deg,${loaded?.shell ?? "#6d4526"} 0%,#2a190c 100%)`,
                boxShadow:
                  "0 1px 0 rgba(255,226,187,0.22) inset, -8px 0 22px -8px rgba(0,0,0,0.85)",
              }}
            >
              <span className="flex flex-col items-center gap-1.5">
                <MiniReels spinning={playing && !reduced} />
                <span
                  className="text-[8px] font-bold tracking-[0.18em] uppercase"
                  style={{ color: loaded?.label ?? "#e6d4bd" }}
                >
                  {playing ? "♪" : tapeCopy.peek}
                </span>
              </span>
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* -------------------------- the drawer ------------------------- */}
      <AnimatePresence>
        {open && (
          <>
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              onClick={() => setOpen(false)}
              aria-label="Close the tapes"
              className="fixed inset-0 z-50 bg-cocoa-900/55 backdrop-blur-[3px]"
            />

            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-x-0 bottom-0 z-50 mx-auto w-full max-w-sm"
            >
              <div
                className="relative rounded-t-3xl px-5 pt-4 pb-7"
                style={{
                  background:
                    "linear-gradient(180deg,#3a2515 0%,#2a190c 55%,#1d1108 100%)",
                  boxShadow: "0 -24px 60px -20px rgba(0,0,0,0.95)",
                }}
              >
                <span className="mx-auto mb-4 block h-1 w-10 rounded-full bg-[#e6d4bd]/25" />

                <div className="flex items-baseline justify-between">
                  <div>
                    <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-[#fdf7ec]">
                      {tapeCopy.title}
                    </h2>
                    <p className="mt-0.5 text-[11px] text-[#e6d4bd]/55">
                      {tapeCopy.subtitle}
                    </p>
                  </div>
                  <button
                    onClick={() => setOpen(false)}
                    className="text-[10px] font-semibold tracking-[0.2em] text-[#e6d4bd]/50 uppercase"
                  >
                    Close
                  </button>
                </div>

                {/* ------------------------ the deck ------------------- */}
                <div className="mat-recess relative mt-4 flex h-[104px] items-center justify-center overflow-hidden rounded-2xl px-4">
                  <AnimatePresence mode="wait">
                    {loaded ? (
                      <motion.div
                        key={loaded.id}
                        initial={
                          reduced
                            ? { opacity: 0 }
                            : {
                                opacity: 0,
                                y: 150,
                                scale: 0.62,
                                // start off toward the column it sits in,
                                // so it reads as coming out of its own slot
                                x: (tapes.findIndex((t) => t.id === loaded.id) - 1) * 116,
                                rotate: -8,
                              }
                        }
                        animate={{ opacity: 1, y: 0, scale: 1, x: 0, rotate: 0 }}
                        exit={
                          reduced
                            ? { opacity: 0 }
                            : { opacity: 0, y: 150, scale: 0.62, rotate: 8 }
                        }
                        transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <Cassette tape={loaded} big spinning={playing && !reduced} />
                      </motion.div>
                    ) : (
                      <motion.span
                        key="empty"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="text-[10px] font-semibold tracking-[0.25em] text-[#e6d4bd]/35 uppercase"
                      >
                        {tapeCopy.nothing}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>

                {/* --------------------- the transport ----------------- */}
                <div className="mt-4 flex items-center gap-3">
                  <button
                    onClick={toggle}
                    disabled={!loaded}
                    aria-label={playing ? "Pause" : "Play"}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-caramel text-cocoa-900 disabled:bg-[#e6d4bd]/12 disabled:text-[#e6d4bd]/35"
                  >
                    {playing ? (
                      <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5">
                        <rect x="6" y="5" width="4" height="14" rx="1" />
                        <rect x="14" y="5" width="4" height="14" rx="1" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" fill="currentColor" className="ml-0.5 h-3.5 w-3.5">
                        <path d="M7 4.5v15l13-7.5z" />
                      </svg>
                    )}
                  </button>

                  <p className="min-w-0 flex-1">
                    <span className="block truncate text-xs font-semibold text-[#fdf7ec]">
                      {loaded ? loaded.title : "—"}
                    </span>
                    <span className="block truncate text-[10px] text-[#e6d4bd]/45">
                      {loaded
                        ? broken.includes(loaded.id)
                          ? tapeCopy.missing
                          : (loaded.note ?? "")
                        : tapeCopy.subtitle}
                    </span>
                  </p>
                </div>

                {/* ------------------------ the rack ------------------- */}
                <div className="mt-5 grid grid-cols-3 gap-3">
                  {tapes.map((tape) => {
                    const isLoaded = tape.id === loadedId;
                    return (
                      <motion.button
                        key={tape.id}
                        onClick={() => choose(tape)}
                        whileHover={reduced ? undefined : { y: -6, rotate: -2 }}
                        whileTap={{ scale: 0.94 }}
                        className="relative"
                        aria-label={
                          isLoaded ? `Eject ${tape.title}` : `Play ${tape.title}`
                        }
                      >
                        <Cassette
                          tape={tape}
                          dim={broken.includes(tape.id) || isLoaded}
                          spinning={false}
                        />
                        {isLoaded && (
                          <span className="absolute inset-0 flex items-center justify-center">
                            <span className="rounded-full bg-cocoa-900/80 px-2 py-0.5 text-[8px] font-bold tracking-[0.15em] text-caramel uppercase">
                              In deck
                            </span>
                          </span>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

/* ------------------------------------------------------------------ */

/**
 * One cassette. The same `layoutId` in the rack and in the deck is what
 * makes it fly across when she picks it — Motion tweens between the two
 * positions itself, so there are no coordinates to measure.
 */
function Cassette({
  tape,
  big = false,
  dim = false,
  spinning,
}: {
  tape: Tape;
  big?: boolean;
  dim?: boolean;
  spinning: boolean;
}) {
  return (
    <span
      className="relative block overflow-hidden"
      style={{
        width: big ? 168 : "100%",
        height: big ? 78 : 56,
        borderRadius: big ? 10 : 7,
        opacity: dim ? 0.4 : 1,
        background: `linear-gradient(150deg,${tape.shell} 0%,#241606 100%)`,
        boxShadow:
          "0 1px 0 rgba(255,226,187,0.22) inset, 0 8px 18px -8px rgba(0,0,0,0.9)",
      }}
    >
      {/* the sticker */}
      <span
        className="absolute inset-x-[7%] top-[9%] block overflow-hidden rounded-[3px] px-1.5 py-[3px]"
        style={{ background: tape.label, height: big ? "44%" : "42%" }}
      >
        <span
          className="block truncate font-[family-name:var(--font-hand)] leading-tight"
          style={{ color: tape.ink, fontSize: big ? 17 : 12 }}
        >
          {tape.title}
        </span>
      </span>

      {/* the window and the two reels */}
      <span
        className="absolute inset-x-[16%] bottom-[10%] flex items-center justify-between rounded-[3px] px-[6%]"
        style={{
          height: big ? "36%" : "34%",
          background: "rgba(0,0,0,0.45)",
          boxShadow: "0 1px 2px rgba(0,0,0,0.6) inset",
        }}
      >
        <Reel size={big ? 20 : 13} spinning={spinning} />
        <Reel size={big ? 20 : 13} spinning={spinning} />
      </span>
    </span>
  );
}

function Reel({ size, spinning }: { size: number; spinning: boolean }) {
  return (
    <span
      className={`relative flex items-center justify-center rounded-full bg-[#e6d4bd]/85 ${
        spinning ? "anim-reel" : ""
      }`}
      style={{ width: size, height: size }}
    >
      {[0, 60, 120].map((deg) => (
        <span
          key={deg}
          className="absolute rounded-full bg-cocoa-800/80"
          style={{ width: 2, height: size, transform: `rotate(${deg}deg)` }}
        />
      ))}
      <span
        className="relative rounded-full bg-cocoa-900"
        style={{ width: size * 0.3, height: size * 0.3 }}
      />
    </span>
  );
}

/** The two little reels visible on the peeking edge. */
function MiniReels({ spinning }: { spinning: boolean }) {
  return (
    <span className="flex items-center gap-1">
      <Reel size={13} spinning={spinning} />
      <Reel size={13} spinning={spinning} />
    </span>
  );
}
