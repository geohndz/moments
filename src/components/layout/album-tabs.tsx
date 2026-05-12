"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { FreehandIcon } from "@/components/ui/freehand-icon";

export function AlbumTabs() {
  const params = useParams<{ albumId: string }>();
  const pathname = usePathname();
  const albumId = params.albumId;

  const items = [
    { href: `/album/${albumId}/timeline`, label: "Timeline", icon: "time-clock-circle" as const },
    { href: `/album/${albumId}/month`, label: "Month", icon: "calendar-grid" as const },
    { href: `/album/${albumId}/year`, label: "Year", icon: "layouts-array-1" as const },
  ] as const;

  return (
    <nav aria-label="Album views" className="flex flex-wrap gap-2">
      {items.map((item) => {
        const isTimelineTab = item.href.endsWith("/timeline");
        const active = isTimelineTab
          ? pathname.includes("/timeline") || pathname.includes("/memory/")
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
        href={`/album/${albumId}/new`}
        className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-[color-mix(in_oklab,var(--fg)_20%,transparent)] px-3 py-1.5 text-xs text-[var(--fg-muted)] hover:border-[var(--accent)] hover:text-[var(--fg)]"
      >
        <FreehandIcon name="notes-add" width={14} height={14} />
        New memory
      </Link>
    </nav>
  );
}
