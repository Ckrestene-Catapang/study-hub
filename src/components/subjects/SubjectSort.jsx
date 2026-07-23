import { Button } from "../ui/Button"
import { Dropdown, DropdownItem } from "../ui/Dropdown"
import { ArrowUpDown, Check } from "lucide-react"

/**
 * SubjectSort - Dropdown for sorting subjects
 */
export function SubjectSort({ selectedSort, onSortChange }) {
  const sortOptions = [
    { id: "name-asc", label: "Name (A-Z)" },
    { id: "name-desc", label: "Name (Z-A)" },
    { id: "progress-high", label: "Progress (High to Low)" },
    { id: "progress-low", label: "Progress (Low to High)" },
    { id: "recent", label: "Recently Studied" },
    { id: "notes", label: "Most Notes" },
  ]

  const selectedLabel = sortOptions.find((opt) => opt.id === selectedSort)?.label || "Sort by"

  return (
    <Dropdown
      trigger={
        <Button variant="outline" size="sm" className="gap-2">
          <ArrowUpDown className="h-4 w-4" />
          <span className="hidden sm:inline">{selectedLabel}</span>
          <span className="sm:hidden">Sort</span>
        </Button>
      }
    >
      {sortOptions.map((option) => (
        <DropdownItem
          key={option.id}
          onClick={() => onSortChange(option.id)}
          icon={
            selectedSort === option.id ? (
              <Check className="h-4 w-4 text-primary" />
            ) : (
              <div className="h-4 w-4" />
            )
          }
        >
          {option.label}
        </DropdownItem>
      ))}
    </Dropdown>
  )
}
