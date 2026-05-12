"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase/client";
import { useFirebasePublicConfig } from "@/contexts/firebase-public-config-context";

type AuthState = {
  user: User | null;
  loading: boolean;
  configured: boolean;
};

const AuthContext = createContext<AuthState | null>(null);

function useFirebaseAuthSubscription(enabled: boolean) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const auth = getFirebaseAuth();
    const unsub = onAuthStateChanged(auth, (next) => {
      setUser(next);
      setReady(true);
    });
    return () => unsub();
  }, [enabled]);

  return { user, ready };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const firebasePublicConfig = useFirebasePublicConfig();
  const configured = Boolean(firebasePublicConfig.apiKey);
  const { user: firebaseUser, ready } = useFirebaseAuthSubscription(configured);

  const value = useMemo(
    () => ({
      user: configured ? firebaseUser : null,
      loading: configured && !ready,
      configured,
    }),
    [configured, firebaseUser, ready],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
