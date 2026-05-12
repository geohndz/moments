import type { DocumentData } from "firebase/firestore";
import { Timestamp } from "firebase/firestore";
import type { Memory, OrbMemory, PolaroidMemory } from "@/lib/types";

function parseDate(value: unknown): Timestamp | Date {
  if (value instanceof Timestamp) return value;
  if (value instanceof Date) return value;
  if (
    value &&
    typeof value === "object" &&
    "toDate" in value &&
    typeof (value as { toDate: () => Date }).toDate === "function"
  ) {
    return (value as Timestamp).toDate() as unknown as Timestamp;
  }
  return new Date();
}

export function memoryFromDoc(id: string, data: DocumentData): Memory {
  const type = data.type === "orb" ? "orb" : "polaroid";
  const base = {
    id,
    albumId: String(data.albumId ?? ""),
    title: String(data.title ?? ""),
    date: parseDate(data.date),
    createdBy: String(data.createdBy ?? ""),
    createdAt: parseDate(data.createdAt ?? new Date()),
  };

  if (type === "orb") {
    const orb: OrbMemory = {
      ...base,
      type: "orb",
      imageUrl: null,
      description: String(data.description ?? ""),
      mood: data.mood ? String(data.mood) : undefined,
    };
    return orb;
  }

  const polaroid: PolaroidMemory = {
    ...base,
    type: "polaroid",
    imageUrl: data.imageUrl ? String(data.imageUrl) : null,
    frontCaption: data.frontCaption ? String(data.frontCaption) : undefined,
    message: String(data.message ?? ""),
    tags: Array.isArray(data.tags)
      ? (data.tags as unknown[]).filter((t): t is string => typeof t === "string")
      : undefined,
    location: data.location ? String(data.location) : undefined,
  };
  return polaroid;
}
