import { buildFirebasePublicConfigFromEnv } from "@/lib/firebase/public-config";

/**
 * Runs before client bundles: exposes Firebase web config on `window` from server env (`.env.local`).
 */
export function FirebaseConfigScript() {
  const config = buildFirebasePublicConfigFromEnv();
  const json = JSON.stringify(config).replace(/</g, "\\u003c");

  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `window.__MOMENTS_FIREBASE__=${json};`,
      }}
    />
  );
}
