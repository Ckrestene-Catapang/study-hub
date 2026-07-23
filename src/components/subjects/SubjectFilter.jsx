import { Button } from "../ui/Button"
import { cn } from "@/utils/cn"

/**
 * SubjectFilter - Filter buttons for subjects by progress level
 */
export function SubjectFilter({ selectedFilter, onFilterChange }) {
  const filters = [
    { id: "all", label: "All", range: null },
    { id: "beginner", label: "Beginner", range: [0, 33] },
    { id: "intermediate", label: "Intermediate", range: [34, 66] },
    { id: "advanced", label: "Advanced", range: [67, 100] },
  ]

  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => (
        <Button
          key={filter.id}
          variant={selectedFilter === filter.id ? "default" : "outline"}
          size="sm"
          onClick={() => onFilterChange(filter.id)}
          className={cn(
            "transition-all duration-200",
            selectedFilter === filter.id
              ? "bg-primary text-primary-foreground"
              : "hover:bg-muted"
          )}
        >
          {filter.label}
        </Button>
      ))}
    </div>
  )
}
