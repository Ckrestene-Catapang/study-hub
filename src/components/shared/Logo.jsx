import { GraduationCap } from "lucide-react"
import { cn } from "@/utils/cn"

/** StudyHub wordmark + icon. */
export function Logo({ collapsed = false, className }) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
        <GraduationCap className="h-5 w-5" aria-hidden="true" />
      </span>
      {!collapsed && (
        <span className="text-lg font-bold tracking-tight text-foreground">
          Study<span className="text-primary">Hub</span>
        </span>
      )}
    </div>
  )
}
