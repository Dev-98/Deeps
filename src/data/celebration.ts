/**
 * 08 THE WISH and 09 THE BIRTHDAY — all the words in one place.
 *
 * Written soft with a little teasing. Rewrite freely; the only rule is
 * that the birthday screen stays short. Everything on it competes with
 * confetti, so nothing long survives.
 */
export const wish = {
  eyebrow: "Chapter Seven",
  title: "Almost there, my queen.",
  /**
   * The three beats before she blows, in order. They advance on their own
   * — no tapping — because "close your eyes" and "tap to continue" are a
   * contradiction. The candle only becomes tappable on the last one.
   */
  steps: [
    "Close your eyes.",
    "Make a wish. A real one.",
    "Now blow it out.",
  ],
  /** The small label under the cake once the candle is armed. */
  hint: "Tap the candle",
  /** On the black, after the flame is gone. This is the whole point of
   *  the chapter, so it is not subtle. */
  after: "I already got mine.",
};

export const birthday = {
  eyebrow: "Happy Birthday",
  /** Under her name. Keep it to three or four words. */
  line: "There she is.",
  /** The button that quiets the party down. */
  hush: "Okay, okay",
  /** The fake-out, in order. */
  fakeout: {
    one: "Okay. That's your surprise.",
    close: "Close it",
    two: "Actually.",
    three: "No.",
    onward: "Sit down, bacha",
  },
};
