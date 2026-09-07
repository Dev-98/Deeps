"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LetterRoom } from "@/components/scenes/LetterRoom";
import { useProgress } from "@/lib/progress";

export default function LettersPage() {
  const router = useRouter();
  const { progress, ready } = useProgress();

  useEffect(() => {
    if (ready && !progress.worldBloomed) router.replace("/");
  }, [ready, progress.worldBloomed, router]);

  if (!ready) return <div className="mat-desk min-h-dvh w-full" />;

  return <LetterRoom />;
}
