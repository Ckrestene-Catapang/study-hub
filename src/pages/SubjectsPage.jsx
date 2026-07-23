import { useState, useMemo } from "react"
import { useAsync } from "../hooks/useAsync"
import { subjectService } from "../services"
import { PageHeader } from "../components/shared/PageHeader"
import { Skeleton } from "../components/ui/Skeleton"
import { SubjectGrid } from "../components/subjects/SubjectGrid"
import { SubjectSearch } from "../components/subjects/SubjectSearch"
import { SubjectFilter } from "../components/subjects/SubjectFilter"
import { SubjectSort } from "../components/subjects/SubjectSort"

export default function SubjectsPage() {
  const { data: subjects, loading } = useAsync(() =>
    subjectService.getSubjects()
  )
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("all")
  const [selectedSort, setSelectedSort] = useState("name-asc")

  // Apply search, filter, and sort
  const filteredSubjects = useMemo(() => {
    if (!subjects) return []

    // Apply search
    let result = subjects
    if (searchQuery) {
      const lowercaseQuery = searchQuery.toLowerCase()
      result = result.filter(
        (subject) =>
          subject.name.toLowerCase().includes(lowercaseQuery) ||
          subject.description.toLowerCase().includes(lowercaseQuery)
      )
    }

    // Apply filter
    const ranges = {
      all: [0, 100],
      beginner: [0, 33],
      intermediate: [34, 66],
      advanced: [67, 100],
    }
    const [min, max] = ranges[selectedFilter] || [0, 100]
    result = result.filter((s) => s.progress >= min && s.progress <= max)

    // Apply sort
    result = subjectService.sortSubjects(result, selectedSort)

    return result
  }, [subjects, searchQuery, selectedFilter, selectedSort])

  if (loading) {
    return (
      <div className="flex flex-col gap-8">
        <PageHeader
          title="Subjects"
          subtitle="Select a subject to view details and resources."
        />
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <Skeleton className="h-10 w-full md:w-64 rounded-lg" />
          <div className="flex gap-2">
            <Skeleton className="h-9 w-24 rounded-lg" />
            <Skeleton className="h-9 w-24 rounded-lg" />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-48 w-full rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Subjects"
        subtitle="Select a subject to view details and resources."
      />

      {/* Search, Filter, and Sort Controls */}
      <div className="flex flex-col gap-4">
        <SubjectSearch
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search subjects by name or description..."
        />

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <SubjectFilter
            selectedFilter={selectedFilter}
            onFilterChange={setSelectedFilter}
          />
          <SubjectSort
            selectedSort={selectedSort}
            onSortChange={setSelectedSort}
          />
        </div>

        {/* Results count */}
        <p className="text-sm text-muted-foreground">
          Showing {filteredSubjects.length} of {subjects?.length || 0} subjects
        </p>
      </div>

      {/* Grid or Empty State */}
      <SubjectGrid
        subjects={filteredSubjects}
        onSubjectClick={(subject) => {
          // Handle subject selection
        }}
        isEmpty={filteredSubjects.length === 0}
      />
    </div>
  )
}
