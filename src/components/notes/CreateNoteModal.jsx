import { useState, useEffect } from "react"
import { Modal } from "../ui/Modal"
import { Input } from "../ui/Input"
import { Button } from "../ui/Button"
import { Badge } from "../ui/Badge"
import { X } from "lucide-react"

/**
 * CreateNoteModal - Modal for creating or editing notes
 */
export function CreateNoteModal({
  open,
  onClose,
  onSave,
  initialNote = null,
  subjects = [],
  folders = [],
}) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [subject, setSubject] = useState("")
  const [folder, setFolder] = useState("")
  const [tags, setTags] = useState([])
  const [tagInput, setTagInput] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    if (initialNote) {
      setTitle(initialNote.title || "")
      setContent(initialNote.content || "")
      setSubject(initialNote.subjectId || "")
      setFolder(initialNote.folder || "")
      setTags(Array.isArray(initialNote.tags) ? initialNote.tags : [])
    } else {
      reset()
    }
  }, [initialNote, open])

  useEffect(() => {
    // Clear error when modal closes
    if (!open) {
      setError("")
    }
  }, [open])

  const reset = () => {
    setTitle("")
    setContent("")
    setSubject("")
    setFolder("")
    setTags([])
    setTagInput("")
    setError("")
  }

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim().toLowerCase()
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag])
      setTagInput("")
    }
  }

  const handleRemoveTag = (tag) => {
    setTags(tags.filter((t) => t !== tag))
  }

  const handleSave = () => {
    // Validate required fields
    const titleTrimmed = title.trim()
    const contentTrimmed = content.trim()

    if (!titleTrimmed) {
      setError("Title is required")
      return
    }

    if (!contentTrimmed) {
      setError("Content is required")
      return
    }

    if (titleTrimmed.length < 3) {
      setError("Title must be at least 3 characters")
      return
    }

    const noteData = {
      title: titleTrimmed,
      content: contentTrimmed,
      subjectId: subject,
      folder: folder || "General",
      tags: Array.isArray(tags) ? tags : [],
      excerpt: contentTrimmed.substring(0, 100) + (contentTrimmed.length > 100 ? "..." : ""),
    }

    onSave(noteData, initialNote?.id)
    reset()
    onClose()
  }

  const isValid = title.trim().length >= 3 && content.trim().length > 0

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initialNote ? "Edit Note" : "Create New Note"}
      description={initialNote ? "Update your note" : "Add a new note to your collection"}
      size="lg"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!isValid}>
            {initialNote ? "Update" : "Create"}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4 max-h-[60vh] overflow-y-auto pr-2">
        {/* Error message */}
        {error && (
          <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {/* Title */}
        <Input
          label="Title"
          placeholder="Enter note title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          autoFocus
        />

        {/* Subject */}
        <div>
          <label className="text-sm font-medium text-foreground">Subject</label>
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="h-10 w-full mt-1.5 rounded-lg border border-input bg-card px-3 text-sm text-foreground"
          >
            <option value="">Select a subject</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        {/* Folder */}
        <div>
          <label className="text-sm font-medium text-foreground">Folder</label>
          <input
            type="text"
            placeholder="Create or select folder"
            list="folders"
            value={folder}
            onChange={(e) => setFolder(e.target.value)}
            className="h-10 w-full mt-1.5 rounded-lg border border-input bg-card px-3 text-sm text-foreground"
          />
          <datalist id="folders">
            {folders.map((f) => (
              <option key={f} value={f} />
            ))}
          </datalist>
        </div>

        {/* Content */}
        <div>
          <label className="text-sm font-medium text-foreground">Content</label>
          <textarea
            placeholder="Enter note content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={6}
            className="w-full mt-1.5 rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
          />
        </div>

        {/* Tags */}
        <div>
          <label className="text-sm font-medium text-foreground">Tags</label>
          <div className="flex gap-2 mt-1.5">
            <input
              type="text"
              placeholder="Add tag"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  handleAddTag()
                }
              }}
              className="flex-1 h-10 rounded-lg border border-input bg-card px-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={handleAddTag}
              disabled={!tagInput.trim()}
            >
              Add
            </Button>
          </div>

          {/* Display tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:opacity-70 transition-opacity"
                    aria-label={`Remove tag ${tag}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    </Modal>
  )
}
