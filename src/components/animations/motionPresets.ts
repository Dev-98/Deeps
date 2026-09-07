import type { Transition, Variants } from "motion/react";

export const soft: Transition = { duration: 0.7, ease: [0.22, 1, 0.36, 1] };
export const softSlow: Transition = { duration: 1.2, ease: [0.22, 1, 0.36, 1] };

export const riseIn: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: soft },
};

export const stagger = (delay = 0.12): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: delay, delayChildren: 0.15 } },
});
