/**
 * 03 — THE GAME.
 *
 * Five questions, and none of them should be answerable by a stranger.
 * The right answer earns something affectionate; a wrong one earns a
 * teasing line, never a buzzer. She cannot lose this game — getting one
 * wrong just means a funnier reply.
 *
 * ▸ EDIT THIS FILE. `correct` is the index into `options` (0-based).
 * ▸ Wrong answers can have their own reply: give `replies` a line per
 *   option and the matching one is used. Otherwise `wrong` is the
 *   fallback.
 *
 * Emphasis markup (see src/lib/rich.tsx):
 *   *word*   → accent colour, heavier
 *   ^WORD^   → bold, uppercase, wide tracking
 */
export type Question = {
  id: string;
  /** Keep it short enough to read in one breath. */
  prompt: string;
  options: string[];
  correct: number;
  /** Shown when she gets it right. */
  right: string;
  /** Fallback for a wrong answer. */
  wrong: string;
  /** Optional per-option teasing, indexed like `options`. */
  replies?: (string | null)[];
};

export const questions: Question[] = [
  {
    id: "q1",
    prompt: "TODO — What did I say the first time we properly talked?",
    options: ["TODO option A", "TODO option B", "TODO option C"],
    correct: 0,
    right: "Correct. You've been holding that over me ever since.",
    wrong: "No. And the fact that you'd believe that about me is worrying.",
    replies: [null, "Not even close.", "Absolutely not."],
  },
  {
    id: "q2",
    prompt: "TODO — Which of these have I definitely done?",
    options: ["TODO option A", "TODO option B", "TODO option C"],
    correct: 1,
    right: "Yes. Sadly, yes.",
    wrong: "I would *never*. Try again.",
  },
  {
    id: "q3",
    prompt: "TODO — What's the one thing I always say when you ask?",
    options: ["TODO option A", "TODO option B", "TODO option C"],
    correct: 2,
    right: "Every single time. You could have said it with me.",
    wrong: "You've heard me say it a hundred times.",
  },
  {
    id: "q4",
    prompt: "TODO — Where would I take you with no notice at all?",
    options: ["TODO option A", "TODO option B", "TODO option C"],
    correct: 0,
    right: "Obviously. Bag's basically packed.",
    wrong: "Bold of you to think I'd survive that.",
  },
  {
    id: "q5",
    prompt: "TODO — Last one. What am I most annoying about?",
    options: ["TODO option A", "TODO option B", "TODO option C"],
    correct: 1,
    right: "You knew that instantly, didn't you.",
    wrong: "Generous. Wrong, but generous.",
  },
];

export const gameCopy = {
  eyebrow: "Chapter Three",
  title: "How well do you actually know me?",
  subtitle: "Five questions. You cannot lose — some answers are just funnier.",
  begin: "Deal me in",
  /** Scored out of questions.length, keyed by how many she got right. */
  verdicts: [
    "Zero. Genuinely impressive in its own way.",
    "One. We'll workshop it.",
    "Two. Respectable.",
    "Three. Solid. Suspiciously solid.",
    "Four. Show-off.",
    "All five. Of course.",
  ],
  /** The last card isn't a question. */
  doorTitle: "There's one more card.",
  doorBody: "It isn't a question.",
  doorAction: "Turn it over",
};
