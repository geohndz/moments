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

export async function signInWithGoogle(): Promise<User> {
  const auth = getFirebaseAuth();
  const cred = await signInWithPopup(auth, googleProvider);
  await ensureUserDocument(cred.user);
  if (cred.user.email) {
    await acceptPendingInvitesForUser({
      uid: cred.user.uid,
      email: cred.user.email,
    });
  }
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
