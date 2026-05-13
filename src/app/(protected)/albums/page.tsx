"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** Old entry URL; the app uses a single shared space at `/memories`. */
export default function AlbumsRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/memories");
  }, [router]);

  return (
    <div className="flex min-h-svh flex-col items-center justify-center px-6 text-sm text-[var(--fg-muted)]">
      Opening our space…
    </div>
  );
}
