import type { MemoryIcon as IconName } from "@/data/memories";

type AnyIcon = IconName | "lock";

const PATHS: Record<AnyIcon, string> = {
  spark: "M12 2l1.9 6.1L20 10l-6.1 1.9L12 18l-1.9-6.1L4 10l6.1-1.9z",
  cup: "M4 6h12v6a6 6 0 01-12 0zM16 7h2a2 2 0 010 4h-2M3 20h14",
  heart:
    "M12 20s-7-4.6-7-9.4A3.9 3.9 0 0112 8a3.9 3.9 0 017 2.6C19 15.4 12 20 12 20z",
  star: "M12 3l2.5 5.6L20 9.4l-4 4 1 6-5-2.9L7 19.4l1-6-4-4 5.5-.8z",
  chocolate: "M5 5h14v14H5zM5 10h14M5 15h14M10 5v14M15 5v14",
  moon: "M19 13.5A7.5 7.5 0 1110.5 5a6 6 0 008.5 8.5z",
  lock: "M7 10V7.5a5 5 0 0110 0V10M5.5 10h13v9h-13z",
};

export function MemoryIcon({
  name,
  className = "",
}: {
  name: AnyIcon;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d={PATHS[name]} />
    </svg>
  );
}
