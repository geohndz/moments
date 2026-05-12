"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { OrbMemory } from "@/lib/types";
import { cn } from "@/lib/cn";
import { formatMemoryStamp } from "@/lib/dates";

export function OrbMarker({ memory, className }: { memory: OrbMemory; className?: string }) {
  const reduceMotion = useReducedMotion();
  const tint = memory.mood?.startsWith("#") ? memory.mood : undefined;
  const glow = tint ?? "var(--accent)";

  return (
    <motion.div
      layout
      className={cn("flex w-40 flex-col items-center gap-2", className)}
      animate={
        reduceMotion
          ? undefined
          : {
              scale: [1, 1.03, 1],
              opacity: [0.85, 1, 0.85],
            }
      }
      transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
    >
      <div
        className="relative h-16 w-16 rounded-full"
        style={{
          boxShadow: `0 0 32px 10px color-mix(in oklab, ${glow} 35%, transparent)`,
          background: `radial-gradient(circle at 30% 25%, color-mix(in oklab, ${glow} 55%, white), color-mix(in oklab, ${glow} 15%, transparent))`,
        }}
        aria-label={`Orb moment: ${memory.title}`}
      />
      <p className="text-center text-xs font-medium text-[var(--fg)]">{memory.title}</p>
      <p className="text-center text-[10px] text-[var(--fg-muted)]">{formatMemoryStamp(memory.date)}</p>
    </motion.div>
  );
}
