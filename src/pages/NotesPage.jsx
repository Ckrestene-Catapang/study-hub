import { useState, useMemo } from "react"
import { useAsync } from "../hooks/useAsync"
import { noteService } from "../services"
import { subjectService } from "../services"
import { PageHeader } from "../components/shared/PageHeader"
import { Skeleton } from "../components/ui/Skeleton"
import { Alert } from "../components/ui/Alert"
import { Button } from "../components/ui/Button"
import { NotesGrid } from "../components/notes/NotesGrid"
import { NotesToolbar } from "../components/notes/NotesToolbar"
import { NotesFilter } from "../components/notes/NotesFilter"
import { CreateNoteModal } from "../components/notes/CreateNoteModal"
import { DeleteNoteModal } from "../components/notes/DeleteNoteModal"
import { AlertCircle, RefreshCw } from "lucide-react"

export default function NotesPage() {
  const { data: notes, loading: notesLoading, error: notesError, refetch: refetchNotes } = useAsync(() =>
    noteService.getNotes()
  )
  const { data: subjects, loading: subjectsLoading, error: subjectsError } = useAsync(() =>
    subjectService.getSubjects()
  )
  const { data: folders, loading: foldersLoading, error: foldersError } = useAsync(() =>
    noteService.getFolders()
  )

  // State for search, filter, sort
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSubject, setSelectedSubject] = useState("all")
  const [selectedFolder, setSelectedFolder] = useState("all")
  const [selectedSort, setSelectedSort] = useState("date-recent")

  // Modal states
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [editingNote, setEditingNote] = useState(null)
  const [deletingNote, setDeletingNote] = useState(null)

  // Apply search, filter, and sort
  const filteredNotes = useMemo(() => {
    if (!notes) return []

    // Apply search
    let result = notes
    if (searchQuery) {
      result = result.filter((note) => {
        const lowerQuery = searchQuery.toLowerCase()
        return (
          note.title.toLowerCase().includes(lowerQuery) ||
          note.content.toLowerCase().includes(lowerQuery) ||
          note.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
        )
      })
    }

    // Apply subject filter
    if (selectedSubject !== "all") {
      result = result.filter((note) => note.subjectId === selectedSubject)
    }

    // Apply folder filter
    if (selectedFolder !== "all") {
      result = result.filter((note) => note.folder === selectedFolder)
    }

    // Apply sort
    result = noteService.sortNotes(result, selectedSort)

    return result
  }, [notes, searchQuery, selectedSubject, selectedFolder, selectedSort])

  // Handle note creation/update
  const handleSaveNote = (noteData, noteId) => {
    // In a real app, this would call an API
    // For now, just clear the edit state
    setEditingNote(null)
  }

  // Handle note deletion
  const handleDeleteNote = (noteId) => {
    // In a real app, this would call an API
    setDeletingNote(null)
  }

  // Handle favorite toggle
  const handleToggleFavorite = (noteId) => {
    // In a real app, this would call an API
    noteService.toggleFavorite(noteId)
  }

  // Prepare filter items
  const subjectFilter = subjects
    ? subjects.map((s) => ({ id: s.id, name: s.name }))
    : []
  const folderFilter = folders || []

  if (notesLoading) {
    return (
      <div className="flex flex-col gap-8">
        <PageHeader
          title="Notes"
          subtitle="Create and manage your study notes."
        />
        <Skeleton className="h-10 w-full rounded-lg" />
        <Skeleton className="h-10 w-full rounded-lg" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-64 w-full rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  // Show error if notes failed to load
  if (notesError) {
    return (
      <div className="flex flex-col gap-8">
        <PageHeader
          title="Notes"
          subtitle="Create and manage your study notes."
        />
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <div className="ml-2">
            <h3 className="font-semibold">Failed to load notes</h3>
            <p className="text-sm mt-1">{notesError.message || "Something went wrong. Please try again."}</p>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={refetchNotes}
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
        title="Notes"
        subtitle="Create and manage your study notes with search, folders, and tags."
      />

      {/* Toolbar */}
      <NotesToolbar
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        sortValue={selectedSort}
        onSortChange={setSelectedSort}
        onCreateNote={() => {
          setEditingNote(null)
          setCreateModalOpen(true)
        }}
        resultCount={filteredNotes.length}
        totalCount={notes?.length || 0}
      />

      {/* Filters */}
      <div className="flex flex-col gap-4">
        {subjectFilter.length > 0 && (
          <NotesFilter
            items={subjectFilter}
            selectedFilter={selectedSubject}
            onFilterChange={setSelectedSubject}
            label="Subject"
          />
        )}

        {folderFilter.length > 0 && (
          <NotesFilter
            items={folderFilter}
            selectedFilter={selectedFolder}
            onFilterChange={setSelectedFolder}
            label="Folder"
          />
        )}
      </div>

      {/* Empty State */}
      {filteredNotes.length === 0 && notes && notes.length === 0 && (
        <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-12 text-center">
          <p className="text-gray-600 mb-4">No notes yet. Create your first note to get started!</p>
          <Button onClick={() => setCreateModalOpen(true)}>Create Note</Button>
        </div>
      )}

      {/* No Results State */}
      {filteredNotes.length === 0 && notes && notes.length > 0 && (
        <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-12 text-center">
          <p className="text-gray-600">No notes match your filters. Try adjusting your search or filters.</p>
        </div>
      )}

      {/* Grid */}
      {filteredNotes.length > 0 && (
        <NotesGrid
          notes={filteredNotes}
          onEdit={(note) => {
            setEditingNote(note)
            setCreateModalOpen(true)
          }}
          onDelete={(note) => {
            setDeletingNote(note)
            setDeleteModalOpen(true)
          }}
          onFavorite={handleToggleFavorite}
          isEmpty={false}
        />
      )}

      {/* Modals */}
      <CreateNoteModal
        open={createModalOpen}
        onClose={() => {
          setCreateModalOpen(false)
          setEditingNote(null)
        }}
        onSave={handleSaveNote}
        initialNote={editingNote}
        subjects={subjects || []}
        folders={folders || []}
      />

      <DeleteNoteModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteNote}
        note={deletingNote}
      />
    </div>
  )
}
