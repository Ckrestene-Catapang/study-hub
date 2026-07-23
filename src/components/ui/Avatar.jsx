import { cn } from "@/utils/cn"

const sizes = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-14 w-14 text-base",
}

function initials(name = "") {
  return name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

/** User avatar with image fallback to initials. */
export function Avatar({ src, name = "User", size = "md", className }) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-accent font-semibold text-accent-foreground",
        sizes[size],
        className,
      )}
    >
      {src ? (
        <img
          src={src || "/placeholder.svg"}
          alt={name}
          className="h-full w-full object-cover"
          crossOrigin="anonymous"
        />
      ) : (
        initials(name)
      )}
    </span>
  )
}
