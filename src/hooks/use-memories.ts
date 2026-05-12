"use client";

import { useEffect, useState } from "react";
import type { Memory } from "@/lib/types";
import { subscribeMemoriesForAlbum } from "@/lib/firestore/memories";

export function useMemories(albumId: string | undefined) {
  const [snap, setSnap] = useState<{
    id: string | null;
    memories: Memory[];
    error: string | null;
  }>({ id: null, memories: [], error: null });

  useEffect(() => {
    if (!albumId) {
      return undefined;
    }

    const unsub = subscribeMemoriesForAlbum(
      albumId,
      (list) => {
        setSnap({ id: albumId, memories: list, error: null });
      },
      (e) => {
        setSnap({ id: albumId, memories: [], error: e.message });
      },
    );
    return () => unsub();
  }, [albumId]);

  const loadedForActive = Boolean(albumId) && snap.id === albumId;
  const memories = loadedForActive ? snap.memories : [];
  const loading = Boolean(albumId) && !loadedForActive;
  const error = loadedForActive ? snap.error : null;

  return { memories, loading, error };
}
