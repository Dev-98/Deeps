"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { TheWish } from "@/components/scenes/TheWish";
import { useProgress } from "@/lib/progress";

export default function WishPage() {
  const router = useRouter();
  const { progress, ready } = useProgress();

  useEffect(() => {
    if (ready && !progress.worldBloomed) router.replace("/");
  }, [ready, progress.worldBloomed, router]);

  if (!ready) return <div className="min-h-dvh w-full bg-[#0a0510]" />;

  return <TheWish />;
}
