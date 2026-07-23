import { Input } from "../ui/Input"
import { Search, X } from "lucide-react"

/**
 * SubjectSearch - Search input for filtering subjects
 */
export function SubjectSearch({ value, onChange, placeholder = "Search subjects..." }) {
  return (
    <div className="w-full">
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        leftIcon={<Search className="h-4 w-4" />}
        rightIcon={
          value ? (
            <button
              onClick={() => onChange("")}
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          ) : null
        }
        containerClassName="w-full"
      />
    </div>
  )
}
