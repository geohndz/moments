"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { createOrbMemory, createPolaroidMemory } from "@/lib/firestore/memories";
import { uploadAlbumImage } from "@/lib/firebase/storage-upload";
import { FreehandIcon } from "@/components/ui/freehand-icon";

type Mode = "polaroid" | "orb";

export default function NewMemoryPage() {
  const params = useParams<{ albumId: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const [mode, setMode] = useState<Mode>("polaroid");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [frontCaption, setFrontCaption] = useState("");
  const [location, setLocation] = useState("");
  const [tags, setTags] = useState("");
  const [mood, setMood] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [file, setFile] = useState<File | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setBusy(true);
    setError(null);
    try {
      if (mode === "orb") {
        await createOrbMemory({
          albumId: params.albumId,
          uid: user.uid,
          title: title.trim() || "Orb moment",
          description: description.trim(),
          date: new Date(date),
          mood: mood.trim() || undefined,
        });
      } else {
        let imageUrl: string | null = null;
        if (file) {
          imageUrl = await uploadAlbumImage({ albumId: params.albumId, file });
        }
        await createPolaroidMemory({
          albumId: params.albumId,
          uid: user.uid,
          imageUrl,
          title: title.trim() || "Us, that day",
          frontCaption: frontCaption.trim() || undefined,
          message: message.trim(),
          date: new Date(date),
          location: location.trim() || undefined,
          tags: tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
        });
      }
      router.replace(`/album/${params.albumId}/timeline`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save memory.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-xl px-4 py-10 sm:px-6">
      <Link
        href={`/album/${params.albumId}/timeline`}
        className="inline-flex items-center gap-1.5 text-xs tracking-wide text-[var(--fg-muted)] hover:text-[var(--fg)]"
      >
        <FreehandIcon name="navigation-page-right" width={14} height={14} flip="horizontal" />
        Cancel
      </Link>

      <h1 className="mt-6 text-2xl font-light text-[var(--fg)]">Something for our album</h1>
      <p className="mt-2 text-sm text-[var(--fg-muted)]">
        A polaroid with a photo and a note on the back, or an orb for a milestone when
        there isn&apos;t a picture.
      </p>

      <div className="mt-8 flex rounded-full bg-[var(--surface)] p-1 text-xs">
        {(["polaroid", "orb"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={`flex flex-1 items-center justify-center gap-2 rounded-full px-3 py-2 font-medium transition-colors ${
              mode === m ? "bg-[var(--fg)] text-[var(--bg)]" : "text-[var(--fg-muted)]"
            }`}
          >
            {m === "polaroid" ? (
              <>
                <FreehandIcon
                  name="camera-mode-photo"
                  width={16}
                  height={16}
                  className={mode === m ? "text-[var(--bg)]" : undefined}
                />
                Polaroid
              </>
            ) : (
              <>
                <FreehandIcon
                  name="time-clock-circle"
                  width={16}
                  height={16}
                  className={mode === m ? "text-[var(--bg)]" : undefined}
                />
                Orb
              </>
            )}
          </button>
        ))}
      </div>

      <form onSubmit={(e) => void onSubmit(e)} className="mt-8 space-y-4">
        <div>
          <label className="text-xs text-[var(--fg-muted)]" htmlFor="memory-date">
            Date
          </label>
          <input
            id="memory-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-2 w-full rounded-xl border border-[color-mix(in_oklab,var(--fg)_12%,transparent)] bg-[var(--bg)] px-4 py-3 text-sm outline-none ring-[var(--accent)] focus:ring-2"
          />
        </div>

        <div>
          <label className="text-xs text-[var(--fg-muted)]" htmlFor="memory-title">
            Title
          </label>
          <input
            id="memory-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-2 w-full rounded-xl border border-[color-mix(in_oklab,var(--fg)_12%,transparent)] bg-[var(--bg)] px-4 py-3 text-sm outline-none ring-[var(--accent)] focus:ring-2"
          />
        </div>

        {mode === "polaroid" ? (
          <>
            <div>
              <label className="text-xs text-[var(--fg-muted)]" htmlFor="memory-image">
                Photo
              </label>
              <input
                id="memory-image"
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                className="mt-2 w-full text-sm text-[var(--fg-muted)]"
              />
            </div>
            <div>
              <label className="text-xs text-[var(--fg-muted)]" htmlFor="memory-caption">
                Front caption (optional)
              </label>
              <input
                id="memory-caption"
                value={frontCaption}
                onChange={(e) => setFrontCaption(e.target.value)}
                className="mt-2 w-full rounded-xl border border-[color-mix(in_oklab,var(--fg)_12%,transparent)] bg-[var(--bg)] px-4 py-3 text-sm outline-none ring-[var(--accent)] focus:ring-2"
              />
            </div>
            <div>
              <label className="text-xs text-[var(--fg-muted)]" htmlFor="memory-message">
                Back note
              </label>
              <textarea
                id="memory-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                className="mt-2 w-full rounded-xl border border-[color-mix(in_oklab,var(--fg)_12%,transparent)] bg-[var(--bg)] px-4 py-3 text-sm outline-none ring-[var(--accent)] focus:ring-2"
              />
            </div>
            <div>
              <label className="text-xs text-[var(--fg-muted)]" htmlFor="memory-location">
                Location (optional)
              </label>
              <input
                id="memory-location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="mt-2 w-full rounded-xl border border-[color-mix(in_oklab,var(--fg)_12%,transparent)] bg-[var(--bg)] px-4 py-3 text-sm outline-none ring-[var(--accent)] focus:ring-2"
              />
            </div>
            <div>
              <label className="text-xs text-[var(--fg-muted)]" htmlFor="memory-tags">
                Tags (comma separated)
              </label>
              <input
                id="memory-tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="mt-2 w-full rounded-xl border border-[color-mix(in_oklab,var(--fg)_12%,transparent)] bg-[var(--bg)] px-4 py-3 text-sm outline-none ring-[var(--accent)] focus:ring-2"
              />
            </div>
          </>
        ) : (
          <>
            <div>
              <label className="text-xs text-[var(--fg-muted)]" htmlFor="memory-description">
                Description
              </label>
              <textarea
                id="memory-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                className="mt-2 w-full rounded-xl border border-[color-mix(in_oklab,var(--fg)_12%,transparent)] bg-[var(--bg)] px-4 py-3 text-sm outline-none ring-[var(--accent)] focus:ring-2"
              />
            </div>
            <div>
              <label className="text-xs text-[var(--fg-muted)]" htmlFor="memory-mood">
                Mood / color note (optional)
              </label>
              <input
                id="memory-mood"
                value={mood}
                onChange={(e) => setMood(e.target.value)}
                placeholder="#b84040 or “quiet joy”"
                className="mt-2 w-full rounded-xl border border-[color-mix(in_oklab,var(--fg)_12%,transparent)] bg-[var(--bg)] px-4 py-3 text-sm outline-none ring-[var(--accent)] focus:ring-2"
              />
            </div>
          </>
        )}

        {error ? (
          <p className="text-sm text-red-700 dark:text-red-300" role="alert">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-full bg-[var(--fg)] py-3 text-sm font-medium text-[var(--bg)] disabled:opacity-50"
        >
          {busy ? "Saving…" : "Save for us"}
        </button>
      </form>
    </main>
  );
}
