import { Modal } from "../ui/Modal"
import { Button } from "../ui/Button"

/**
 * DeleteNoteModal - Confirmation modal for deleting notes
 */
export function DeleteNoteModal({
  open,
  onClose,
  onConfirm,
  note = null,
}) {
  if (!note) return null

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Delete Note"
      description={`Are you sure you want to delete "${note.title}"? This action cannot be undone.`}
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              onConfirm(note.id)
              onClose()
            }}
          >
            Delete
          </Button>
        </>
      }
    >
      <p className="text-sm text-muted-foreground">
        This note will be permanently removed from your collection.
      </p>
    </Modal>
  )
}
