"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Retired.
 *
 * This was chapter 05, a whole room about songs. It came out because the
 * songs weren't part of the story — the music belongs everywhere instead,
 * and it now lives in the cassette drawer in the root layout.
 *
 * The route stays as a redirect so an open tab or a bookmark doesn't hit
 * a dead end.
 */
export default function RetiredSoundtrackPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/memories");
  }, [router]);

  return <div className="min-h-dvh w-full bg-[#150d12]" />;
}
