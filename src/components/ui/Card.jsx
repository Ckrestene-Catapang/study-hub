import { cn } from "@/utils/cn"

/**
 * Reusable floating card surface with soft shadow.
 * Compose with Card.Header, Card.Title, Card.Content, Card.Footer.
 */
export function Card({ className, hover = false, ...props }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card text-card-foreground shadow-sm",
        hover &&
          "transition-all duration-200 hover:shadow-md hover:-translate-y-0.5",
        className,
      )}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }) {
  return <div className={cn("flex flex-col gap-1 p-6", className)} {...props} />
}

function CardTitle({ className, ...props }) {
  return (
    <h3
      className={cn("text-lg font-semibold tracking-tight text-balance", className)}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }) {
  return (
    <p className={cn("text-sm text-muted-foreground text-pretty", className)} {...props} />
  )
}

function CardContent({ className, ...props }) {
  return <div className={cn("p-6 pt-0", className)} {...props} />
}

function CardFooter({ className, ...props }) {
  return (
    <div className={cn("flex items-center gap-3 p-6 pt-0", className)} {...props} />
  )
}

export function CardBody({ className, ...props }) {
  return <div className={cn("p-6", className)} {...props} />
}

Card.Header = CardHeader
Card.Title = CardTitle
Card.Description = CardDescription
Card.Content = CardContent
Card.Footer = CardFooter
Card.Body = CardBody
