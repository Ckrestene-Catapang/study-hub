import { forwardRef, useId } from "react"
import { cn } from "@/utils/cn"

/**
 * The single Input component used across the entire app.
 * Supports an optional label, helper/error text, and leading/trailing icons.
 */
export const Input = forwardRef(function Input(
  {
    className,
    containerClassName,
    label,
    error,
    hint,
    leftIcon,
    rightIcon,
    id,
    ...props
  },
  ref,
) {
  const generatedId = useId()
  const inputId = id || generatedId

  return (
    <div className={cn("flex flex-col gap-1.5", containerClassName)}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-foreground"
        >
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {leftIcon && (
          <span className="pointer-events-none absolute left-3 text-muted-foreground">
            {leftIcon}
          </span>
        )}
        <input
          ref={ref}
          id={inputId}
          aria-invalid={error ? "true" : undefined}
          className={cn(
            "h-10 w-full rounded-lg border border-input bg-card px-3 text-sm text-foreground",
            "placeholder:text-muted-foreground transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-ring",
            "disabled:cursor-not-allowed disabled:opacity-50",
            leftIcon && "pl-9",
            rightIcon && "pr-9",
            error && "border-destructive focus-visible:ring-destructive",
            className,
          )}
          {...props}
        />
        {rightIcon && (
          <span className="absolute right-3 text-muted-foreground">
            {rightIcon}
          </span>
        )}
      </div>
      {error ? (
        <p className="text-xs text-destructive">{error}</p>
      ) : hint ? (
        <p className="text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  )
})
