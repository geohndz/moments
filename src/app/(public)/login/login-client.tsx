"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { signInWithGoogle } from "@/lib/firebase/auth-google";
import {
  sendEmailSignInLink,
  tryCompleteEmailLinkSignIn,
  isLoginUrlEmailSignInLink,
} from "@/lib/firebase/auth-email-link";
import { useAuth } from "@/contexts/auth-context";
import { FreehandIcon } from "@/components/ui/freehand-icon";
import { MomentsWordmark } from "@/components/ui/moments-logo";

function authErrorMessage(err: unknown): string {
  if (err && typeof err === "object" && "code" in err) {
    const code = String((err as { code: string }).code);
    if (code === "auth/invalid-email") return "That email doesn’t look valid.";
    if (code === "auth/invalid-action-code") {
      return "This sign-in link is invalid or was already used.";
    }
    if (code === "auth/expired-action-code") {
      return "This sign-in link has expired. Request a new one.";
    }
    if (code === "auth/user-disabled") return "This account has been disabled.";
  }
  if (err instanceof Error) return err.message;
  return "Something went wrong. Try again.";
}

export function LoginClient() {
  const { configured, user, loading } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") ?? "/albums";
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [linkSent, setLinkSent] = useState(false);
  const [sendingLink, setSendingLink] = useState(false);
  const [emailLinkChecking, setEmailLinkChecking] = useState(false);
  const [needsEmailConfirm, setNeedsEmailConfirm] = useState(false);
  const [confirmEmail, setConfirmEmail] = useState("");
  const [confirmBusy, setConfirmBusy] = useState(false);

  const inputClass =
    "w-full rounded-xl border border-[color-mix(in_oklab,var(--fg)_12%,transparent)] bg-[var(--bg)] px-4 py-3 text-sm text-[var(--fg)] outline-none ring-[var(--accent)] placeholder:text-[var(--fg-muted)] focus:ring-2";

  useEffect(() => {
    if (!loading && user) {
      router.replace(next);
    }
  }, [loading, next, router, user]);

  useEffect(() => {
    if (!configured || loading || user) return;
    if (!isLoginUrlEmailSignInLink()) return;

    let cancelled = false;

    const timer = window.setTimeout(() => {
      setEmailLinkChecking(true);
      setError(null);

      void (async () => {
        try {
          const result = await tryCompleteEmailLinkSignIn();
          if (cancelled) return;
          if (result.status === "needs_email") {
            setNeedsEmailConfirm(true);
          } else if (result.status === "success") {
            router.replace(next);
          }
        } catch (e) {
          if (!cancelled) setError(authErrorMessage(e));
        } finally {
          if (!cancelled) setEmailLinkChecking(false);
        }
      })();
    }, 0);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [configured, loading, user, next, router]);

  async function onGoogle() {
    setError(null);
    try {
      await signInWithGoogle();
      router.replace(next);
    } catch (e) {
      setError(authErrorMessage(e));
    }
  }

  async function onSendLink(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLinkSent(false);
    if (!email.trim()) {
      setError("Enter your email.");
      return;
    }
    setSendingLink(true);
    try {
      await sendEmailSignInLink(email, next);
      setLinkSent(true);
    } catch (e) {
      setError(authErrorMessage(e));
    } finally {
      setSendingLink(false);
    }
  }

  async function onConfirmEmailLink(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!confirmEmail.trim()) {
      setError("Enter the email you used.");
      return;
    }
    setConfirmBusy(true);
    try {
      const result = await tryCompleteEmailLinkSignIn(confirmEmail);
      if (result.status === "success") {
        router.replace(next);
      } else {
        setError(
          "Couldn’t complete sign-in. Make sure the email matches the one we sent the link to.",
        );
      }
    } catch (e) {
      setError(authErrorMessage(e));
    } finally {
      setConfirmBusy(false);
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

  if (emailLinkChecking && !needsEmailConfirm) {
    return (
      <div className="flex min-h-svh items-center justify-center text-sm text-[var(--fg-muted)]">
        Opening your sign-in link…
      </div>
    );
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm rounded-2xl border border-[color-mix(in_oklab,var(--fg)_8%,transparent)] bg-[var(--surface)] p-8 shadow-[var(--shadow-polaroid)]">
        <div className="flex justify-center">
          <MomentsWordmark />
        </div>
        <h1 className="mt-3 text-center text-2xl">Hey — it&apos;s us</h1>
        <p className="mt-2 text-center text-sm text-[var(--fg-muted)]">
          Sign in with Google, or get a one-time link sent to your email — no Google account
          needed for that.
        </p>

        {needsEmailConfirm ? (
            <form onSubmit={(e) => void onConfirmEmailLink(e)} className="mt-6 space-y-3">
            <p className="text-center text-sm text-[var(--fg-muted)]">
              This link was opened on a different browser or device. Enter the{" "}
              <strong className="text-[var(--fg)]">same email</strong> we used to send the link.
            </p>
            <label htmlFor="confirm-email" className="sr-only">
              Email for confirmation
            </label>
            <input
              id="confirm-email"
              type="email"
              name="email"
              value={confirmEmail}
              onChange={(e) => setConfirmEmail(e.target.value)}
              autoComplete="email"
              className={inputClass}
              placeholder="you@example.com"
              disabled={confirmBusy}
            />
            <button
              type="submit"
              disabled={confirmBusy}
              className="flex w-full items-center justify-center gap-2 rounded-full border border-[color-mix(in_oklab,var(--fg)_14%,transparent)] py-3 text-sm font-medium text-[var(--fg)] transition-opacity disabled:opacity-50"
            >
              {confirmBusy ? "Signing in…" : "Complete sign-in"}
            </button>
          </form>
        ) : !configured ? (
          <p className="mt-6 text-center text-sm text-[var(--fg-muted)]">
            Configure Firebase in{" "}
            <code className="rounded bg-[var(--surface-2)] px-1">.env.local</code> first.
          </p>
        ) : (
          <>
            <button
              type="button"
              onClick={() => void onGoogle()}
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-[var(--fg)] py-3 text-sm font-medium text-[var(--bg)] transition-opacity hover:opacity-90"
            >
              <FreehandIcon
                name="app-window-user"
                width={20}
                height={20}
                className="text-[var(--bg)]"
              />
              Continue with Google
            </button>

            <div className="relative my-6" aria-hidden="true">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[color-mix(in_oklab,var(--fg)_10%,transparent)]" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-[var(--surface)] px-2 text-[var(--fg-muted)]">or</span>
              </div>
            </div>

            <form onSubmit={(e) => void onSendLink(e)} className="space-y-3">
              <label htmlFor="email-link" className="sr-only">
                Email address
              </label>
              <input
                id="email-link"
                type="email"
                name="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setLinkSent(false);
                }}
                autoComplete="email"
                className={inputClass}
                placeholder="Your email"
                disabled={sendingLink}
              />
              <button
                type="submit"
                disabled={sendingLink}
                className="flex w-full items-center justify-center gap-2 rounded-full border border-[color-mix(in_oklab,var(--fg)_14%,transparent)] py-3 text-sm font-medium text-[var(--fg)] transition-opacity hover:bg-[var(--surface-2)] disabled:opacity-50"
              >
                <FreehandIcon name="send-email-paper-plane-1" width={18} height={18} />
                {sendingLink ? "Sending link…" : "Email me a sign-in link"}
              </button>
            </form>

            {linkSent ? (
              <p className="mt-4 text-center text-pretty text-sm text-[var(--fg-muted)]">
                Check <span className="text-[var(--fg)]">{email.trim()}</span> — we sent a
                sign-in link. It can take a minute; peek in spam if you don’t see it.
              </p>
            ) : null}
          </>
        )}

        {error ? (
          <p className="mt-4 text-center text-sm text-red-700 dark:text-red-300" role="alert">
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
