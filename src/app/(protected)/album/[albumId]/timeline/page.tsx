"use client";

import { useParams } from "next/navigation";
import { TimelineStrip } from "@/components/timeline/timeline-strip";
import { useMemories } from "@/hooks/use-memories";
import { InviteByEmail } from "@/components/invite/invite-by-email";

export default function AlbumTimelinePage() {
  const params = useParams<{ albumId: string }>();
  const albumId = params.albumId;
  const { memories, loading, error } = useMemories(albumId);

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-8">
      <div className="max-w-xl">
        <h1 className="text-2xl font-light text-[var(--fg)]">Our timeline</h1>
        <p className="mt-2 text-sm leading-relaxed text-[var(--fg-muted)]">
          Scroll through our polaroids and the little orb milestones. Tap a card to
          flip it, or open a memory to linger on it.
        </p>
      </div>

      {error ? (
        <p className="mt-8 text-sm text-red-700 dark:text-red-300" role="alert">
          {error}
        </p>
      ) : null}

      {loading ? (
        <p className="mt-10 text-sm text-[var(--fg-muted)]">Syncing our memories…</p>
      ) : (
        <TimelineStrip className="mt-8" memories={memories} albumId={albumId} />
      )}

      <InviteByEmail albumId={albumId} />
    </main>
  );
}
