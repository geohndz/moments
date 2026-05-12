"use client";

import { useState } from "react";
import { inviteEmailToAlbum } from "@/lib/firestore/albums";
import { useAuth } from "@/contexts/auth-context";
import { FreehandIcon } from "@/components/ui/freehand-icon";

export function InviteByEmail({ albumId }: { albumId: string }) {
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !email.trim()) return;
    setBusy(true);
    setStatus(null);
    try {
      await inviteEmailToAlbum({
        albumId,
        email: email.trim(),
        invitedBy: user.uid,
      });
      setEmail("");
      setStatus("Invitation recorded. When they sign in with Google using this email, they are added automatically.");
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Could not send invite.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form
      onSubmit={(e) => void onSubmit(e)}
      className="mt-10 rounded-2xl border border-[color-mix(in_oklab,var(--fg)_8%,transparent)] bg-[var(--surface)] p-5"
    >
      <p className="inline-flex items-center gap-2 text-xs font-medium tracking-[0.2em] uppercase text-[var(--fg-muted)]">
        <FreehandIcon name="read-email-at-symbol" width={16} height={16} className="text-[var(--accent)]" />
        Invite collaborator
      </p>
      <p className="mt-2 text-sm text-[var(--fg-muted)]">
        Enter their Google email. They will gain access the next time they sign in.
      </p>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <label className="sr-only" htmlFor="invite-email">
          Collaborator email
        </label>
        <input
          id="invite-email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="name@gmail.com"
          className="flex-1 rounded-full border border-[color-mix(in_oklab,var(--fg)_12%,transparent)] bg-[var(--bg)] px-4 py-2 text-sm outline-none ring-[var(--accent)] focus:ring-2"
        />
        <button
          type="submit"
          disabled={busy || !email.trim()}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--fg)] px-5 py-2 text-sm font-medium text-[var(--bg)] disabled:opacity-40"
        >
          <FreehandIcon name="send-email-paper-plane-1" width={16} height={16} className="text-[var(--bg)]" />
          Send
        </button>
      </div>
      {status ? (
        <p className="mt-3 text-xs leading-relaxed text-[var(--fg-muted)]">{status}</p>
      ) : null}
    </form>
  );
}
