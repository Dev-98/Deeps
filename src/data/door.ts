/**
 * The gate to everything else. One question only she can answer.
 * Answers are compared loosely: case, spacing and punctuation are ignored,
 * so "guu guu", "Guuguu!" and "GUUGUU" all open the door.
 *
 * Emphasis markup (see src/lib/rich.tsx):
 *   *word*   → accent colour, heavier
 *   ^WORD^   → bold, uppercase, wide tracking
 */
export const door = {
  question: "Before anything else — what do you call me?",
  hint: "You have never once used my actual name.",
  accepted: ["guuguu", "gugu", "guugu", "gu gu"],
  placeholder: "Type it the way you always say it",
  /** Teasing, in order. The last one is the giveaway. */
  wrongReplies: [
    "No. Try again — and this time think about how you *actually* talk to me.",
    "Absolutely not. Nobody has ever called me that.",
    "You're doing this on purpose now.",
    "Fine. It starts with a ^G^, and you say it in that voice.",
  ],
  welcome: "There you are.",
} as const;

export function opensTheDoor(input: string) {
  const normalized = input.toLowerCase().replace(/[^a-z]/g, "");
  return door.accepted.some((a) => a.replace(/[^a-z]/g, "") === normalized);
}
