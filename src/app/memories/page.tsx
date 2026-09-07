"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { MemoryLane } from "@/components/scenes/MemoryLane";
import { useProgress } from "@/lib/progress";

export default function MemoriesPage() {
  const router = useRouter();
  const { progress, ready } = useProgress();

  useEffect(() => {
    if (ready && !progress.worldBloomed) router.replace("/");
  }, [ready, progress.worldBloomed, router]);

  if (!ready) return <div className="min-h-dvh w-full bg-[#150d12]" />;

  return <MemoryLane />;
}
