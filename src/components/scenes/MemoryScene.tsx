"use client";

import Image from "next/image";
import { motion } from "motion/react";
import type { Memory } from "@/data/memories";
import { MemoryIcon } from "@/components/ui/MemoryIcon";
import { SoftButton } from "@/components/ui/SoftButton";
import { rich } from "@/lib/rich";

/**
 * The map zoomed all the way in. A photo (or a warm stand-in), a caption,
 * two or three sentences, and one aside in her handwriting.
 */
export function MemoryScene({
  memory,
  onClose,
}: {
  memory: Memory;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-30 flex items-center justify-center bg-cocoa-900/55 px-5 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={memory.title}
    >
      <motion.div
        initial={{ scale: 0.9, y: 24, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.94, y: 12, opacity: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-sm overflow-hidden rounded-3xl bg-ivory shadow-[0_40px_80px_-30px_rgba(26,15,7,0.85)]"
      >
        <div className="relative aspect-[4/3] w-full bg-gradient-to-br from-cocoa-200 to-cocoa-400">
          {memory.image ? (
            <Image
              src={memory.image}
              alt={memory.caption}
              fill
              sizes="(max-width: 640px) 100vw, 384px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-cocoa-700/70">
              <MemoryIcon name={memory.icon} className="h-10 w-10" />
              <span className="text-[10px] tracking-[0.3em] uppercase">
                Photo goes here
              </span>
            </div>
          )}
        </div>

        <div className="px-6 pt-5 pb-6">
          <p className="text-[10px] font-semibold tracking-[0.35em] text-caramel uppercase">
            {memory.title}
          </p>
          <h2 className="mt-2 font-[family-name:var(--font-display)] text-xl leading-snug text-cocoa-800">
            {rich(memory.caption)}
          </h2>
          <p className="mt-3 text-[0.95rem] leading-relaxed text-mocha">
            {rich(memory.body)}
          </p>

          {memory.aside && (
            <p className="mt-4 font-[family-name:var(--font-hand)] text-xl text-cocoa-500">
              {rich(memory.aside)}
            </p>
          )}

          <div className="mt-6 flex justify-end">
            <SoftButton tone="ghost" onClick={onClose}>
              Back to the map
            </SoftButton>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
