"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

const H = 24;
const RATIO = 2157.78 / 311.06;

type MomentsWordmarkProps = {
  className?: string;
  priority?: boolean;
};

/**
 * Full “moments” wordmark: red on light backgrounds, white+red on dark (system preference).
 */
export function MomentsWordmark({ className, priority }: MomentsWordmarkProps) {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => setDark(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const src = dark ? "/brand/moments-wordmark-dark.svg" : "/brand/moments-wordmark-light.svg";

  return (
    <Image
      src={src}
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
