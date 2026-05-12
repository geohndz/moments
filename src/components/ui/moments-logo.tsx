"use client";

import Image from "next/image";
import { cn } from "@/lib/cn";

const H = 24;
const RATIO = 2157.78 / 311.06;

type MomentsWordmarkProps = {
  className?: string;
  priority?: boolean;
};

/** Full “moments” wordmark for dark UI (white + red). */
export function MomentsWordmark({ className, priority }: MomentsWordmarkProps) {
  return (
    <Image
      src="/brand/moments-wordmark-dark.svg"
      alt="Moments"
      width={Math.round(H * RATIO)}
      height={H}
      className={cn("h-5 w-auto sm:h-6", className)}
      priority={priority}
      unoptimized
    />
  );
}

type MomentsMarkProps = {
  className?: string;
  size?: number;
};

/** Compact mark (m + dot) — same artwork as favicon. */
export function MomentsMark({ className, size = 28 }: MomentsMarkProps) {
  const h = size;
  const w = Math.round((527.82 / 260.62) * h);
  return (
    <Image
      src="/brand/moments-mark.svg"
      alt=""
      width={w}
      height={h}
      className={cn("w-auto shrink-0", className)}
      unoptimized
      aria-hidden
    />
  );
}
