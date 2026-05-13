"use client";

import { MonthlyGrid } from "@/components/views/monthly-grid";
import { useMemories } from "@/hooks/use-memories";
import { useSharedAlbum } from "@/contexts/shared-album-context";

export default function MemoriesGridPage() {
  const { albumId } = useSharedAlbum();
  const { memories, loading, error } = useMemories(albumId ?? undefined);

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-8">
      <h1 className="text-2xl">Our grid</h1>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-[var(--fg-muted)]">
        Polaroids and orbs together — month by month. Add a photo memory or an orb milestone
        from the button above.
      </p>

      {error ? (
        <p className="mt-8 text-sm text-red-700 dark:text-red-300" role="alert">
          {error}
        </p>
      ) : null}

      {loading ? (
        <p className="mt-10 text-sm text-[var(--fg-muted)]">Syncing our memories…</p>
      ) : (
        <MonthlyGrid
          className="mt-10"
          memories={memories}
          memoryHref={(id) => `/memories/${id}`}
        />
      )}
    </main>
  );
}
