/**
 * 10 — ONE MORE THING, and FINAL — ONE MORE YEAR.
 *
 * THE VIDEO
 * ---------
 * Put the file at  public/video/one-more-thing.mp4  and it appears
 * automatically. Nothing else to change.
 *
 * - .mp4 (H.264 + AAC) plays everywhere. Anything else is a gamble on her
 *   phone, so convert first.
 * - Shoot or export it vertical if you can — she will almost certainly
 *   watch it on a phone.
 * - Keep it under ~50MB or the wait becomes part of the memory. Two
 *   minutes at 1080p is usually fine.
 * - A poster frame at public/video/poster.jpg is optional and makes the
 *   moment before you press play look intentional.
 * - It never autoplays. She presses it.
 *
 * If the file isn't there yet, the chapter still works — it shows a
 * placeholder that says the video is coming, so you can test the flow
 * before you've filmed anything.
 */
export const video = {
  src: "/video/one-more-thing.mp4",
  poster: "/video/poster.jpg",
  eyebrow: "Chapter Nine",
  title: "One more thing.",
  invite: "It's about two minutes. Put your headphones in.",
  /** Shown if the file isn't in place yet. */
  missing: "The video isn't in the folder yet.",
  missingHint: "public/video/one-more-thing.mp4",
  after: "That's the actual present, Buubuu.",
  onward: "One more page",
};

/**
 * FINAL — ONE MORE YEAR.
 *
 * End quietly. Do not try to outdo the video. One short original thought,
 * her name, and the words. Everything else has already been said, and the
 * handwritten letter says the rest.
 */
export const final = {
  line: "I've been told I exaggerate, so take this as carefully as I mean it: you are the best thing that has ever happened to me. One more year of you, please — and then all the rest of them.",
  closing: "Happy birthday",
  replay: "Read it again",
};
