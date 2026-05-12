"use client";

import type { ReactNode } from "react";
import type { MomentsFirebasePublicConfig } from "@/lib/firebase/public-config";

/**
 * Server passes Firebase public config so the client does not depend on
 * `next/script` timing or on `process.env` replacement inside every chunk.
 */
export function FirebasePublicConfigProvider({
  value,
  children,
}: {
  value: MomentsFirebasePublicConfig;
  children: ReactNode;
}) {
  if (typeof window !== "undefined") {
    window.__MOMENTS_FIREBASE__ = value;
  }
  return children;
}
