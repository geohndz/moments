import Link from "next/link";
import { FreehandIcon } from "@/components/ui/freehand-icon";
import { MomentsWordmark } from "@/components/ui/moments-logo";

export default function HomePage() {
  return (
    <div className="relative flex min-h-svh flex-col">
      <header className="flex items-center px-6 py-6 sm:px-10">
        <Link
          href="/"
          className="inline-flex items-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
          aria-label="Moments home"
        >
          <MomentsWordmark priority />
        </Link>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-6 pb-24 pt-6 text-center sm:px-10">
        <h1 className="max-w-2xl text-balance text-4xl sm:text-5xl">
          The little place where we keep our story.
        </h1>
        <p className="mt-6 max-w-lg text-pretty text-base leading-relaxed text-[var(--fg-muted)]">
          Polaroids we can flip, a timeline of our days, and soft glowing orbs for the
          milestones — no feed, no audience, just us.
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link
            href="/login?next=%2Fmemories"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--fg)] px-6 py-3 text-sm font-medium text-[var(--bg)] transition-opacity hover:opacity-90"
          >
            <FreehandIcon name="photo-frame-landscape" width={18} height={18} className="text-[var(--bg)]" />
            Open our album
          </Link>
          <Link
            href="/login?next=%2Fmemories"
            className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm text-[var(--fg-muted)] underline-offset-4 hover:text-[var(--fg)] hover:underline"
          >
            <FreehandIcon name="app-window-user" width={18} height={18} />
            Continue with Google
          </Link>
        </div>
      </main>

      <footer className="px-6 pb-10 text-center text-xs text-[var(--fg-muted)] sm:px-10">
        by Geo with love
      </footer>
    </div>
  );
}
