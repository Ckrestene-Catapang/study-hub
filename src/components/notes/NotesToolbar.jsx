import { Button } from "../ui/Button"
import { NotesSearch } from "./NotesSearch"
import { NotesSort } from "./NotesSort"
import { Plus } from "lucide-react"

/**
 * NotesToolbar - Toolbar with search, sort, and create button
 */
export function NotesToolbar({
  searchValue,
  onSearchChange,
  sortValue,
  onSortChange,
  onCreateNote,
  resultCount,
  totalCount,
}) {
  return (
    <div className="flex flex-col gap-4">
      {/* Search and Create */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          <NotesSearch
            value={searchValue}
            onChange={onSearchChange}
            placeholder="Search notes by title, content, or tags..."
          />
        </div>
        <Button
          onClick={onCreateNote}
          className="gap-2 w-full sm:w-auto"
        >
          <Plus className="h-4 w-4" />
          New Note
        </Button>
      </div>

      {/* Sort and Results */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <NotesSort
          selectedSort={sortValue}
          onSortChange={onSortChange}
        />
        {typeof resultCount === "number" && typeof totalCount === "number" && (
          <p className="text-xs sm:text-sm text-muted-foreground">
            Showing {resultCount} of {totalCount} note{totalCount !== 1 ? "s" : ""}
          </p>
        )}
      </div>
    </div>
  )
}
