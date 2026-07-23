import { Card } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"

/**
 * Scaffold body for feature pages that are architected but not yet built out.
 * Signals to the next engineer exactly where to continue.
 */
export function PagePlaceholder({ icon: Icon, title, description, service }) {
  return (
    <Card className="flex flex-col items-center justify-center gap-4 py-20 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
        {Icon && <Icon className="h-7 w-7" aria-hidden="true" />}
      </span>
      <div className="flex max-w-md flex-col gap-2">
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-sm text-muted-foreground text-pretty">{description}</p>
      </div>
      {service && (
        <Badge variant="outline" className="font-mono">
          {service}
        </Badge>
      )}
    </Card>
  )
}
