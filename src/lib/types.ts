import type { Timestamp } from "firebase/firestore";

export type MemoryType = "polaroid" | "orb";

export type FirestoreTimestamp = Timestamp | Date;

export interface Album {
  id: string;
  title: string;
  memberIds: string[];
  createdBy: string;
  createdAt: FirestoreTimestamp;
}

export interface MemoryBase {
  id: string;
  albumId: string;
  type: MemoryType;
  title: string;
  date: FirestoreTimestamp;
  createdBy: string;
  createdAt: FirestoreTimestamp;
}

export interface PolaroidMemory extends MemoryBase {
  type: "polaroid";
  imageUrl: string | null;
  /** Shown on front (optional caption). */
  frontCaption?: string;
  message: string;
  tags?: string[];
  location?: string;
}

export interface OrbMemory extends MemoryBase {
  type: "orb";
  imageUrl: null;
  /** Longer narrative for milestone moments. */
  description: string;
  mood?: string;
}

export type Memory = PolaroidMemory | OrbMemory;

export interface AlbumInvite {
  id: string;
  albumId: string;
  email: string;
  createdAt: FirestoreTimestamp;
  createdBy: string;
}

export interface UserProfile {
  id: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  createdAt: FirestoreTimestamp;
}
