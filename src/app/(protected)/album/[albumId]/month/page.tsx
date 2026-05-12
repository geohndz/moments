"use client";

import { useParams } from "next/navigation";
import { MonthlyGrid } from "@/components/views/monthly-grid";
import { useMemories } from "@/hooks/use-memories";

export default function AlbumMonthPage() {
  const params = useParams<{ albumId: string }>();
  const albumId = params.albumId;
  const { memories, loading, error } = useMemories(albumId);

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-8">
      <h1 className="text-2xl font-light text-[var(--fg)]">Monthly archive</h1>
      <p className="mt-2 max-w-xl text-sm text-[var(--fg-muted)]">
        A quiet grid of everything you saved, grouped by month.
      </p>

      {error ? (
        <p className="mt-6 text-sm text-red-700 dark:text-red-300" role="alert">
          {error}
        </p>
      ) : null}

      {loading ? (
        <p className="mt-10 text-sm text-[var(--fg-muted)]">Loading…</p>
      ) : (
        <MonthlyGrid className="mt-10" memories={memories} albumId={albumId} />
      )}
    </main>
  );
}
