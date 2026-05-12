"use client";

import { Icon, type IconProps } from "@iconify/react";

export type FreehandIconProps = Omit<IconProps, "icon"> & {
  /** Icon slug from the Streamline Freehand set (without the `streamline-freehand:` prefix). */
  name: string;
};

/**
 * Streamline **Freehand** icons via Iconify (`streamline-freehand` collection).
 * @see https://icon-sets.iconify.design/streamline-freehand/
 */
export function FreehandIcon({ name, ...props }: FreehandIconProps) {
  return (
    <Icon icon={`streamline-freehand:${name}`} aria-hidden focusable="false" {...props} />
  );
}
