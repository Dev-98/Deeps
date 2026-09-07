"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { video } from "@/data/finale";
import { useProgress } from "@/lib/progress";
import { useTransition } from "@/components/transitions/TransitionProvider";

/**
 * 10 — ONE MORE THING.
 *
 * The most human part, so the design gets out of its way completely.
 * Near-black, one frame, nothing moving, no decoration. Everything the
 * birthday chapter threw at the screen is gone — that contrast is the
 * whole design decision here.
 */
export default function VideoPage() {
  const router = useRouter();
  const { progress, ready } = useProgress();
  const { go } = useTransition();
  const ref = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);
  const [ended, setEnded] = useState(false);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    if (ready && !progress.worldBloomed) router.replace("/");
  }, [ready, progress.worldBloomed, router]);

  const play = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    void el
      .play()
      .then(() => setStarted(true))
      .catch(() => setMissing(true));
  }, []);

  const onward = useCallback(() => go("/final", "sweep"), [go]);

  if (!ready) return <div className="min-h-dvh w-full bg-black" />;

  return (
    <main className="relative flex min-h-dvh w-full flex-col items-center justify-center overflow-hidden bg-black px-5 py-14">
      <AnimatePresence>
        {!started && (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, transition: { duration: 0.6 } }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="absolute top-[18%] z-10 px-6 text-center"
          >
            <p className="text-[10px] font-semibold tracking-[0.4em] text-champagne/45 uppercase">
              {video.eyebrow}
            </p>
            <h1 className="mt-4 font-[family-name:var(--font-display)] text-3xl font-semibold text-champagne sm:text-4xl">
              {video.title}
            </h1>
            <p className="mt-3 text-sm text-champagne/45">{video.invite}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-sm overflow-hidden rounded-2xl bg-[#0a0a0a] ring-1 ring-champagne/12"
        style={{ boxShadow: "0 40px 90px -40px rgba(242,193,78,0.28)" }}
      >
        <video
          ref={ref}
          src={video.src}
          poster={video.poster}
          preload="metadata"
          playsInline
          controls={started}
          onEnded={() => setEnded(true)}
          onError={() => setMissing(true)}
          className="block aspect-[9/16] w-full bg-black object-cover"
        />

        {!started && (
          <button
            onClick={play}
            aria-label="Play"
            className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/45"
          >
            {missing ? (
              <span className="px-8 text-center">
                <span className="block text-sm text-champagne/70">
                  {video.missing}
                </span>
                <code className="mt-2 block text-[10px] tracking-wide text-champagne/35">
                  {video.missingHint}
                </code>
              </span>
            ) : (
              <>
                <motion.span
                  animate={{ scale: [1, 1.09, 1] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                  className="flex h-20 w-20 items-center justify-center rounded-full bg-champagne/95"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="#0a0510"
                    className="ml-1 h-7 w-7"
                    aria-hidden
                  >
                    <path d="M7 4.5v15l13-7.5z" />
                  </svg>
                </motion.span>
                <span className="text-[10px] font-semibold tracking-[0.35em] text-champagne/55 uppercase">
                  Press it
                </span>
              </>
            )}
          </button>
        )}
      </motion.div>

      <AnimatePresence>
        {(ended || missing) && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: ended ? 1.4 : 0.6 }}
            className="absolute bottom-14 flex flex-col items-center gap-5 px-6 text-center"
          >
            {ended && (
              <p className="font-[family-name:var(--font-hand)] text-2xl text-champagne/80">
                {video.after}
              </p>
            )}
            <button
              onClick={onward}
              className="rounded-full bg-champagne px-7 py-2.5 text-sm font-bold text-[#0a0510]"
            >
              {video.onward}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
