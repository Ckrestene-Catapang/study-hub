import { Input } from "../ui/Input"
import { Button } from "../ui/Button"
import { Search, X } from "lucide-react"

/**
 * NotesSearch - Search input with clear button
 */
export function NotesSearch({ value, onChange, placeholder }) {
  return (
    <div className="flex gap-2">
      <div className="flex-1">
        <Input
          placeholder={placeholder || "Search notes by title, content, or tags..."}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          leftIcon={<Search className="h-4 w-4" />}
          rightIcon={
            value ? (
              <button
                onClick={() => onChange("")}
                className="hover:opacity-70 transition-opacity"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            ) : null
          }
        />
      </div>
    </div>
  )
}
