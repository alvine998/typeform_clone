"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const avatarVariants = cva(
  "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 font-medium text-white",
  {
    variants: {
      size: {
        sm: "h-8 w-8 text-xs",
        md: "h-10 w-10 text-sm",
        lg: "h-12 w-12 text-base",
        xl: "h-16 w-16 text-lg",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

export interface AvatarProps extends VariantProps<typeof avatarVariants> {
  src?: string | null;
  alt?: string;
  initials?: string;
  online?: boolean;
  className?: string;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function Avatar({
  src,
  alt,
  initials,
  size,
  online,
  className,
}: AvatarProps) {
  const fallback = initials || (alt ? getInitials(alt) : "?");

  return (
    <div className={cn("relative inline-flex", className)}>
      <div className={cn(avatarVariants({ size }))}>
        {src ? (
          <img
            src={src}
            alt={alt || "Avatar"}
            className="h-full w-full object-cover"
          />
        ) : (
          <span>{fallback}</span>
        )}
      </div>
      {online !== undefined && (
        <span
          className={cn(
            "absolute bottom-0 right-0 block rounded-full ring-2 ring-white",
            size === "sm" ? "h-2 w-2" : "h-2.5 w-2.5",
            online ? "bg-emerald-500" : "bg-gray-400"
          )}
        />
      )}
    </div>
  );
}

export { Avatar, avatarVariants };
