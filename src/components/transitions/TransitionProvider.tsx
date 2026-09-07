"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { useReducedMotion } from "motion/react";
import gsap from "gsap";
import { HEART_PATH } from "@/components/ui/Hearts";

/**
 * The transition system.
 *
 * A chapter change is a cut in a film, and every cut here is chosen for
 * what it's cutting between — never one generic effect reused everywhere:
 *
 *   doorway  you pass through an opening into a lit space.
 *            Used wherever the story literally goes through a door.
 *   fold     the scene folds shut like paper and unfolds into the next.
 *            Used between the paper chapters — cards and letters.
 *   sweep    panels draw across and lift away, like a set change.
 *            Used when the room itself changes.
 *   heart    a heart opens out of the middle of the screen and swallows
 *            it whole. Reserved — only the beats that have earned it get
 *            this one, or it stops meaning anything.
 *
 * The overlay lives in the root layout so it survives the route change:
 * it covers the screen, navigates underneath, then uncovers. Nothing ever
 * cuts on a blank frame.
 */
export type TransitionVariant = "doorway" | "fold" | "sweep" | "heart";

type TransitionContextValue = {
  /** Cover the screen, run `action` behind it, then uncover. */
  run: (variant: TransitionVariant, action: () => void) => void;
  /** The same thing, for a route change. */
  go: (href: string, variant?: TransitionVariant) => void;
  busy: boolean;
};

const TransitionContext = createContext<TransitionContextValue | null>(null);

/** How long the new page gets to mount and paint before we uncover. */
const SETTLE_MS = 240;

export function TransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const reduced = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState(false);
  const busyRef = useRef(false);

  const cover = useCallback((variant: TransitionVariant) => {
    return new Promise<void>((resolve) => {
      const scope = rootRef.current;
      if (!scope) return resolve();

      const ctx = gsap.context(() => {
        const tl = gsap.timeline({ onComplete: () => resolve() });
        tl.set(scope, { visibility: "visible" });

        if (variant === "doorway") {
          tl.set(".tr-doorway", { opacity: 1 })
            .fromTo(
              ".tr-dw-arch",
              { scale: 0.05, opacity: 0, yPercent: 6 },
              { opacity: 1, duration: 0.28, ease: "power1.out" },
            )
            .to(
              ".tr-dw-arch",
              { scale: 34, yPercent: 0, duration: 1.05, ease: "power3.inOut" },
              "<",
            )
            .fromTo(
              ".tr-dw-glow",
              { scale: 0.25, opacity: 0 },
              { scale: 7, opacity: 0.95, duration: 1, ease: "power2.out" },
              "<",
            );
        }

        if (variant === "fold") {
          tl.set(".tr-fold", { opacity: 1 })
            .fromTo(
              ".tr-fold-top",
              { rotateX: -94 },
              { rotateX: 0, duration: 0.78, ease: "power3.inOut" },
            )
            .fromTo(
              ".tr-fold-bottom",
              { rotateX: 94 },
              { rotateX: 0, duration: 0.78, ease: "power3.inOut" },
              "<",
            )
            .fromTo(
              ".tr-fold-seam",
              { opacity: 0, scaleX: 0.2 },
              { opacity: 1, scaleX: 1, duration: 0.35, ease: "power2.out" },
              "-=0.28",
            );
        }

        if (variant === "sweep") {
          tl.set(".tr-sweep", { opacity: 1 }).fromTo(
            ".tr-sweep-col",
            { yPercent: 101 },
            {
              yPercent: 0,
              duration: 0.72,
              ease: "power3.inOut",
              stagger: 0.055,
            },
          );
        }

        if (variant === "heart") {
          tl.set(".tr-heart", { opacity: 1 })
            .fromTo(
              ".tr-heart-shape",
              { scale: 0.04, opacity: 0, rotate: -6 },
              { opacity: 1, duration: 0.22, ease: "power1.out" },
            )
            // a beat before it opens, so it reads as a heartbeat
            .to(".tr-heart-shape", { scale: 0.09, duration: 0.16, ease: "power2.out" }, "<")
            .to(".tr-heart-shape", { scale: 0.065, duration: 0.14, ease: "power2.in" })
            .to(".tr-heart-shape", {
              scale: 26,
              rotate: 0,
              duration: 1.15,
              ease: "power3.inOut",
            })
            .fromTo(
              ".tr-heart-glow",
              { scale: 0.3, opacity: 0 },
              { scale: 8, opacity: 0.9, duration: 1.1, ease: "power2.out" },
              "<",
            )
            .fromTo(
              ".tr-heart-bit",
              { scale: 0, opacity: 0, y: 0 },
              {
                scale: 1,
                opacity: 1,
                y: -140,
                duration: 1.1,
                ease: "power2.out",
                stagger: 0.05,
              },
              "<0.1",
            );
        }
      }, scope);

      // GSAP contexts are reverted by the reveal pass, not here.
      void ctx;
    });
  }, []);

  const reveal = useCallback((variant: TransitionVariant) => {
    return new Promise<void>((resolve) => {
      const scope = rootRef.current;
      if (!scope) return resolve();

      gsap.context(() => {
        const tl = gsap.timeline({
          onComplete: () => {
            gsap.set(scope, { visibility: "hidden" });
            gsap.set([".tr-doorway", ".tr-fold", ".tr-sweep", ".tr-heart"], {
              opacity: 0,
            });
            resolve();
          },
        });

        if (variant === "doorway") {
          tl.to(".tr-dw-glow", { opacity: 0, duration: 0.55, ease: "power2.in" })
            .to(
              ".tr-dw-arch",
              { scale: 52, opacity: 0, duration: 0.8, ease: "power2.inOut" },
              "<",
            );
        }

        if (variant === "fold") {
          tl.to(".tr-fold-seam", { opacity: 0, duration: 0.25 })
            .to(
              ".tr-fold-top",
              { rotateX: -94, duration: 0.8, ease: "power3.inOut" },
              "<",
            )
            .to(
              ".tr-fold-bottom",
              { rotateX: 94, duration: 0.8, ease: "power3.inOut" },
              "<",
            );
        }

        if (variant === "sweep") {
          tl.to(".tr-sweep-col", {
            yPercent: -101,
            duration: 0.78,
            ease: "power3.inOut",
            stagger: 0.055,
          });
        }

        if (variant === "heart") {
          tl.to(".tr-heart-bit", { opacity: 0, duration: 0.3 })
            .to(".tr-heart-glow", { opacity: 0, duration: 0.5 }, "<")
            .to(
              ".tr-heart-shape",
              { scale: 42, opacity: 0, duration: 0.95, ease: "power2.inOut" },
              "<",
            );
        }
      }, scope);
    });
  }, []);

  /** Nothing may hold the screen hostage. */
  const release = useCallback(() => {
    const scope = rootRef.current;
    if (scope) {
      gsap.killTweensOf(scope.querySelectorAll("*"));
      gsap.set(scope, { visibility: "hidden" });
      gsap.set(
        scope.querySelectorAll(".tr-doorway, .tr-fold, .tr-sweep, .tr-heart"),
        { opacity: 0 },
      );
    }
    busyRef.current = false;
    setBusy(false);
  }, []);

  const run = useCallback<TransitionContextValue["run"]>(
    (variant, action) => {
      if (busyRef.current) return;
      busyRef.current = true;
      setBusy(true);

      // If a timeline ever stalls — a slow device, a backgrounded tab —
      // the overlay is torn down anyway rather than covering the story.
      const watchdog = window.setTimeout(release, 6000);

      if (reduced) {
        action();
        window.setTimeout(() => {
          window.clearTimeout(watchdog);
          release();
        }, 250);
        return;
      }

      void cover(variant).then(() => {
        action();
        window.setTimeout(() => {
          void reveal(variant).then(() => {
            window.clearTimeout(watchdog);
            busyRef.current = false;
            setBusy(false);
          });
        }, SETTLE_MS);
      });
    },
    [cover, reveal, reduced, release],
  );

  const go = useCallback<TransitionContextValue["go"]>(
    (href, variant = "sweep") => {
      router.prefetch(href);
      run(variant, () => router.push(href));
    },
    [router, run],
  );

  return (
    <TransitionContext.Provider value={{ run, go, busy }}>
      {children}

      {/*
        While a transition runs the overlay swallows input. Without this a
        tap can land on the incoming chapter before React has wired it up,
        and the tap silently does nothing — which reads as a broken button.
      */}
      <div
        ref={rootRef}
        aria-hidden
        style={{ visibility: "hidden" }}
        className={`fixed inset-0 z-[60] overflow-hidden ${
          busy ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        {/* ---------------------- doorway ---------------------- */}
        <div className="tr-doorway absolute inset-0 flex items-center justify-center opacity-0">
          <div
            className="tr-dw-glow absolute h-56 w-56 rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(255,246,226,0.95) 0%, rgba(255,214,148,0.55) 45%, rgba(255,214,148,0) 72%)",
            }}
          />
          <div
            className="tr-dw-arch relative h-32 w-24 rounded-t-full"
            style={{
              background:
                "linear-gradient(180deg,#fffaf0 0%,#ffe6c4 42%,#f7efe3 100%)",
              willChange: "transform",
            }}
          />
        </div>

        {/* ------------------------ fold ----------------------- */}
        <div
          className="tr-fold absolute inset-0 opacity-0"
          style={{ perspective: "1600px" }}
        >
          <div
            className="tr-fold-top absolute inset-x-0 top-0 h-1/2 origin-top"
            style={{
              background:
                "linear-gradient(180deg,#fdf6ea 0%,#f4e6d0 78%,#e8d6ba 100%)",
              boxShadow: "0 14px 30px -10px rgba(42,25,12,0.5)",
            }}
          />
          <div
            className="tr-fold-bottom absolute inset-x-0 bottom-0 h-1/2 origin-bottom"
            style={{
              background:
                "linear-gradient(0deg,#fdf6ea 0%,#f4e6d0 78%,#e8d6ba 100%)",
              boxShadow: "0 -14px 30px -10px rgba(42,25,12,0.5)",
            }}
          />
          <div
            className="tr-fold-seam absolute inset-x-0 top-1/2 h-px -translate-y-1/2 opacity-0"
            style={{
              background:
                "linear-gradient(90deg,transparent,rgba(201,138,69,0.9),transparent)",
            }}
          />
        </div>

        {/* ------------------------ heart ---------------------- */}
        <div className="tr-heart absolute inset-0 flex items-center justify-center opacity-0">
          <div
            className="tr-heart-glow absolute h-56 w-56 rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(255,217,232,0.95) 0%, rgba(255,111,156,0.5) 42%, rgba(255,111,156,0) 72%)",
            }}
          />

          {/* small hearts thrown off as it opens */}
          {HEART_BITS.map((b, i) => (
            <span
              key={i}
              className="tr-heart-bit absolute"
              style={{ left: b.x, top: b.y }}
            >
              <svg viewBox="0 0 32 32" width={b.s} height={b.s} aria-hidden>
                <path d={HEART_PATH} fill={b.c} />
              </svg>
            </span>
          ))}

          <svg
            viewBox="0 0 32 32"
            width={64}
            height={64}
            className="tr-heart-shape relative"
            /*
              No filter here. A drop-shadow on a shape scaled 26x is an
              enormous composited layer — it drops the frame rate to single
              digits and the timeline stops advancing. The glow behind it
              does the same job for free.
            */
            style={{ overflow: "visible", willChange: "transform" }}
            aria-hidden
          >
            <defs>
              <linearGradient id="tr-heart-fill" x1="0" y1="0" x2="0.4" y2="1">
                <stop offset="0%" stopColor="#ffd9e8" />
                <stop offset="45%" stopColor="#ff8fb3" />
                <stop offset="100%" stopColor="#e0457b" />
              </linearGradient>
            </defs>
            <path d={HEART_PATH} fill="url(#tr-heart-fill)" />
          </svg>
        </div>

        {/* ------------------------ sweep ---------------------- */}
        <div className="tr-sweep absolute inset-0 flex opacity-0">
          {SWEEP_COLS.map((tone, i) => (
            <div
              key={i}
              className="tr-sweep-col relative h-full flex-1"
              style={{ background: tone }}
            >
              <span
                className="absolute inset-x-0 top-0 h-px"
                style={{ background: "rgba(201,138,69,0.85)" }}
              />
            </div>
          ))}
        </div>
      </div>
    </TransitionContext.Provider>
  );
}

/** The little hearts the big one scatters on its way open. */
const HEART_BITS = [
  { x: "22%", y: "38%", s: 16, c: "#ffb3ce" },
  { x: "74%", y: "32%", s: 12, c: "#ff6f9c" },
  { x: "36%", y: "62%", s: 14, c: "#ffd9e8" },
  { x: "64%", y: "68%", s: 18, c: "#ff8fb3" },
  { x: "48%", y: "24%", s: 10, c: "#e0457b" },
  { x: "86%", y: "58%", s: 13, c: "#ffb3ce" },
];

/** Subtly different tones per column, so the sweep has depth. */
const SWEEP_COLS = [
  "linear-gradient(180deg,#3d2511,#241606)",
  "linear-gradient(180deg,#452a14,#2a190c)",
  "linear-gradient(180deg,#38220f,#1d1108)",
  "linear-gradient(180deg,#432813,#281709)",
  "linear-gradient(180deg,#35200e,#1a0f07)",
];

export function useTransition() {
  const ctx = useContext(TransitionContext);
  if (!ctx) {
    throw new Error("useTransition must be used inside <TransitionProvider>");
  }
  return ctx;
}
