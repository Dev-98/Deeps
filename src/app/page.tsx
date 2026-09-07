"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence } from "motion/react";
import { Scene } from "@/components/ui/Scene";
import { StartScene } from "@/components/scenes/StartScene";
import { SecretDoor } from "@/components/scenes/SecretDoor";
import { useProgress } from "@/lib/progress";
import { useTransition } from "@/components/transitions/TransitionProvider";

type Beat = "start" | "door";

export default function EntryPage() {
  const router = useRouter();
  const { update } = useProgress();
  const { go } = useTransition();
  const [beat, setBeat] = useState<Beat>("start");

  useEffect(() => {
    router.prefetch("/story");
  }, [router]);

  const handleUnlock = useCallback(() => {
    update({ doorUnlocked: true });
    go("/story", "doorway");
  }, [update, go]);

  return (
    <Scene className="bg-cream vignette" vignette>
      <AnimatePresence mode="wait" initial={false}>
        {beat === "start" ? (
          <StartScene key="start" onBegin={() => setBeat("door")} />
        ) : (
          <SecretDoor key="door" onUnlock={handleUnlock} />
        )}
      </AnimatePresence>

    </Scene>
  );
}
