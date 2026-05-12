"use client";

import Link from "next/link";
import Image from "next/image";
import { formatYear, toDate } from "@/lib/dates";
import type { Memory } from "@/lib/types";
import { cn } from "@/lib/cn";

function yearOf(m: Memory) {
  return toDate(m.date).getFullYear();
}

export function YearArchive({
  memories,
  albumId,
  className,
}: {
  memories: Memory[];
  albumId: string;
  className?: string;
}) {
  const byYear = new Map<number, Memory[]>();
  for (const m of memories) {
    const y = yearOf(m);
    const list = byYear.get(y) ?? [];
    list.push(m);
    byYear.set(y, list);
  }

  const years = [...byYear.keys()].sort((a, b) => b - a);

  return (
    <div className={cn("space-y-20", className)}>
      {years.map((year) => {
        const list = byYear.get(year)!;
        const label = formatYear(toDate(list[0]!.date));
        return (
          <section key={year} className="relative" aria-label={label}>
            <div className="flex items-baseline gap-4">
              <h2 className="text-4xl sm:text-5xl">
                {label}
              </h2>
              <span className="text-xs text-[var(--fg-muted)]">{list.length} memories</span>
            </div>
            <div className="mt-10 columns-2 gap-5 sm:columns-3 lg:columns-4">
              {list.map((m, i) => {
                const lift = i % 3 === 0 ? "sm:-translate-y-2" : i % 3 === 1 ? "sm:translate-y-3" : "";
                if (m.type === "orb") {
                  return (
                    <Link
                      key={m.id}
                      href={`/album/${albumId}/memory/${m.id}`}
                      className={cn(
                        "mb-5 break-inside-avoid rounded-2xl border border-[color-mix(in_oklab,var(--fg)_8%,transparent)] bg-[var(--surface)] p-6 transition-transform hover:-translate-y-1 hover:shadow-[var(--shadow-polaroid)]",
                        lift,
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <span className="h-12 w-12 rounded-full bg-[var(--accent-soft)] blur-md" />
                        <div>
                          <p className="text-sm font-medium text-[var(--fg)]">{m.title}</p>
                          <p className="text-[11px] text-[var(--fg-muted)]">Our orb</p>
                        </div>
                      </div>
                    </Link>
                  );
                }
                return (
                  <Link
                    key={m.id}
                    href={`/album/${albumId}/memory/${m.id}`}
                    className={cn(
                      "mb-5 break-inside-avoid block overflow-hidden rounded-xl bg-[var(--surface)] p-2 shadow-[var(--shadow-polaroid)] transition-transform hover:-translate-y-1",
                      lift,
                    )}
                  >
                    <div className="relative aspect-[4/5] w-full overflow-hidden bg-[var(--surface-2)]">
                      {m.imageUrl ? (
                        <Image
                          src={m.imageUrl}
                          alt=""
                          fill
                          sizes="(max-width: 640px) 45vw, 220px"
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-[10px] text-[var(--fg-muted)]">
                          Polaroid
                        </div>
                      )}
                    </div>
                    <p className="mt-2 px-1 text-[11px] text-[var(--fg)]">
                      {m.title || m.frontCaption || "Untitled"}
                    </p>
                  </Link>
                );
              })}
            </div>
          </section>
        );
      })}
      {years.length === 0 ? (
        <p className="text-sm text-[var(--fg-muted)]">Nothing to show yet — add something to our album first.</p>
      ) : null}
    </div>
  );
}
