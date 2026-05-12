"use client";

import { useParams } from "next/navigation";
import { YearArchive } from "@/components/views/year-archive";
import { useMemories } from "@/hooks/use-memories";

export default function AlbumYearPage() {
  const params = useParams<{ albumId: string }>();
  const albumId = params.albumId;
  const { memories, loading, error } = useMemories(albumId);

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-8">
      <h1 className="text-2xl">By year</h1>
      <p className="mt-2 max-w-xl text-sm text-[var(--fg-muted)]">
        Each year in messy, overlapping stacks — like prints spread on the bed.
      </p>

      {error ? (
        <p className="mt-6 text-sm text-red-700 dark:text-red-300" role="alert">
          {error}
        </p>
      ) : null}

      {loading ? (
        <p className="mt-10 text-sm text-[var(--fg-muted)]">Loading…</p>
      ) : (
        <YearArchive className="mt-12" memories={memories} albumId={albumId} />
      )}
    </main>
  );
}
