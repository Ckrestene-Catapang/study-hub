import { useState, useMemo, useCallback } from "react"
import { useAsync } from "../hooks/useAsync"
import { quizService } from "../services"
import { PageHeader } from "../components/shared/PageHeader"
import { Skeleton } from "../components/ui/Skeleton"
import { Alert } from "../components/ui/Alert"
import { Button } from "../components/ui/Button"
import { AlertCircle, RefreshCw, Plus } from "lucide-react"

export default function QuizzesPage() {
  const { data: quizzes, loading, error, refetch } = useAsync(() =>
    quizService.getQuizzes()
  )

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSort, setSelectedSort] = useState("date-recent")

  // Filter and sort quizzes
  const filteredQuizzes = useMemo(() => {
    if (!quizzes) return []

    let result = [...quizzes]

    // Apply search
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase()
      result = result.filter((quiz) =>
        quiz.title.toLowerCase().includes(lowerQuery) ||
        (quiz.description && quiz.description.toLowerCase().includes(lowerQuery))
      )
    }

    // Apply sort
    switch (selectedSort) {
      case "title-asc":
        return result.sort((a, b) => a.title.localeCompare(b.title))
      case "title-desc":
        return result.sort((a, b) => b.title.localeCompare(a.title))
      case "date-oldest":
        return result.sort((a, b) =>
          new Date(a.created_at) - new Date(b.created_at)
        )
      case "date-recent":
      default:
        return result.sort((a, b) =>
          new Date(b.created_at) - new Date(a.created_at)
        )
    }
  }, [quizzes, searchQuery, selectedSort])

  if (loading) {
    return (
      <div className="flex flex-col gap-8">
        <PageHeader
          title="Quizzes"
          subtitle="Create and manage quizzes to test your knowledge."
        />
        <Skeleton className="h-10 w-full rounded-lg" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-48 w-full rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col gap-8">
        <PageHeader
          title="Quizzes"
          subtitle="Create and manage quizzes to test your knowledge."
        />
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <div className="ml-2">
            <h3 className="font-semibold">Failed to load quizzes</h3>
            <p className="text-sm mt-1">{error.message || "Something went wrong. Please try again."}</p>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={refetch}
            className="ml-auto"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </Alert>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Quizzes"
        subtitle="Create and manage quizzes to test your knowledge."
      />

      {/* Search and Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search quizzes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <Button className="flex items-center gap-2 sm:flex-shrink-0">
          <Plus className="h-4 w-4" />
          Create Quiz
        </Button>
      </div>

      {/* Sort Options */}
      <div className="flex items-center gap-4">
        <label className="text-sm text-gray-600">Sort by:</label>
        <select
          value={selectedSort}
          onChange={(e) => setSelectedSort(e.target.value)}
          className="px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="date-recent">Newest</option>
          <option value="date-oldest">Oldest</option>
          <option value="title-asc">Title (A-Z)</option>
          <option value="title-desc">Title (Z-A)</option>
        </select>
      </div>

      {/* Empty State */}
      {filteredQuizzes.length === 0 && quizzes && quizzes.length === 0 && (
        <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-12 text-center">
          <p className="text-gray-600 mb-4">No quizzes yet. Create your first quiz to get started!</p>
          <Button>Create Quiz</Button>
        </div>
      )}

      {/* No Results State */}
      {filteredQuizzes.length === 0 && quizzes && quizzes.length > 0 && (
        <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-12 text-center">
          <p className="text-gray-600">No quizzes match your search. Try adjusting your query.</p>
        </div>
      )}

      {/* Quiz List */}
      {filteredQuizzes.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredQuizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="rounded-lg border border-gray-200 bg-white p-6 hover:shadow-lg transition-shadow cursor-pointer"
            >
              <h3 className="font-semibold text-gray-900">{quiz.title}</h3>
              {quiz.description && (
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">{quiz.description}</p>
              )}
              <div className="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-500">
                <div className="flex justify-between">
                  <span>Created {new Date(quiz.created_at).toLocaleDateString()}</span>
                  <span className={quiz.is_published ? "text-green-600 font-medium" : "text-gray-400"}>
                    {quiz.is_published ? "Published" : "Draft"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
