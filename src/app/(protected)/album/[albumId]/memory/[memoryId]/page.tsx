"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { PolaroidCard } from "@/components/memory/polaroid-card";
import { useMemories } from "@/hooks/use-memories";
import { deleteMemory } from "@/lib/firestore/memories";
import { formatMemoryStamp } from "@/lib/dates";
import { useAuth } from "@/contexts/auth-context";
import { FreehandIcon } from "@/components/ui/freehand-icon";

export default function MemoryDetailPage() {
  const params = useParams<{ albumId: string; memoryId: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const { memories, loading, error } = useMemories(params.albumId);

  const { memory, prev, next } = useMemo(() => {
    const idx = memories.findIndex((m) => m.id === params.memoryId);
    if (idx < 0) {
      return { memory: undefined, prev: undefined, next: undefined };
    }
    return {
      memory: memories[idx],
      prev: idx > 0 ? memories[idx - 1] : undefined,
      next: idx < memories.length - 1 ? memories[idx + 1] : undefined,
    };
  }, [memories, params.memoryId]);

  async function onDelete() {
    if (!memory || !window.confirm("Delete this memory for both of us? This can’t be undone.")) return;
    await deleteMemory(memory.id);
    router.replace(`/album/${params.albumId}/timeline`);
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-12 text-sm text-[var(--fg-muted)]">
        Loading a memory…
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-12 text-sm text-red-700 dark:text-red-300">
        {error}
      </main>
    );
  }

  if (!memory) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-12 text-sm text-[var(--fg-muted)]">
        This one isn&apos;t here — maybe we archived it or the link is old.
      </main>
    );
  }

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-10 px-4 py-10 sm:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          href={`/album/${params.albumId}/timeline`}
          className="inline-flex items-center gap-1.5 text-xs tracking-wide text-[var(--fg-muted)] hover:text-[var(--fg)]"
        >
          <FreehandIcon name="navigation-page-right" width={14} height={14} flip="horizontal" />
          Back to our timeline
        </Link>
        <div className="flex items-center gap-2 text-xs text-[var(--fg-muted)]">
          {prev ? (
            <Link
              className="inline-flex items-center gap-1 hover:text-[var(--fg)]"
              href={`/album/${params.albumId}/memory/${prev.id}`}
            >
              <FreehandIcon name="navigation-page-right" width={14} height={14} flip="horizontal" />
              Previous
            </Link>
          ) : (
            <span className="inline-flex items-center gap-1 opacity-40">
              <FreehandIcon name="navigation-page-right" width={14} height={14} flip="horizontal" />
              Previous
            </span>
          )}
          <span aria-hidden>|</span>
          {next ? (
            <Link
              className="inline-flex items-center gap-1 hover:text-[var(--fg)]"
              href={`/album/${params.albumId}/memory/${next.id}`}
            >
              Next
              <FreehandIcon name="navigation-page-right" width={14} height={14} />
            </Link>
          ) : (
            <span className="inline-flex items-center gap-1 opacity-40">
              Next
              <FreehandIcon name="navigation-page-right" width={14} height={14} />
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col items-center gap-8 lg:flex-row lg:items-start lg:justify-center">
        {memory.type === "polaroid" ? (
          <PolaroidCard memory={memory} interactive className="scale-105" />
        ) : (
          <div className="max-w-md rounded-2xl border border-[color-mix(in_oklab,var(--fg)_10%,transparent)] bg-[var(--surface)] p-8 shadow-[var(--shadow-polaroid)]">
            <p className="text-xs uppercase tracking-[0.25em] text-[var(--accent)]">Our milestone</p>
            <h1 className="mt-4 text-3xl">{memory.title}</h1>
            <p className="mt-4 text-sm leading-relaxed text-[var(--fg-muted)]">{memory.description}</p>
            <p className="mt-6 text-xs text-[var(--fg-muted)]">{formatMemoryStamp(memory.date)}</p>
            {memory.mood ? (
              <p className="mt-2 text-xs text-[var(--fg-muted)]">Mood: {memory.mood}</p>
            ) : null}
          </div>
        )}
      </div>

      {user?.uid === memory.createdBy ? (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => void onDelete()}
            className="inline-flex items-center gap-2 rounded-full border border-[color-mix(in_oklab,var(--fg)_14%,transparent)] px-4 py-2 text-xs text-[var(--fg-muted)] hover:text-red-700 dark:hover:text-red-300"
          >
            <FreehandIcon name="delete-bin-2" width={14} height={14} />
            Remove from our album
          </button>
        </div>
      ) : null}
    </main>
  );
}
