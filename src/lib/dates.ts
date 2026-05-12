import { format } from "date-fns";
import type { Timestamp } from "firebase/firestore";

export function toDate(value: Date | Timestamp | { toDate?: () => Date }): Date {
  if (value instanceof Date) return value;
  if (typeof (value as Timestamp).toDate === "function") {
    return (value as Timestamp).toDate();
  }
  return new Date();
}

export function formatMemoryStamp(value: Date | Timestamp): string {
  return format(toDate(value), "MMM d, yyyy");
}

export function formatMonthYear(value: Date | Timestamp): string {
  return format(toDate(value), "MMMM yyyy");
}

export function formatYear(value: Date | Timestamp): string {
  return format(toDate(value), "yyyy");
}
