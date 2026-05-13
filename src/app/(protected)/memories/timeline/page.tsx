"use client";

import { TimelineStrip } from "@/components/timeline/timeline-strip";
import { InviteByEmail } from "@/components/invite/invite-by-email";
import { useMemories } from "@/hooks/use-memories";
import { useSharedAlbum } from "@/contexts/shared-album-context";

export default function MemoriesTimelinePage() {
  const { albumId } = useSharedAlbum();
  const { memories, loading, error } = useMemories(albumId ?? undefined);

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-8">
      <div className="max-w-xl">
        <h1 className="text-2xl">Our timeline</h1>
        <p className="mt-2 text-sm leading-relaxed text-[var(--fg-muted)]">
          Scroll through polaroids and orb milestones. Tap a card to flip it, or open a memory to
          linger on it.
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
        <TimelineStrip
          className="mt-8"
          memories={memories}
          memoryHref={(id) => `/memories/${id}`}
        />
      )}

      {albumId ? <InviteByEmail albumId={albumId} /> : null}
    </main>
  );
}
