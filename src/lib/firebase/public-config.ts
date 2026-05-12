/** Populated in root layout from server `process.env` so the client always sees `.env.local` values. */

export type MomentsFirebasePublicConfig = {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
};

export function buildFirebasePublicConfigFromEnv(): MomentsFirebasePublicConfig {
  return {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "",
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "",
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "",
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? "",
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "",
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? "",
  };
}

export function getFirebasePublicConfig(): MomentsFirebasePublicConfig {
  if (typeof window !== "undefined" && window.__MOMENTS_FIREBASE__) {
    return window.__MOMENTS_FIREBASE__;
  }
  return buildFirebasePublicConfigFromEnv();
}

export function isFirebasePublicConfigured(): boolean {
  return Boolean(getFirebasePublicConfig().apiKey);
}
