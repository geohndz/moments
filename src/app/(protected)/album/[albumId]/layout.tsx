"use client";

import { useParams } from "next/navigation";
import { AppHeader } from "@/components/layout/app-header";
import { AlbumTabs } from "@/components/layout/album-tabs";
import { useAlbum } from "@/hooks/use-album";
import type { ReactNode } from "react";

export default function AlbumSectionLayout({ children }: { children: ReactNode }) {
  const params = useParams<{ albumId: string }>();
  const { album, loading } = useAlbum(params.albumId);

  return (
    <div className="flex min-h-svh flex-col">
      <AppHeader>
        <AlbumTabs />
        <p className="mt-2 text-sm text-[var(--fg)]">
          {loading ? "Loading our album…" : album?.title ?? "Our album"}
        </p>
      </AppHeader>
      <div className="flex-1">{children}</div>
    </div>
  );
}
