import type { ReactNode } from "react";

/**
 * A very small markup so the words can carry emphasis from the data files,
 * without anyone touching a component:
 *
 *   *like this*   → the emphasised word (heavier, in the accent colour)
 *   ^LIKE THIS^   → small caps, wide tracking — for the loud beats
 *
 * Anything else is left exactly as written.
 */
export function rich(text: string): ReactNode {
  const parts = text.split(/(\*[^*]+\*|\^[^^]+\^)/g);

  return parts.map((part, i) => {
    if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
      return (
        <em key={i} className="font-semibold text-caramel not-italic">
          {part.slice(1, -1)}
        </em>
      );
    }
    if (part.startsWith("^") && part.endsWith("^") && part.length > 2) {
      return (
        <strong key={i} className="font-bold tracking-[0.08em] text-cocoa-900 uppercase">
          {part.slice(1, -1)}
        </strong>
      );
    }
    return part;
  });
}
