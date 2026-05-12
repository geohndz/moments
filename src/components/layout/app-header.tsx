"use client";

import { signOutApp } from "@/lib/firebase/auth-google";
import { useAuth } from "@/contexts/auth-context";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { MomentsWordmark } from "@/components/ui/moments-logo";
import { FreehandIcon } from "@/components/ui/freehand-icon";

export function AppHeader({ children }: { children?: ReactNode }) {
  const { user } = useAuth();
  const pathname = usePathname();

  return (
    <header className="flex flex-col gap-4 border-b border-[color-mix(in_oklab,var(--fg)_8%,transparent)] px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
      <div>
        <Link
          href="/albums"
          className="inline-flex items-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
          aria-label="Go to our albums"
        >
          <MomentsWordmark priority />
        </Link>
        {children ? (
          <div className="mt-2">{children}</div>
        ) : (
          <p className="mt-1 text-sm text-[var(--fg-muted)]">
            You · {user?.email ?? "guest"}
          </p>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {pathname.includes("/album/") ? (
          <Link
            href="/albums"
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs text-[var(--fg-muted)] hover:text-[var(--fg)]"
          >
            <FreehandIcon name="office-folder" width={15} height={15} />
            Our albums
          </Link>
        ) : null}
        <button
          type="button"
          onClick={() => void signOutApp()}
          className="inline-flex items-center gap-1.5 rounded-full border border-[color-mix(in_oklab,var(--fg)_12%,transparent)] px-3 py-1.5 text-xs text-[var(--fg)] transition-colors hover:bg-[var(--surface)]"
        >
          <FreehandIcon name="login-logout-key" width={15} height={15} />
          Sign out
        </button>
      </div>
    </header>
  );
}
