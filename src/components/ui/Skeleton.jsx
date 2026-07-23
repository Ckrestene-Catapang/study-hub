import { cn } from "@/utils/cn"

/** Content placeholder shown while data loads. */
export function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn("animate-pulse rounded-lg bg-muted", className)}
      {...props}
    />
  )
}
