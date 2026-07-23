import { Button } from "../ui/Button"
import { Filter } from "lucide-react"
import { cn } from "@/utils/cn"

/**
 * NotesFilter - Buttons for filtering by subject or folder
 */
export function NotesFilter({
  items,
  selectedFilter,
  onFilterChange,
  label = "Subject",
}) {
  if (!items || items.length === 0) return null

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <Filter className="h-4 w-4" />
        {label}:
      </div>
      <div className="flex gap-2 flex-wrap">
        <Button
          variant={selectedFilter === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => onFilterChange("all")}
        >
          All
        </Button>
        {items.map((item) => (
          <Button
            key={item.id || item}
            variant={selectedFilter === (item.id || item) ? "default" : "outline"}
            size="sm"
            onClick={() => onFilterChange(item.id || item)}
            className="text-xs"
          >
            {item.name || item}
          </Button>
        ))}
      </div>
    </div>
  )
}
