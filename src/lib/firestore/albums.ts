"use client";

import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
  writeBatch,
  arrayUnion,
  type DocumentData,
} from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase/client";
import { toDate } from "@/lib/dates";
import type { Album } from "@/lib/types";
import { albumInviteDocId } from "@/lib/firestore/invite-id";
import { albumFromDoc } from "@/lib/firestore/serializers";

const albumsCol = () => collection(getFirebaseDb(), "albums");
const invitesCol = () => collection(getFirebaseDb(), "albumInvites");

export async function createAlbum(input: {
  title: string;
  ownerUid: string;
}): Promise<string> {
  const ref = await addDoc(albumsCol(), {
    title: input.title,
    memberIds: [input.ownerUid],
    createdBy: input.ownerUid,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function listAlbumsForUser(uid: string): Promise<Album[]> {
  const q = query(albumsCol(), where("memberIds", "array-contains", uid));
  const snap = await getDocs(q);
  return snap.docs.map((d) => albumFromDoc(d.id, d.data() as DocumentData));
}

/** One implicit shared space per account: oldest album or a new default for the couple. */
export async function ensureDefaultSharedAlbum(uid: string): Promise<string> {
  const list = await listAlbumsForUser(uid);
  if (list.length > 0) {
    const sorted = [...list].sort(
      (a, b) => toDate(a.createdAt).getTime() - toDate(b.createdAt).getTime(),
    );
    return sorted[0]!.id;
  }
  return createAlbum({
    title: "Our moments",
    ownerUid: uid,
  });
}

export async function inviteEmailToAlbum(input: {
  albumId: string;
  email: string;
  invitedBy: string;
}): Promise<void> {
  const normalized = input.email.trim().toLowerCase();
  const id = albumInviteDocId(input.albumId, normalized);
  await setDoc(doc(invitesCol(), id), {
    albumId: input.albumId,
    email: normalized,
    createdBy: input.invitedBy,
    createdAt: serverTimestamp(),
  });
}

export async function acceptPendingInvitesForUser(input: {
  uid: string;
  email: string;
}): Promise<void> {
  const db = getFirebaseDb();
  const normalized = input.email.trim().toLowerCase();
  const q = query(invitesCol(), where("email", "==", normalized));
  const snap = await getDocs(q);
  if (snap.empty) return;

  const batch = writeBatch(db);
  for (const inviteDoc of snap.docs) {
    const data = inviteDoc.data();
    const albumId = data.albumId as string;
    const albumRef = doc(db, "albums", albumId);
    batch.update(albumRef, {
      memberIds: arrayUnion(input.uid),
    });
    batch.delete(inviteDoc.ref);
  }
  await batch.commit();
}
