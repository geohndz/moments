"use client";

import {
  createContext,
  useContext,
  useLayoutEffect,
  type ReactNode,
} from "react";
import type { MomentsFirebasePublicConfig } from "@/lib/firebase/public-config";

const FirebasePublicConfigContext =
  createContext<MomentsFirebasePublicConfig | null>(null);

export function FirebasePublicConfigContextProvider({
  value,
  children,
}: {
  value: MomentsFirebasePublicConfig;
  children: ReactNode;
}) {
  useLayoutEffect(() => {
    window.__MOMENTS_FIREBASE__ = value;
  }, [value]);

  return (
    <FirebasePublicConfigContext.Provider value={value}>
      {children}
    </FirebasePublicConfigContext.Provider>
  );
}

export function useFirebasePublicConfig(): MomentsFirebasePublicConfig {
  const ctx = useContext(FirebasePublicConfigContext);
  if (!ctx) {
    throw new Error(
      "useFirebasePublicConfig must be used within FirebasePublicConfigContextProvider",
    );
  }
  return ctx;
}
