"use client";

import type { ReactNode } from "react";
import { AppHeader } from "@/components/layout/app-header";
import { MemoriesNav } from "@/components/layout/memories-nav";
import { SharedAlbumProvider, useSharedAlbum } from "@/contexts/shared-album-context";
import { useAlbum } from "@/hooks/use-album";

export default function MemoriesLayout({ children }: { children: ReactNode }) {
  return (
    <SharedAlbumProvider>
      <MemoriesLayoutShell>{children}</MemoriesLayoutShell>
    </SharedAlbumProvider>
  );
}

function MemoriesLayoutShell({ children }: { children: ReactNode }) {
  const { albumId, loading, error } = useSharedAlbum();
  const { album } = useAlbum(albumId ?? undefined);

  if (loading) {
    return (
      <div className="flex min-h-svh flex-col">
        <AppHeader />
        <p className="p-8 text-sm text-[var(--fg-muted)]">Opening our space…</p>
      </div>
    );
  }

  if (error || !albumId) {
    return (
      <div className="flex min-h-svh flex-col">
        <AppHeader />
        <p className="p-8 text-sm text-red-700 dark:text-red-300" role="alert">
          {error ?? "Could not load our space."}
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-h-svh flex-col">
      <AppHeader>
        <MemoriesNav />
        <p className="mt-2 text-sm text-[var(--fg)]">{album?.title ?? "Our moments"}</p>
      </AppHeader>
      <div className="flex-1">{children}</div>
    </div>
  );
}
