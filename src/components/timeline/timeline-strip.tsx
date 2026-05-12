"use client";

import type { Memory } from "@/lib/types";
import { PolaroidCard } from "@/components/memory/polaroid-card";
import { OrbMarker } from "@/components/memory/orb-marker";
import { cn } from "@/lib/cn";

type TimelineStripProps = {
  memories: Memory[];
  albumId: string;
  className?: string;
};

export function TimelineStrip({ memories, albumId, className }: TimelineStripProps) {
  return (
    <div className={cn("relative", className)}>
      <div
        className="flex snap-x snap-mandatory gap-10 overflow-x-auto pb-16 pt-8 [scrollbar-width:thin]"
        style={{
          scrollPaddingInline: 24,
          maskImage:
            "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
        }}
      >
        <div aria-hidden className="w-4 shrink-0 sm:w-10" />
        {memories.map((m, i) => (
          <div
            key={m.id}
            className="snap-center shrink-0"
            style={{ transform: `translateY(${i % 2 === 0 ? 0 : 12}px)` }}
          >
            {m.type === "orb" ? (
              <OrbMarker memory={m} />
            ) : (
              <PolaroidCard
                memory={m}
                detailHref={`/album/${albumId}/memory/${m.id}`}
              />
            )}
          </div>
        ))}
        <div aria-hidden className="w-4 shrink-0 sm:w-10" />
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-6 left-8 right-8 h-px bg-[color-mix(in_oklab,var(--fg)_12%,transparent)]"
      />
    </div>
  );
}
