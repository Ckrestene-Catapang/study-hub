import { Search, X } from "lucide-react"
import { Input } from "../ui/Input"

/**
 * RoomSearch - Search component for filtering rooms
 */
export function RoomSearch({ value, onChange, placeholder = "Search rooms..." }) {
  return (
    <div className="relative">
      <Search
        className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none"
        aria-hidden="true"
      />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-10 pr-10"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded transition-colors"
          title="Clear search"
          aria-label="Clear search"
        >
          <X className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
        </button>
      )}
    </div>
  )
}
