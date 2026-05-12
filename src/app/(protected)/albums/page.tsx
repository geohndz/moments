"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { createAlbum, listAlbumsForUser } from "@/lib/firestore/albums";
import type { Album } from "@/lib/types";
import { AppHeader } from "@/components/layout/app-header";
import { FreehandIcon } from "@/components/ui/freehand-icon";

export default function AlbumsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [albums, setAlbums] = useState<Album[]>([]);
  const [title, setTitle] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    void (async () => {
      const list = await listAlbumsForUser(user.uid);
      if (!cancelled) setAlbums(list);
    })();
    return () => {
      cancelled = true;
    };
  }, [user]);

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !title.trim()) return;
    setBusy(true);
    try {
      const id = await createAlbum({ title: title.trim(), ownerUid: user.uid });
      setTitle("");
      const list = await listAlbumsForUser(user.uid);
      setAlbums(list);
      router.push(`/album/${id}/timeline`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-svh flex-col">
      <AppHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6">
        <h1 className="text-2xl font-light text-[var(--fg)]">Your albums</h1>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-[var(--fg-muted)]">
          Each album is a shared memory box for two — chronological timelines,
          monthly archives, and soft polaroid flips.
        </p>

        <form
          onSubmit={(e) => void onCreate(e)}
          className="mt-10 flex flex-col gap-3 rounded-2xl border border-[color-mix(in_oklab,var(--fg)_10%,transparent)] bg-[var(--surface)] p-6 shadow-[var(--shadow-polaroid)] sm:flex-row sm:items-end"
        >
          <div className="flex-1">
            <label htmlFor="album-title" className="text-xs text-[var(--fg-muted)]">
              New album title
            </label>
            <input
              id="album-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Our first year"
              className="mt-2 w-full rounded-xl border border-[color-mix(in_oklab,var(--fg)_12%,transparent)] bg-[var(--bg)] px-4 py-3 text-sm text-[var(--fg)] outline-none ring-[var(--accent)] placeholder:text-[var(--fg-muted)] focus:ring-2"
            />
          </div>
          <button
            type="submit"
            disabled={busy || !title.trim()}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--fg)] px-6 py-3 text-sm font-medium text-[var(--bg)] disabled:opacity-40"
          >
            <FreehandIcon name="add-sign-bold" width={16} height={16} className="text-[var(--bg)]" />
            Create
          </button>
        </form>

        <ul className="mt-12 space-y-4">
          {albums.map((a) => (
            <li key={a.id}>
              <Link
                href={`/album/${a.id}/timeline`}
                className="group block rounded-2xl border border-[color-mix(in_oklab,var(--fg)_8%,transparent)] bg-[var(--surface)] p-5 transition-transform hover:-translate-y-0.5 hover:shadow-[var(--shadow-polaroid)]"
              >
                <p className="text-lg font-medium text-[var(--fg)]">{a.title}</p>
                <p className="mt-1 text-xs text-[var(--fg-muted)]">
                  {a.memberIds.length} collaborator{a.memberIds.length === 1 ? "" : "s"}
                </p>
                <span className="mt-3 inline-flex items-center gap-1 text-xs tracking-wide text-[var(--accent)]">
                  Open timeline
                  <FreehandIcon name="navigation-page-right" width={14} height={14} />
                </span>
              </Link>
            </li>
          ))}
          {albums.length === 0 ? (
            <li className="rounded-2xl border border-dashed border-[color-mix(in_oklab,var(--fg)_18%,transparent)] px-6 py-12 text-center text-sm text-[var(--fg-muted)]">
              No albums yet. Name one above to begin.
            </li>
          ) : null}
        </ul>
      </main>
    </div>
  );
}
