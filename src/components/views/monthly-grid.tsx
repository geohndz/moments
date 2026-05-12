"use client";

import Link from "next/link";
import Image from "next/image";
import { toDate, formatMonthYear } from "@/lib/dates";
import type { Memory } from "@/lib/types";
import { cn } from "@/lib/cn";

function monthKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export function MonthlyGrid({
  memories,
  albumId,
  className,
}: {
  memories: Memory[];
  albumId: string;
  className?: string;
}) {
  const groups = new Map<string, Memory[]>();
  for (const m of memories) {
    const key = monthKey(toDate(m.date));
    const list = groups.get(key) ?? [];
    list.push(m);
    groups.set(key, list);
  }

  const keys = [...groups.keys()].sort();

  return (
    <div className={cn("space-y-14", className)}>
      {keys.map((key) => {
        const list = groups.get(key)!;
        const label = formatMonthYear(toDate(list[0]!.date));
        return (
          <section key={key} aria-label={label}>
            <h2 className="text-xs tracking-[0.28em] uppercase text-[var(--fg-muted)]">
              {label}
            </h2>
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {list.map((m) => {
                if (m.type === "orb") {
                  return (
                    <Link
                      key={m.id}
                      href={`/album/${albumId}/memory/${m.id}`}
                      className="group flex aspect-[3/4] flex-col items-center justify-center rounded-xl border border-[color-mix(in_oklab,var(--fg)_10%,transparent)] bg-[var(--surface)] p-4 text-center transition-transform hover:-translate-y-0.5 hover:shadow-[var(--shadow-polaroid)]"
                    >
                      <span className="h-10 w-10 rounded-full bg-[var(--accent-soft)] blur-sm" />
                      <p className="mt-3 text-xs font-medium text-[var(--fg)]">{m.title}</p>
                    </Link>
                  );
                }
                return (
                  <Link
                    key={m.id}
                    href={`/album/${albumId}/memory/${m.id}`}
                    className="group block overflow-hidden rounded-xl bg-[var(--surface)] p-2 shadow-[var(--shadow-polaroid)] transition-transform hover:-translate-y-0.5"
                  >
                    <div className="relative aspect-[4/5] w-full overflow-hidden bg-[var(--surface-2)]">
                      {m.imageUrl ? (
                        <Image
                          src={m.imageUrl}
                          alt=""
                          fill
                          sizes="(max-width: 640px) 45vw, 200px"
                          className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                          unoptimized
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-[10px] text-[var(--fg-muted)]">
                          Polaroid
                        </div>
                      )}
                    </div>
                    <p className="mt-2 line-clamp-2 px-1 text-[11px] text-[var(--fg)]">
                      {m.title || m.frontCaption || "Untitled"}
                    </p>
                  </Link>
                );
              })}
            </div>
          </section>
        );
      })}
      {keys.length === 0 ? (
        <p className="text-sm text-[var(--fg-muted)]">
          Drop a memory here first — it&apos;ll show up in the grid.
        </p>
      ) : null}
    </div>
  );
}
