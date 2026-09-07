"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence } from "motion/react";
import { Scene } from "@/components/ui/Scene";
import { BeforeYou } from "@/components/scenes/BeforeYou";
import { OurStory } from "@/components/scenes/OurStory";
import { useProgress } from "@/lib/progress";
import { useTransition } from "@/components/transitions/TransitionProvider";

/**
 * One route, two continuous chapters: BEFORE YOU blooms directly into
 * OUR STORY. The doc asks for a continuous experience with routes only at
 * the major seams, and this is one seam.
 */
export default function StoryPage() {
  const router = useRouter();
  const { progress, ready, update } = useProgress();
  const { run } = useTransition();
  const [showMap, setShowMap] = useState(false);

  // Nobody arrives here without the door.
  useEffect(() => {
    if (ready && !progress.doorUnlocked) router.replace("/");
  }, [ready, progress.doorUnlocked, router]);

  // Coming back later skips straight to the map she already bloomed.
  useEffect(() => {
    if (ready && progress.worldBloomed) setShowMap(true);
  }, [ready, progress.worldBloomed]);

  /** She taps "Show me"; the set changes behind a sweep. */
  const handleLeave = useCallback(() => {
    run("heart", () => {
      update({ worldBloomed: true });
      setShowMap(true);
    });
  }, [run, update]);

  if (!ready) {
    return (
      <Scene className="bg-cream" grain={false}>
        {null}
      </Scene>
    );
  }

  return (
    <Scene className="bg-[#c9cee4] !p-0" grain={false}>
      <AnimatePresence mode="wait" initial={false}>
        {showMap ? (
          <OurStory key="map" />
        ) : (
          <BeforeYou key="before" onLeave={handleLeave} />
        )}
      </AnimatePresence>
    </Scene>
  );
}
