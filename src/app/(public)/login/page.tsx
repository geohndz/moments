import { Suspense } from "react";
import { LoginClient } from "./login-client";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-svh items-center justify-center text-sm text-[var(--fg-muted)]">
          Loading…
        </div>
      }
    >
      <LoginClient />
    </Suspense>
  );
}
