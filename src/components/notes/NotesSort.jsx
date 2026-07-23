import { Button } from "../ui/Button"
import { Dropdown, DropdownItem } from "../ui/Dropdown"
import { ArrowUpDown, Check } from "lucide-react"

/**
 * NotesSort - Dropdown for sorting notes
 */
export function NotesSort({ selectedSort, onSortChange }) {
  const sortOptions = [
    { id: "date-recent", label: "Most Recent" },
    { id: "date-oldest", label: "Oldest First" },
    { id: "title-asc", label: "Title (A-Z)" },
    { id: "title-desc", label: "Title (Z-A)" },
    { id: "favorites", label: "Favorites First" },
  ]

  const selectedLabel =
    sortOptions.find((opt) => opt.id === selectedSort)?.label || "Sort by"

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
