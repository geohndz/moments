"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading, configured } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!configured || loading) return;
    if (!user) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [configured, loading, pathname, router, user]);

  if (!configured) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="max-w-md text-pretty text-sm text-[var(--fg-muted)]">
          Firebase environment variables are missing. Copy{" "}
          <code className="rounded bg-[var(--surface-2)] px-1.5 py-0.5 text-xs">
            .env.example
          </code>{" "}
          to{" "}
          <code className="rounded bg-[var(--surface-2)] px-1.5 py-0.5 text-xs">
            .env.local
          </code>{" "}
          and add your project keys.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div
        className="flex min-h-svh items-center justify-center"
        role="status"
        aria-live="polite"
      >
        <span className="text-sm tracking-wide text-[var(--fg-muted)]">
          Opening our album…
        </span>
      </div>
    );
  }

  if (!user) return null;

  return children;
}
