"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

/**
 * One small central state for the whole experience.
 * Everything a chapter needs to know about what came before lives here,
 * and nothing else keeps its own ad-hoc flags.
 */
export type Progress = {
  doorUnlocked: boolean;
  worldBloomed: boolean;
  unlockedMemories: string[];
  quizScore: number;
  lettersOpened: string[];
  secretsFound: string[];
  finalUnlocked: boolean;
};

export const EMPTY_PROGRESS: Progress = {
  doorUnlocked: false,
  worldBloomed: false,
  unlockedMemories: [],
  quizScore: 0,
  lettersOpened: [],
  secretsFound: [],
  finalUnlocked: false,
};

/**
 * Bumping this discards every older saved run. Bump it whenever the shape
 * of Progress changes, or whenever half-finished states from development
 * would otherwise drop someone into the middle of the story.
 */
const STORAGE_KEY = "her-birthday-progress-v2";

function read(): Progress {
  if (typeof window === "undefined") return EMPTY_PROGRESS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_PROGRESS;
    const parsed = JSON.parse(raw) as Partial<Progress>;
    return { ...EMPTY_PROGRESS, ...parsed };
  } catch {
    return EMPTY_PROGRESS;
  }
}

function write(value: Progress) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {
    /* private mode, quota, whatever — the story still works. */
  }
}

type ProgressContextValue = {
  progress: Progress;
  /** True once she is somewhere other than the very beginning. */
  started: boolean;
  /** True once localStorage has been read; guards against hydration flicker. */
  ready: boolean;
  update: (patch: Partial<Progress> | ((p: Progress) => Partial<Progress>)) => void;
  addToList: (key: ListKey, value: string) => void;
  has: (key: ListKey, value: string) => boolean;
  reset: () => void;
};

type ListKey = "unlockedMemories" | "lettersOpened" | "secretsFound";

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [progress, setProgress] = useState<Progress>(EMPTY_PROGRESS);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setProgress(read());
    setReady(true);
  }, []);

  const update = useCallback<ProgressContextValue["update"]>((patch) => {
    setProgress((prev) => {
      const delta = typeof patch === "function" ? patch(prev) : patch;
      const next = { ...prev, ...delta };
      write(next);
      return next;
    });
  }, []);

  const addToList = useCallback(
    (key: ListKey, value: string) => {
      update((prev) =>
        prev[key].includes(value) ? {} : { [key]: [...prev[key], value] },
      );
    },
    [update],
  );

  const has = useCallback(
    (key: ListKey, value: string) => progress[key].includes(value),
    [progress],
  );

  const reset = useCallback(() => {
    write(EMPTY_PROGRESS);
    setProgress(EMPTY_PROGRESS);
  }, []);

  const started =
    progress.doorUnlocked ||
    progress.worldBloomed ||
    progress.unlockedMemories.length > 0;

  const value = useMemo(
    () => ({ progress, ready, started, update, addToList, has, reset }),
    [progress, ready, started, update, addToList, has, reset],
  );

  return (
    <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
  );
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error("useProgress must be used inside <ProgressProvider>");
  return ctx;
}
