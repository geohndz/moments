"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { signInWithGoogle } from "@/lib/firebase/auth-google";
import { useAuth } from "@/contexts/auth-context";
import { FreehandIcon } from "@/components/ui/freehand-icon";
import { MomentsWordmark } from "@/components/ui/moments-logo";

export function LoginClient() {
  const { configured, user, loading } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") ?? "/albums";
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && user) {
      router.replace(next);
    }
  }, [loading, next, router, user]);

  async function onGoogle() {
    setError(null);
    try {
      await signInWithGoogle();
      router.replace(next);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not sign in.");
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-svh items-center justify-center text-sm text-[var(--fg-muted)]">
        Preparing sign-in…
      </div>
    );
  }

  if (user) {
    return (
      <div className="flex min-h-svh items-center justify-center text-sm text-[var(--fg-muted)]">
        Redirecting…
      </div>
    );
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm rounded-2xl border border-[color-mix(in_oklab,var(--fg)_8%,transparent)] bg-[var(--surface)] p-8 shadow-[var(--shadow-polaroid)]">
        <div className="flex justify-center">
          <MomentsWordmark />
        </div>
        <h1 className="mt-3 text-center text-2xl font-light text-[var(--fg)]">
          Hey — it&apos;s us
        </h1>
        <p className="mt-2 text-center text-sm text-[var(--fg-muted)]">
          Sign in with Google to open our album together.
        </p>

        {!configured ? (
          <p className="mt-6 text-center text-sm text-[var(--fg-muted)]">
            Configure Firebase in{" "}
            <code className="rounded bg-[var(--surface-2)] px-1">.env.local</code> first.
          </p>
        ) : (
          <button
            type="button"
            onClick={() => void onGoogle()}
            className="mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-[var(--fg)] py-3 text-sm font-medium text-[var(--bg)] transition-opacity hover:opacity-90"
          >
            <FreehandIcon name="app-window-user" width={20} height={20} className="text-[var(--bg)]" />
            Continue with Google
          </button>
        )}

        {error ? (
          <p className="mt-4 text-center text-sm text-red-700 dark:text-red-300">
            {error}
          </p>
        ) : null}

        <Link
          href="/"
          className="mt-8 inline-flex w-full items-center justify-center gap-2 text-center text-sm text-[var(--fg-muted)] underline-offset-4 hover:text-[var(--fg)] hover:underline"
        >
          <FreehandIcon name="home" width={16} height={16} />
          Back home
        </Link>
      </div>
    </div>
  );
}
