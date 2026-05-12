"use client";

import { doc, onSnapshot, type DocumentData } from "firebase/firestore";
import { useEffect, useState } from "react";
import { getFirebaseDb } from "@/lib/firebase/client";
import type { Album } from "@/lib/types";
import { albumFromDoc } from "@/lib/firestore/serializers";

export function useAlbum(albumId: string | undefined) {
  const [snap, setSnap] = useState<{
    id: string | null;
    album: Album | null;
  }>({ id: null, album: null });

  useEffect(() => {
    if (!albumId) {
      return undefined;
    }

    const ref = doc(getFirebaseDb(), "albums", albumId);
    const unsub = onSnapshot(ref, (s) => {
      if (!s.exists()) {
        setSnap({ id: albumId, album: null });
        return;
      }
      setSnap({
        id: albumId,
        album: albumFromDoc(s.id, s.data() as DocumentData),
      });
    });
    return () => unsub();
  }, [albumId]);

  const loadedForActive = Boolean(albumId) && snap.id === albumId;
  const album = loadedForActive ? snap.album : null;
  const loading = Boolean(albumId) && !loadedForActive;

  return { album, loading };
}
