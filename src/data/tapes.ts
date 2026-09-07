/**
 * THE CASSETTES.
 *
 * Not a chapter — a drawer that peeks in from the edge of every screen,
 * so the whole thing has sound instead of going by in silence.
 *
 * ADDING A TAPE
 * -------------
 * 1. Drop the file in  public/audio/
 * 2. Add a row below. `src` drops the word "public":
 *
 *        public/audio/Khat.mp3   →   src: "/audio/Khat.mp3"
 *
 * TWO THINGS THAT BITE ON DEPLOY, both about the filename:
 *
 *   Case.    "Khat.mp3" and "khat.mp3" are the same file on a Mac and
 *            different files on Vercel. Match it exactly.
 *
 *   Spaces.  A space is not legal in a URL. If the file is called
 *            "Sajjan Raazi.mp3", the src must be
 *            "/audio/Sajjan%20Raazi.mp3" — %20 for each space. Browsers
 *            usually paper over this, but "usually" is not something to
 *            ship a birthday present on. Either encode it like the rows
 *            below, or rename the file with hyphens.
 *
 * A tape whose file is missing isn't a crash: the drawer dims it and says
 * so, and the others keep working. That's deliberate so you can list the
 * tapes you intend to add and fill them in over time.
 *
 * `shell` and `label` are the cassette's plastic and its sticker — give
 * each one a different pair so the rack looks like a real handful of
 * tapes rather than four of the same object.
 */
export type Tape = {
  id: string;
  /** Written on the cassette's label. Keep it short — it has to fit. */
  title: string;
  /** Small line under the title. The artist, or a note to her. */
  note?: string;
  src: string;
  shell: string;
  label: string;
  ink: string;
};

export const tapes: Tape[] = [
  {
    id: "khat",
    title: "Khat",
    // NOTE: I made this line up so the drawer wasn't blank — change it or
    // delete it. `note` is optional; leave it off and nothing shows.
    note: "the one you sent me",
    src: "/audio/Khat.mp3",
    shell: "#6d4526",
    label: "#f3e2c8",
    ink: "#3d2511",
  },
  {
    id: "sajjan-raazi",
    title: "Sajjan Raazi",
    // note: "TODO — add a line if you want one",
    src: "/audio/Sajjan%20Raazi.mp3",
    shell: "#a12a63",
    label: "#ffe3ef",
    ink: "#5a1030",
  },
  {
    id: "tumse-behtar",
    title: "Tumse Behtar",
    // note: "TODO — add a line if you want one",
    src: "/audio/Tumse%20Behtar.mp3",
    shell: "#2f5a6b",
    label: "#e3f1f6",
    ink: "#123240",
  },
];

export const tapeCopy = {
  /** On the drawer handle, before she's opened it. */
  peek: "Tapes",
  title: "Put something on",
  subtitle: "Pick one. It'll follow you around.",
  nothing: "Nothing playing",
  missing: "Not in the folder yet",
  /** The volume the music sits at, so it never fights the writing. */
  volume: 0.45,
};
