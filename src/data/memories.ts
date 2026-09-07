/**
 * 02 — OUR STORY. The map milestones.
 *
 * ▸ EDIT THIS FILE to make the story hers. Everything else reads from here.
 * ▸ `x` / `y` are percentages on the map canvas. Keep x between 20 and 80
 *   so the label underneath a pin never runs off a phone screen.
 * ▸ `unlockedBy` keeps a place dark until another place has been opened,
 *   so the map is explored in roughly the right order without forcing it.
 *
 * PHOTOS
 * ------
 * Drop image files into  public/images/
 * Then reference them here WITHOUT the word "public", e.g.
 *
 *     public/images/first-day.jpg   →   image: "/images/first-day.jpg"
 *
 * .jpg, .png and .webp all work; .webp is smallest. Roughly 1200px on the
 * long edge is plenty. Until a memory has an image, a warm "Photo goes
 * here" panel is drawn in its place, so nothing breaks while you collect
 * them.
 *
 * EMPHASIS (see src/lib/rich.tsx)
 *   *word*   → accent colour, heavier
 *   ^WORD^   → bold, uppercase, wide tracking
 */
export type Memory = {
  id: string;
  /** Short label on the map pin. */
  title: string;
  /** The one-line caption that shows when the pin is opened. */
  caption: string;
  /** Two or three sentences maximum — the letter carries the long version. */
  body: string;
  /** Optional overheard line, an inside joke, a text you actually sent. */
  aside?: string;
  x: number;
  y: number;
  icon: MemoryIcon;
  /** e.g. "/images/first-day.jpg" — the file lives at public/images/first-day.jpg */
  image?: string;
  unlockedBy?: string;
};

export type MemoryIcon = "spark" | "cup" | "heart" | "star" | "chocolate" | "moon";

export const memories: Memory[] = [
  {
    id: "first",
    title: "Where it started",
    caption: "TODO — the day we met",
    body: "TODO: two or three sentences about the first time. Keep it specific — the place, the weather, the stupid thing one of us said.",
    aside: "TODO: the first thing you remember thinking",
    x: 21,
    y: 60,
    icon: "spark",
    // image: "/images/where-it-started.jpg",
  },
  {
    id: "chocolate",
    title: "The chocolate one",
    caption: "TODO — the chocolate story",
    body: "TODO: the memory that made chocolate *ours*. This is the one the whole site is coloured after, so make it the real one.",
    aside: "TODO: the inside-joke version",
    x: 36,
    y: 28,
    icon: "chocolate",
    unlockedBy: "first",
  },
  {
    id: "laugh",
    title: "The one we still bring up",
    caption: "TODO — the story that never dies",
    body: "TODO: the thing that happened that you two still reference at least once a month.",
    x: 54,
    y: 66,
    icon: "star",
    unlockedBy: "chocolate",
  },
  {
    id: "hard",
    title: "The quiet week",
    caption: "TODO — the harder stretch",
    body: "TODO: one honest, gentle line about a time that wasn't easy, and what she did. Short. This is the beat that makes the rest land.",
    x: 72,
    y: 30,
    icon: "moon",
    unlockedBy: "laugh",
  },
  {
    id: "now",
    title: "Here",
    caption: "TODO — now",
    body: "TODO: where the two of you are today, in one sentence, without promising anything the letter should promise.",
    x: 80,
    y: 64,
    icon: "heart",
    unlockedBy: "hard",
  },
];

export const mapIntro = {
  title: "Our story",
  subtitle: "Tap a place. Some of them are still locked.",
  /** Shown once every pin has been opened. */
  complete: "That's all of them. And it isn't even the surprise.",
};
