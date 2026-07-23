import { SubjectCard } from "./SubjectCard"
import { AlertCircle } from "lucide-react"

/**
 * SubjectGrid - Grid display for subject cards
 */
export function SubjectGrid({ subjects, onSubjectClick, isEmpty }) {
  if (isEmpty) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted mb-4">
          <AlertCircle className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No subjects found</h3>
        <p className="text-sm text-muted-foreground">
          Try adjusting your search or filter criteria.
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {subjects.map((subject, index) => (
        <SubjectCard
          key={subject.id}
          subject={subject}
          index={index}
          onClick={() => onSubjectClick?.(subject)}
        />
      ))}
    </div>
  )
}
