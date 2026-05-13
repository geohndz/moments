import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  type User,
} from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { acceptPendingInvitesForUser } from "@/lib/firestore/albums";
import { getFirebaseAuth, getFirebaseDb } from "@/lib/firebase/client";

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

/** Firestore user doc + invite acceptance — shared after any sign-in. */
export async function finalizeUserAfterSignIn(user: User): Promise<void> {
  await ensureUserDocument(user);
  if (user.email) {
    try {
      await acceptPendingInvitesForUser({
        uid: user.uid,
        email: user.email,
      });
    } catch (e) {
      // Non-fatal: new users with no album yet can't list invites under the
      // tighter rules. They can still be invited later by an existing member.
      console.warn("[moments] invite acceptance skipped", e);
    }
  }
}

export async function signInWithGoogle(): Promise<User> {
  const auth = getFirebaseAuth();
  const cred = await signInWithPopup(auth, googleProvider);
  await finalizeUserAfterSignIn(cred.user);
  return cred.user;
}

export async function signOutApp(): Promise<void> {
  await signOut(getFirebaseAuth());
}

async function ensureUserDocument(user: User): Promise<void> {
  const db = getFirebaseDb();
  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);
  if (snap.exists()) return;

  await setDoc(ref, {
    displayName: user.displayName ?? null,
    email: user.email ?? null,
    photoURL: user.photoURL ?? null,
    createdAt: serverTimestamp(),
  });
}
