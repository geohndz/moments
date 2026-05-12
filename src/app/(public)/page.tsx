import Link from "next/link";
import { FreehandIcon } from "@/components/ui/freehand-icon";

export default function HomePage() {
  return (
    <div className="relative flex min-h-svh flex-col">
      <header className="flex items-center justify-between px-6 py-6 sm:px-10">
        <p className="text-sm font-medium tracking-[0.2em] uppercase text-[var(--fg-muted)]">
          Moments
        </p>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 rounded-full border border-[color-mix(in_oklab,var(--fg)_10%,transparent)] px-4 py-2 text-sm text-[var(--fg)] transition-colors hover:bg-[var(--surface)]"
        >
          <FreehandIcon name="face-id-user" width={18} height={18} className="text-[var(--accent)]" />
          Sign in
        </Link>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-6 pb-24 pt-6 text-center sm:px-10">
        <p className="mb-4 text-xs tracking-[0.35em] uppercase text-[var(--accent)]">
          Shared digital polaroids
        </p>
        <h1 className="max-w-2xl text-balance text-4xl font-light leading-tight tracking-tight text-[var(--fg)] sm:text-5xl">
          A calm place to keep the moments that matter together.
        </h1>
        <p className="mt-6 max-w-lg text-pretty text-base leading-relaxed text-[var(--fg-muted)]">
          Flip polaroids, wander a cinematic timeline, and mark emotional milestones
          with soft glowing orbs — without the noise of a feed.
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--fg)] px-6 py-3 text-sm font-medium text-[var(--bg)] transition-opacity hover:opacity-90"
          >
            <FreehandIcon name="photo-frame-landscape" width={18} height={18} className="text-[var(--bg)]" />
            Open your album
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm text-[var(--fg-muted)] underline-offset-4 hover:text-[var(--fg)] hover:underline"
          >
            <FreehandIcon name="app-window-user" width={18} height={18} />
            Continue with Google
          </Link>
        </div>
      </main>

      <footer className="px-6 pb-10 text-center text-xs text-[var(--fg-muted)] sm:px-10">
        Tactile, slow, and private by design.
      </footer>
    </div>
  );
}
