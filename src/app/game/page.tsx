"use client";

import { useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { TheGame } from "@/components/scenes/TheGame";
import { useProgress } from "@/lib/progress";

export default function GamePage() {
  const router = useRouter();
  const { progress, ready, update } = useProgress();

  useEffect(() => {
    if (ready && !progress.worldBloomed) router.replace("/");
  }, [ready, progress.worldBloomed, router]);

  const finish = useCallback(() => update({}), [update]);

  if (!ready) return <div className="mat-desk min-h-dvh w-full" />;

  return <TheGame onFinish={finish} />;
}
