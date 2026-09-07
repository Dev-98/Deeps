"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { memoryCopy, polaroids, type Polaroid } from "@/data/polaroids";
import { Secret } from "@/components/ui/Secret";
import { Toast } from "@/components/ui/Toast";
import { useProgress } from "@/lib/progress";
import { useTransition } from "@/components/transitions/TransitionProvider";

/**
 * 06 — MEMORY LANE.
 *
 * A darkroom. The photographs arrive blank and chemical-pale; tapping one
 * develops it in front of her — blur and wash pulling back into a real
 * image over a couple of seconds, the way a polaroid actually does.
 *
 * This is the last of the restrained chapters. From here the palette
 * starts spending itself.
 */
export function MemoryLane() {
  const reduced = useReducedMotion();
  const { progress, addToList } = useProgress();
  const { go } = useTransition();
  const [zoom, setZoom] = useState<Polaroid | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const developed = progress.secretsFound.filter((s) => s.startsWith("dev:"));
  const count = developed.length;
  const canLeave = count >= memoryCopy.needed;

  function develop(photo: Polaroid) {
    const first = !developed.includes(`dev:${photo.id}`);
    addToList("secretsFound", `dev:${photo.id}`);
    if (!first) setZoom(photo);
  }

  const flash = useCallback((message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 2200);
  }, []);

  const leave = useCallback(() => go("/wish", "heart"), [go]);

  return (
    <div className="relative flex min-h-dvh w-full flex-col items-center overflow-hidden px-5 pt-16 pb-24">
      {/* the darkroom */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(100% 60% at 50% 0%, rgba(224,69,123,0.12) 0%, transparent 55%), linear-gradient(180deg,#1d1226 0%,#191019 55%,#150d12 100%)",
        }}
      />
      <div className="pointer-events-none absolute inset-0 vignette" />

      {/*
        Something small, up in the corner of the darkroom.

        Two things it must not be, both learned the hard way: it must not
        sit on a polaroid (a pale glyph on pale card has no contrast), and
        it must not be positioned with a percentage — this page is taller
        than the screen, so percentages of the page height land unpredictably
        (bottom% put it below the fold, top% put it back on a polaroid).
        A fixed pixel offset keeps it in the dark band beside the title,
        whatever the page ends up measuring.
      */}
      <Secret
        id="memories"
        kind="flower"
        className="text-[#f0dcc8]/85"
        style={{ right: 22, top: 104 }}
        onFound={() => flash("You found something.")}
      />

      <header className="relative z-10 max-w-sm text-center">
        <p className="text-[10px] font-semibold tracking-[0.4em] text-magenta/80 uppercase">
          {memoryCopy.eyebrow}
        </p>
        <h1 className="mt-3 font-[family-name:var(--font-display)] text-3xl leading-tight font-semibold text-[#f6ecdf] sm:text-4xl">
          {memoryCopy.title}
        </h1>
        <p className="mt-3 text-sm text-[#e0cdbb]/65">
          {count === 0
            ? memoryCopy.subtitle
            : memoryCopy.developed(count, polaroids.length)}
        </p>
      </header>

      {/* the pile */}
      <div className="relative z-10 mt-10 grid w-full max-w-sm grid-cols-2 gap-x-4 gap-y-6">
        {polaroids.map((photo, i) => (
          <PolaroidCard
            key={photo.id}
            photo={photo}
            index={i}
            developed={developed.includes(`dev:${photo.id}`)}
            reduced={reduced ?? false}
            onTap={() => develop(photo)}
          />
        ))}
      </div>

      <AnimatePresence>
        {canLeave && (
          <motion.button
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            whileTap={{ scale: 0.96 }}
            onClick={leave}
            className="relative z-10 mt-12 flex items-center gap-2.5 rounded-full bg-magenta py-3 pr-3 pl-6 text-sm font-bold text-[#fff2f6] shadow-[0_18px_40px_-16px_rgba(224,69,123,0.9)]"
          >
            {memoryCopy.onward}
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#fff2f6]/95 text-magenta">
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
        )}
      </AnimatePresence>

      {/* held up to the light */}
      <AnimatePresence>
        {zoom && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setZoom(null)}
            className="fixed inset-0 z-40 flex items-center justify-center bg-[#0a0510]/85 px-8 backdrop-blur-sm"
            aria-label="Put it back"
          >
            <motion.div
              initial={{ scale: 0.85, rotate: -3, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-xs"
            >
              <PolaroidFrame photo={zoom} developed large />
            </motion.div>
          </motion.button>
        )}
      </AnimatePresence>

      <Toast message={toast} />
    </div>
  );
}

/* ------------------------------------------------------------------ */

function PolaroidCard({
  photo,
  index,
  developed,
  reduced,
  onTap,
}: {
  photo: Polaroid;
  index: number;
  developed: boolean;
  reduced: boolean;
  onTap: () => void;
}) {
  return (
    <motion.button
      onClick={onTap}
      initial={{ opacity: 0, y: 24, rotate: 0 }}
      animate={{ opacity: 1, y: 0, rotate: reduced ? 0 : photo.rotate }}
      transition={{
        duration: 0.7,
        delay: 0.2 + index * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileTap={{ scale: 0.96, rotate: 0 }}
      className="block w-full"
      aria-label={developed ? photo.caption : "An undeveloped photograph"}
    >
      <PolaroidFrame photo={photo} developed={developed} />
    </motion.button>
  );
}

function PolaroidFrame({
  photo,
  developed,
  large = false,
}: {
  photo: Polaroid;
  developed: boolean;
  large?: boolean;
}) {
  return (
    <span
      className="block rounded-[3px] bg-[#fdfaf3] p-2.5 pb-9"
      style={{
        boxShadow:
          "0 1px 0 rgba(255,255,255,0.9) inset, 0 18px 34px -16px rgba(0,0,0,0.9)",
      }}
    >
      <span className="relative block aspect-square w-full overflow-hidden bg-[#2a1f28]">
        {photo.image ? (
          <Image
            src={photo.image}
            alt={developed ? photo.caption : ""}
            fill
            sizes={large ? "320px" : "180px"}
            className={`object-cover ${developed ? "anim-develop" : ""}`}
            style={
              developed
                ? undefined
                : { filter: "blur(16px) saturate(0.15) brightness(1.5)" }
            }
          />
        ) : (
          <span
            className={`absolute inset-0 ${developed ? "anim-develop" : ""}`}
            style={{
              background: developed
                ? "linear-gradient(150deg,#8a5f3c,#c98a45 55%,#e0cdbb)"
                : "linear-gradient(150deg,#d8cfc2,#c9c0b4)",
            }}
          />
        )}

        {!developed && (
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="text-[9px] font-semibold tracking-[0.25em] text-[#3d2511]/45 uppercase">
              Tap
            </span>
          </span>
        )}
      </span>

      <span className="mt-2.5 block px-0.5 text-left">
        <span
          className={`block font-[family-name:var(--font-hand)] leading-tight text-cocoa-700 transition-opacity duration-700 ${
            large ? "text-2xl" : "text-lg"
          } ${developed ? "opacity-100" : "opacity-0"}`}
        >
          {photo.caption}
        </span>
        {photo.sub && (
          <span
            className={`block text-[9px] tracking-[0.15em] text-cocoa-400 uppercase transition-opacity duration-700 ${
              developed ? "opacity-100" : "opacity-0"
            }`}
          >
            {photo.sub}
          </span>
        )}
      </span>
    </span>
  );
}
