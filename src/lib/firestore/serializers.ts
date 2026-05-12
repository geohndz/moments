import type { DocumentData } from "firebase/firestore";
import type { Album, AlbumInvite } from "@/lib/types";

export function albumFromDoc(id: string, data: DocumentData): Album {
  return {
    id,
    title: String(data.title ?? ""),
    memberIds: Array.isArray(data.memberIds)
      ? (data.memberIds as unknown[]).filter((x): x is string => typeof x === "string")
      : [],
    createdBy: String(data.createdBy ?? ""),
    createdAt: data.createdAt,
  };
}

export function inviteFromDoc(id: string, data: DocumentData): AlbumInvite {
  return {
    id,
    albumId: String(data.albumId ?? ""),
    email: String(data.email ?? ""),
    createdAt: data.createdAt,
    createdBy: String(data.createdBy ?? ""),
  };
}
