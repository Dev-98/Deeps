/**
 * 06 — MEMORY LANE.
 *
 * Not a gallery. A box of undeveloped polaroids: each one is blank until
 * she taps it, and then it develops in her hand.
 *
 * PHOTOS: drop files in public/images/ and reference them without the
 * word "public" — public/images/us.jpg → image: "/images/us.jpg".
 * A polaroid with no image still develops; it just shows a warm blank
 * frame, so the chapter works while you're still gathering them.
 *
 * `caption` is written on the white border in handwriting — keep it to a
 * few words, the way you'd actually label a photo.
 */
export type Polaroid = {
  id: string;
  caption: string;
  /** Optional second line, smaller — a date, a place, an aside. */
  sub?: string;
  image?: string;
  /** Degrees of tilt in the pile. */
  rotate: number;
};

export const polaroids: Polaroid[] = [
  { id: "p1", caption: "TODO — a few words", sub: "TODO — where", rotate: -6 },
  { id: "p2", caption: "TODO — a few words", sub: "TODO — when", rotate: 4 },
  { id: "p3", caption: "TODO — a few words", rotate: -2 },
  { id: "p4", caption: "TODO — a few words", sub: "TODO", rotate: 7 },
  { id: "p5", caption: "TODO — a few words", rotate: -5 },
  { id: "p6", caption: "TODO — a few words", sub: "TODO", rotate: 3 },
];

export const memoryCopy = {
  eyebrow: "Chapter Five",
  title: "These were in a box.",
  subtitle: "Tap one. They haven't developed yet.",
  developed: (n: number, total: number) => `${n} of ${total} developed`,
  onward: "There's one more room",
  /** Shown once she's developed at least this many. */
  needed: 3,
};
