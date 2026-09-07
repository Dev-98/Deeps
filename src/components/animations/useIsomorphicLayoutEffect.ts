import { useEffect, useLayoutEffect } from "react";

/** GSAP setup must run before paint on the client, but must not warn on the server. */
export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;
