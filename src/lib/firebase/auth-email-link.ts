import {
  isSignInWithEmailLink,
  signInWithEmailLink,
  sendSignInLinkToEmail,
  type ActionCodeSettings,
  type User,
} from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase/client";
import { finalizeUserAfterSignIn } from "@/lib/firebase/auth-google";

export const EMAIL_FOR_SIGNIN_STORAGE_KEY = "moments-email-for-signin";

function loginContinueUrl(nextPath: string): string {
  const origin =
    typeof window !== "undefined"
      ? window.location.origin
      : (process.env.NEXT_PUBLIC_APP_URL ?? "").replace(/\/$/, "");
  const path = nextPath.startsWith("/") ? nextPath : `/${nextPath}`;
  const next = encodeURIComponent(path);
  return `${origin}/login?next=${next}`;
}

function actionCodeSettings(continueUrl: string): ActionCodeSettings {
  return {
    url: continueUrl,
    handleCodeInApp: true,
  };
}

export async function sendEmailSignInLink(
  email: string,
  nextPath: string,
): Promise<void> {
  const auth = getFirebaseAuth();
  const trimmed = email.trim();
  const continueUrl = loginContinueUrl(nextPath);
  await sendSignInLinkToEmail(auth, trimmed, actionCodeSettings(continueUrl));
  try {
    window.localStorage.setItem(EMAIL_FOR_SIGNIN_STORAGE_KEY, trimmed);
  } catch {
    /* private mode */
  }
}

export type EmailLinkCompletion =
  | { status: "not_applicable" }
  | { status: "needs_email" }
  | { status: "success"; user: User };

export async function tryCompleteEmailLinkSignIn(
  confirmEmail?: string | null,
): Promise<EmailLinkCompletion> {
  if (typeof window === "undefined") {
    return { status: "not_applicable" };
  }

  const auth = getFirebaseAuth();
  const href = window.location.href;

  if (!isSignInWithEmailLink(auth, href)) {
    return { status: "not_applicable" };
  }

  const resolvedEmail =
    confirmEmail?.trim() ||
    (() => {
      try {
        return window.localStorage.getItem(EMAIL_FOR_SIGNIN_STORAGE_KEY);
      } catch {
        return null;
      }
    })();

  if (!resolvedEmail) {
    return { status: "needs_email" };
  }

  const cred = await signInWithEmailLink(auth, resolvedEmail, href);

  try {
    window.localStorage.removeItem(EMAIL_FOR_SIGNIN_STORAGE_KEY);
  } catch {
    /* ignore */
  }

  const params = new URLSearchParams(window.location.search);
  const next = params.get("next") ?? "/albums";
  const clean = `/login?next=${encodeURIComponent(next)}`;
  window.history.replaceState({}, "", clean);

  await finalizeUserAfterSignIn(cred.user);

  return { status: "success", user: cred.user };
}

export function isLoginUrlEmailSignInLink(): boolean {
  if (typeof window === "undefined") return false;
  return isSignInWithEmailLink(getFirebaseAuth(), window.location.href);
}
