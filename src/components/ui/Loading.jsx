import { Loader2 } from "lucide-react"
import { cn } from "@/utils/cn"

/** Centered spinner for route/page-level loading states. */
export function Loading({ label = "Loading", className, fullscreen = false }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "flex flex-col items-center justify-center gap-3 text-muted-foreground",
        fullscreen ? "min-h-screen" : "min-h-64 w-full",
        className,
      )}
    >
      <Loader2 className="h-6 w-6 animate-spin text-primary" aria-hidden="true" />
      <span className="text-sm">{label}</span>
      <span className="sr-only">{label}</span>
    </div>
  )
}
