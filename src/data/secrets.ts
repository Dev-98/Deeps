/**
 * 07 — THE SECRET HUNT.
 *
 * Five small things hidden in the corners of five earlier chapters. They
 * gate nothing; finding them is its own reward, and finding all five
 * opens a room that otherwise doesn't exist.
 *
 * Each one is placed by dropping <Secret id="..." /> into a scene with a
 * position. They're deliberately easy to miss and impossible to
 * accidentally need.
 */
export type SecretDef = {
  id: string;
  /** Where it's hiding — only ever shown after she's found it. */
  where: string;
  /** The shape it takes. */
  kind: "heart" | "star" | "key" | "flower" | "square";
};

export const secretDefs: SecretDef[] = [
  { id: "door", where: "Pressed into the chocolate, on the very first screen", kind: "square" },
  { id: "map", where: "On the map, in the hills", kind: "star" },
  { id: "game", where: "Down on the card table", kind: "heart" },
  { id: "letters", where: "On the desk, under the envelopes", kind: "key" },
  { id: "memories", where: "Up in the corner of the darkroom", kind: "flower" },
];

export const huntCopy = {
  firstFind: "You found something.",
  progress: (n: number) => `${n} of ${secretDefs.length}`,
  complete: "Five out of five. Nothing gets past you.",
  eyebrow: "Chapter Six",
  title: "You weren't supposed to find all of those.",
  body: "They were hidden properly — corners, edges, tucked behind things. You found every single one, which is the most you thing that has ever happened.",
  reward:
    "So here's what they were for. I wanted something in here that wasn't part of the show \u2014 something you'd only ever get for *noticing*. You notice everything, babes. You notice when I'm quiet for the wrong reason. Thank you for that. Nobody else does it.",
  onward: "Alright. Come on.",
};
