"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useAuth } from "@/contexts/auth-context";
import { ensureDefaultSharedAlbum } from "@/lib/firestore/albums";

type SharedAlbumState = {
  albumId: string | null;
  loading: boolean;
  error: string | null;
};

const SharedAlbumContext = createContext<SharedAlbumState | null>(null);

export function SharedAlbumProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [state, setState] = useState<SharedAlbumState>({
    albumId: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- reset when session ends
      setState({ albumId: null, loading: false, error: null });
      return;
    }

    let cancelled = false;
    setState((s) => ({ ...s, loading: true, error: null }));

    void ensureDefaultSharedAlbum(user.uid).then(
      (id) => {
        if (!cancelled) setState({ albumId: id, loading: false, error: null });
      },
      (e) => {
        if (!cancelled) {
          setState({
            albumId: null,
            loading: false,
            error:
              e instanceof Error ? e.message : "Could not open our shared space.",
          });
        }
      },
    );

    return () => {
      cancelled = true;
    };
  }, [user]);

  return (
    <SharedAlbumContext.Provider value={state}>{children}</SharedAlbumContext.Provider>
  );
}

export function useSharedAlbum(): SharedAlbumState {
  const ctx = useContext(SharedAlbumContext);
  if (!ctx) {
    throw new Error("useSharedAlbum must be used within SharedAlbumProvider");
  }
  return ctx;
}
