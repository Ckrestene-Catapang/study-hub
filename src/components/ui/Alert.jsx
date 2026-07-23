import { forwardRef } from "react"
import clsx from "clsx"

const Alert = forwardRef(({ variant = "default", className, children, ...props }, ref) => {
  const baseStyles = "rounded-lg border px-4 py-3 text-sm"
  
  const variants = {
    default: "border-gray-300 bg-gray-50 text-gray-800",
    destructive: "border-red-300 bg-red-50 text-red-800",
    warning: "border-yellow-300 bg-yellow-50 text-yellow-800",
    success: "border-green-300 bg-green-50 text-green-800",
    info: "border-blue-300 bg-blue-50 text-blue-800",
  }

  return (
    <div
      ref={ref}
      role="alert"
      className={clsx(baseStyles, variants[variant], className)}
      {...props}
    >
      {children}
    </div>
  )
})

Alert.displayName = "Alert"

export { Alert }
