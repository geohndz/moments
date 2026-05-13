"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { FreehandIcon } from "@/components/ui/freehand-icon";

export function MemoriesNav() {
  const pathname = usePathname();

  const items = [
    { href: "/memories", label: "Grid", icon: "calendar-grid" as const },
    { href: "/memories/timeline", label: "Timeline", icon: "time-clock-circle" as const },
    { href: "/memories/year", label: "Year", icon: "layouts-array-1" as const },
  ] as const;

  const memMatch = /^\/memories\/([^/]+)$/.exec(pathname);
  const memSlug = memMatch?.[1];
  const isMemoryDetail =
    Boolean(memSlug) && !["new", "timeline", "year"].includes(memSlug!);

  return (
    <nav aria-label="Memory views" className="flex flex-wrap gap-2">
      {items.map((item) => {
        const isGrid = item.href === "/memories";
        const active = isGrid
          ? pathname === "/memories" || isMemoryDetail
          : pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs transition-colors",
              active
                ? "bg-[var(--fg)] text-[var(--bg)]"
                : "text-[var(--fg-muted)] hover:bg-[var(--surface)] hover:text-[var(--fg)]",
            )}
          >
            <FreehandIcon
              name={item.icon}
              width={14}
              height={14}
              className={active ? "text-[var(--bg)]" : undefined}
            />
            {item.label}
          </Link>
        );
      })}
      <Link
        href="/memories/new"
        className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-[color-mix(in_oklab,var(--fg)_20%,transparent)] px-3 py-1.5 text-xs text-[var(--fg-muted)] hover:border-[var(--accent)] hover:text-[var(--fg)]"
      >
        <FreehandIcon name="notes-add" width={14} height={14} />
        Add polaroid or orb
      </Link>
    </nav>
  );
}
