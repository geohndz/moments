import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getFirebasePublicConfig } from "@/lib/firebase/public-config";

let app: FirebaseApp | null = null;

export function isFirebaseConfigured(): boolean {
  return Boolean(getFirebasePublicConfig().apiKey);
}

export function getFirebaseApp(): FirebaseApp {
  if (typeof window === "undefined") {
    throw new Error("Firebase must be used on the client.");
  }
  if (app) return app;
  if (getApps().length > 0) {
    app = getApps()[0]!;
    return app;
  }

  const cfg = getFirebasePublicConfig();
  if (!cfg.apiKey) {
    throw new Error(
      "Firebase is not configured. Add NEXT_PUBLIC_* keys from .env.example to .env.local, then restart the dev server.",
    );
  }

  app = initializeApp({
    apiKey: cfg.apiKey,
    authDomain: cfg.authDomain,
    projectId: cfg.projectId,
    storageBucket: cfg.storageBucket,
    messagingSenderId: cfg.messagingSenderId,
    appId: cfg.appId,
  });
  return app;
}

export function getFirebaseAuth() {
  return getAuth(getFirebaseApp());
}

export function getFirebaseDb() {
  return getFirestore(getFirebaseApp());
}

export function getFirebaseStorage() {
  return getStorage(getFirebaseApp());
}
