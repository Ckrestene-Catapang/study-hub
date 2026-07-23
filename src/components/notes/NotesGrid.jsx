import { NoteCard } from "./NoteCard"

/**
 * NotesGrid - Responsive grid layout for note cards
 */
export function NotesGrid({
  notes,
  onEdit,
  onDelete,
  onFavorite,
  isEmpty = false,
}) {
  if (isEmpty || notes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <p className="text-muted-foreground text-sm">
          No notes found. Create your first note to get started!
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {notes.map((note, index) => (
        <NoteCard
          key={note.id}
          note={note}
          index={index}
          onEdit={onEdit}
          onDelete={onDelete}
          onFavorite={onFavorite}
        />
      ))}
    </div>
  )
}
