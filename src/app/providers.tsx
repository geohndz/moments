"use client";

import { AuthProvider } from "@/contexts/auth-context";
import { FirebasePublicConfigContextProvider } from "@/contexts/firebase-public-config-context";
import type { MomentsFirebasePublicConfig } from "@/lib/firebase/public-config";

export function Providers({
  children,
  firebasePublicConfig,
}: {
  children: React.ReactNode;
  firebasePublicConfig: MomentsFirebasePublicConfig;
}) {
  return (
    <FirebasePublicConfigContextProvider value={firebasePublicConfig}>
      <AuthProvider>{children}</AuthProvider>
    </FirebasePublicConfigContextProvider>
  );
}
