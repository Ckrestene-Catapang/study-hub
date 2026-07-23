import { Card, CardBody } from "../ui/Card"
import { Badge } from "../ui/Badge"
import { Button } from "../ui/Button"
import { motion } from "framer-motion"
import { Heart, Edit2, Trash2 } from "lucide-react"
import { cn } from "@/utils/cn"

/**
 * NoteCard - Individual note display card with preview and actions
 */
export function NoteCard({
  note,
  index,
  onEdit,
  onDelete,
  onFavorite,
  className,
}) {
  // Defensive data access with fallbacks
  const title = note?.title || "Untitled Note"
  const excerpt = note?.excerpt || note?.content || "No content"
  const updatedAt = note?.updatedAt ? new Date(note.updatedAt) : new Date()
  const folder = note?.folder || "General"
  const tags = Array.isArray(note?.tags) ? note.tags : []
  const isFavorite = Boolean(note?.isFavorite)

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      onEdit?.(note)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={cn("h-full", className)}
    >
      <Card
        hover
        className="flex h-full flex-col gap-3 cursor-pointer group"
        onClick={() => onEdit?.(note)}
        role="button"
        tabIndex={0}
        onKeyDown={handleKeyDown}
      >
        <CardBody className="flex flex-col gap-3 flex-1">
          {/* Header with favorite button */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm line-clamp-2">
                {title}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                {updatedAt.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: updatedAt.getFullYear() !== new Date().getFullYear() ? "numeric" : undefined,
                })}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "shrink-0 opacity-0 group-hover:opacity-100 transition-opacity",
                isFavorite && "opacity-100"
              )}
              onClick={(e) => {
                e.stopPropagation()
                onFavorite?.(note?.id)
              }}
              aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              <Heart
                className={cn(
                  "h-4 w-4",
                  isFavorite && "fill-destructive text-destructive"
                )}
              />
            </Button>
          </div>

          {/* Content preview */}
          <p className="text-xs text-muted-foreground line-clamp-3">
            {excerpt}
          </p>

          {/* Metadata */}
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <div className="flex items-center gap-2 min-w-0">
              {folder && (
                <Badge variant="outline" className="text-xs truncate">
                  {folder}
                </Badge>
              )}
            </div>
            <span className="text-xs text-muted-foreground shrink-0">
              {tags.length} tag{tags.length !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Tags preview */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {tags.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {tags.length > 2 && (
                <Badge variant="secondary" className="text-xs">
                  +{tags.length - 2}
                </Badge>
              )}
            </div>
          )}
        </CardBody>

        {/* Actions - visible on hover */}
        <div className="flex gap-2 p-4 pt-0 border-t border-border opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={(e) => {
              e.stopPropagation()
              onEdit?.(note)
            }}
          >
            <Edit2 className="h-3 w-3 mr-1" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 text-destructive hover:text-destructive"
            onClick={(e) => {
              e.stopPropagation()
              onDelete?.(note)
            }}
          >
            <Trash2 className="h-3 w-3 mr-1" />
            Delete
          </Button>
        </div>
      </Card>
    </motion.div>
  )
}
