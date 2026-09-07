import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-5 px-6 text-center">
      <p className="font-[family-name:var(--font-display)] text-2xl text-cocoa-700">
        There&rsquo;s nothing behind this one.
      </p>
      <Link
        href="/"
        className="rounded-full border border-cocoa-300/60 px-6 py-2 text-sm text-cocoa-600"
      >
        Back to the door
      </Link>
    </main>
  );
}
