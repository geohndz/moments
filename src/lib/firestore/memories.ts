"use client";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
  type DocumentData,
} from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase/client";
import type { Memory } from "@/lib/types";
import { memoryFromDoc } from "@/lib/firestore/memory-serializers";

const memoriesCol = () => collection(getFirebaseDb(), "memories");

export function subscribeMemoriesForAlbum(
  albumId: string,
  onNext: (memories: Memory[]) => void,
  onError?: (e: Error) => void,
): () => void {
  const q = query(
    memoriesCol(),
    where("albumId", "==", albumId),
    orderBy("date", "asc"),
  );
  return onSnapshot(
    q,
    (snap) => {
      const list = snap.docs.map((d) =>
        memoryFromDoc(d.id, d.data() as DocumentData),
      );
      onNext(list);
    },
    (err) => onError?.(err instanceof Error ? err : new Error(String(err))),
  );
}

export async function createPolaroidMemory(input: {
  albumId: string;
  uid: string;
  imageUrl: string | null;
  title: string;
  frontCaption?: string;
  message: string;
  date: Date;
  location?: string;
  tags?: string[];
}): Promise<string> {
  const ref = await addDoc(memoriesCol(), {
    albumId: input.albumId,
    type: "polaroid",
    imageUrl: input.imageUrl,
    title: input.title,
    frontCaption: input.frontCaption ?? null,
    message: input.message,
    date: input.date,
    location: input.location ?? null,
    tags: input.tags ?? [],
    createdBy: input.uid,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function createOrbMemory(input: {
  albumId: string;
  uid: string;
  title: string;
  description: string;
  date: Date;
  mood?: string;
}): Promise<string> {
  const ref = await addDoc(memoriesCol(), {
    albumId: input.albumId,
    type: "orb",
    imageUrl: null,
    title: input.title,
    description: input.description,
    mood: input.mood ?? null,
    date: input.date,
    createdBy: input.uid,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateMemory(
  memoryId: string,
  patch: Record<string, unknown>,
): Promise<void> {
  await updateDoc(doc(getFirebaseDb(), "memories", memoryId), patch);
}

export async function deleteMemory(memoryId: string): Promise<void> {
  await deleteDoc(doc(getFirebaseDb(), "memories", memoryId));
}
