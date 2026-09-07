/**
 * 04 — THE LETTER ROOM.
 *
 * These are NOT the handwritten letter. They are short, specific and
 * mostly light; one of them is allowed to be sincere, and the last one
 * exists to be opened against instructions.
 *
 * The text below is a real draft in your voice, not a placeholder —
 * rewrite the specifics, keep the shape. The one thing to change first is
 * anything that reads as generic; the details are what make it hers.
 *
 * ▸ `tone` changes the paper and the wax seal:
 *     "warm"    cream paper, caramel seal
 *     "playful" pale paper, rose seal
 *     "tender"  the sincere one — deeper paper, deep seal
 *     "forbid"  the one she's told not to open
 *
 * Emphasis markup (see src/lib/rich.tsx):
 *   *word*   → accent colour, heavier    ^WORD^ → bold, uppercase
 */
export type Tone = "warm" | "playful" | "tender" | "forbid";

export type Letter = {
  id: string;
  label: string;
  hint?: string;
  body: string[];
  signoff?: string;
  tone: Tone;
};

export const letters: Letter[] = [
  {
    id: "open-me",
    label: "Open me",
    hint: "Start here",
    tone: "warm",
    body: [
      "Hi *Buubuu*. You found the easy one. I'm going to assume you opened these in order, which would be very unlike you.",
      "Nothing heavy in here, I promise. I just wanted the first thing you read in this room to be me saying hello properly.",
    ],
    signoff: "— your Guuguu",
  },
  {
    id: "smile",
    label: "When you need to smile",
    hint: "Save this one",
    tone: "playful",
    body: [
      "Don't read this today, babes. Save it for a Tuesday — the grey kind, where someone has already annoyed you before ten in the morning.",
      "On that day: you are *my queen*, you are much funnier than you think you are, and I am somewhere across town thinking about you and getting absolutely nothing done.",
    ],
    signoff: "— G",
  },
  {
    /**
     * The sincere one. This is a real draft — the shape and the length are
     * right, the specifics are yours. Say the true thing, then stop; the
     * handwritten letter is where the rest belongs.
     */
    id: "almost",
    label: "The one I almost didn't write",
    tone: "tender",
    body: [
      "I make jokes because they're easier. This one is the exception, so give me a second.",
      "You made my life *softer*. That's the honest word for it — not bigger, not louder. Softer. I stopped bracing for things somewhere along the way, and it took me embarrassingly long to work out that it was you.",
      "That's all I'll say here. The rest is in the letter, in my actual handwriting, where it should be.",
    ],
    signoff: "— yours, all of it",
  },
  {
    /**
     * THE WAY OUT.
     * She doesn't have to read the other three — opening this one is what
     * unlocks the next chapter, because of course she opens this one.
     */
    id: "forbidden",
    label: "Definitely do not open",
    hint: "I mean it",
    tone: "forbid",
    body: [
      "*Bacha.* It says do not open. In writing. On the front.",
      "You lasted, what, four seconds? I knew you would — that's exactly why the way forward is behind this one and not any of the others. Go on then.",
    ],
    signoff: "— predictably, Guuguu",
  },
];

/** Opening this envelope opens the way onward. The rest are optional. */
export const gateLetterId = "forbidden";

export const letterCopy = {
  eyebrow: "Chapter Four",
  title: "I wrote some things down.",
  subtitle: "Four envelopes. One of them says not to open it.",
  allRead: "That's all of them. Even the one you were told to leave alone.",
  gateOpened: "Well. You've never once done as you were told.",
  onward: "There's a box of photos too",
  forbidNudge: "You opened it first, didn't you.",
};
