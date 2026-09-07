import type { ReactNode } from "react";

type SceneProps = {
  children: ReactNode;
  /** Tailwind background utilities for this chapter's world. */
  className?: string;
  grain?: boolean;
  vignette?: boolean;
};

/**
 * Every chapter is a full-viewport stage. Scenes never scroll by default —
 * the story moves, not the page.
 *
 * Deliberately a plain server-renderable element with a CSS entrance: the
 * first thing she sees must not depend on JavaScript having run.
 */
export function Scene({
  children,
  className = "",
  grain = true,
  vignette = false,
}: SceneProps) {
  return (
    <main
      className={[
        "anim-fade relative flex min-h-dvh w-full flex-col items-center justify-center overflow-hidden px-6 py-10",
        grain ? "paper-grain" : "",
        vignette ? "vignette" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </main>
  );
}
