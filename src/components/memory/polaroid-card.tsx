"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { useCallback, useId, useState } from "react";
import type { PolaroidMemory } from "@/lib/types";
import { cn } from "@/lib/cn";
import { formatMemoryStamp } from "@/lib/dates";
import { FreehandIcon } from "@/components/ui/freehand-icon";

type PolaroidCardProps = {
  memory: PolaroidMemory;
  detailHref?: string;
  className?: string;
  interactive?: boolean;
};

export function PolaroidCard({
  memory,
  detailHref,
  className,
  interactive = true,
}: PolaroidCardProps) {
  const reduceMotion = useReducedMotion();
  const [flipped, setFlipped] = useState(false);
  const id = useId();
  const labelId = `${id}-label`;

  const toggle = useCallback(() => {
    if (!interactive) return;
    setFlipped((v) => !v);
  }, [interactive]);

  return (
    <div className={cn("perspective-[1200px]", className)}>
      <motion.div
        layout
        className="relative min-h-[340px] w-[220px] sm:min-h-[380px] sm:w-[260px]"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: reduceMotion ? 0 : flipped ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 80, damping: 18 }}
      >
        <span id={labelId} className="sr-only">
          {memory.title || "Memory polaroid"}
        </span>

        <div
          className="absolute inset-0 flex flex-col rounded-[var(--radius-card)] bg-[var(--surface)] p-3 shadow-[var(--shadow-polaroid)]"
          style={{ backfaceVisibility: "hidden" }}
        >
          <button
            type="button"
            disabled={!interactive}
            onClick={toggle}
            className={cn(
              "flex flex-1 flex-col text-left outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]",
              interactive ? "cursor-pointer" : "cursor-default",
            )}
            aria-pressed={interactive ? flipped : undefined}
            aria-labelledby={labelId}
            aria-label={
              interactive
                ? `${memory.title || "Polaroid memory"}. ${flipped ? "Showing back" : "Showing front"}. Press to flip.`
                : memory.title
            }
          >
            <div className="relative mt-1 aspect-[4/5] w-full overflow-hidden bg-[var(--surface-2)]">
              {memory.imageUrl ? (
                <Image
                  src={memory.imageUrl}
                  alt=""
                  fill
                  sizes="260px"
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div className="flex h-full items-center justify-center text-[10px] text-[var(--fg-muted)]">
                  No photo yet
                </div>
              )}
            </div>
            {memory.frontCaption ? (
              <p className="mt-3 line-clamp-2 text-center text-xs text-[var(--fg)]">
                {memory.frontCaption}
              </p>
            ) : null}
            <p className="mt-auto pt-3 text-center text-[10px] tracking-[0.2em] uppercase text-[var(--fg-muted)]">
              {formatMemoryStamp(memory.date)}
            </p>
          </button>
          {detailHref ? (
            <Link
              href={detailHref}
              className="mt-2 inline-flex items-center justify-center gap-1 pb-1 text-center text-[10px] text-[var(--accent)] underline-offset-2 hover:underline"
            >
              Open detail
              <FreehandIcon name="navigation-page-right" width={12} height={12} />
            </Link>
          ) : null}
        </div>

        <div
          className="absolute inset-0 rounded-[var(--radius-card)] bg-[#f0ebe3] p-4 shadow-[var(--shadow-polaroid)] dark:bg-[#2c2823]"
          style={{
            transform: "rotateY(180deg)",
            backfaceVisibility: "hidden",
          }}
        >
          <button
            type="button"
            disabled={!interactive}
            onClick={toggle}
            className={cn(
              "flex h-full w-full flex-col text-left outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]",
              interactive ? "cursor-pointer" : "cursor-default",
            )}
            aria-label="Flip to front"
          >
            <p className="text-[11px] leading-relaxed text-[var(--fg)]">{memory.message}</p>
            <p className="mt-4 text-[10px] text-[var(--fg-muted)]">
              {formatMemoryStamp(memory.date)}
            </p>
            {memory.location ? (
              <p className="mt-1 text-[10px] text-[var(--fg-muted)]">{memory.location}</p>
            ) : null}
            {memory.tags && memory.tags.length > 0 ? (
              <p className="mt-2 text-[10px] tracking-wide text-[var(--fg-muted)]">
                {memory.tags.join(" · ")}
              </p>
            ) : null}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
