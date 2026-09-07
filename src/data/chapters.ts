/**
 * The thirteen beats of the storyboard, and how far the build has got.
 * The closing screen reads from this, so it stays honest as chapters land:
 * flip `built` to true as each one ships.
 */
export const chapters = [
  { n: "00", title: "The Secret Door", built: true },
  { n: "01", title: "Before You", built: true },
  { n: "02", title: "Our Story", built: true },
  { n: "03", title: "The Game", built: true },
  { n: "04", title: "The Letter Room", built: true },
  { n: "05", title: "Memory Lane", built: true },
  { n: "06", title: "The Secret Hunt", built: true },
  { n: "07", title: "The Wish", built: true },
  { n: "08", title: "The Birthday", built: true },
  { n: "09", title: "One More Thing", built: true },
  { n: "10", title: "One More Year", built: true },
] as const;
