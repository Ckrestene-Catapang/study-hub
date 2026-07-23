import { forwardRef } from "react"
import { cn } from "@/utils/cn"
import { Loader2 } from "lucide-react"

const variants = {
  primary:
    "bg-primary text-primary-foreground shadow-sm hover:brightness-110 active:brightness-95",
  secondary:
    "bg-secondary text-secondary-foreground hover:bg-accent hover:text-accent-foreground",
  outline:
    "border border-border bg-transparent text-foreground hover:bg-secondary",
  ghost: "bg-transparent text-foreground hover:bg-secondary",
  destructive:
    "bg-destructive text-destructive-foreground shadow-sm hover:brightness-110",
}

const sizes = {
  sm: "h-9 px-3 text-sm gap-1.5",
  md: "h-10 px-4 text-sm gap-2",
  lg: "h-12 px-6 text-base gap-2",
  icon: "h-10 w-10",
}

/**
 * The single Button component used across the entire app.
 */
export const Button = forwardRef(function Button(
  {
    as: Component = "button",
    className,
    variant = "primary",
    size = "md",
    loading = false,
    disabled = false,
    children,
    ...props
  },
  ref,
) {
  const isNativeButton = Component === "button"

  return (
    <Component
      ref={ref}
      // Only native buttons get the disabled attribute; links use aria + styles.
      disabled={isNativeButton ? disabled || loading : undefined}
      aria-disabled={!isNativeButton && (disabled || loading) ? "true" : undefined}
      className={cn(
        "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
      {children}
    </Component>
  )
})
