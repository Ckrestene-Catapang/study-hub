import { useState } from "react"
import { Modal } from "../ui/Modal"
import { Input } from "../ui/Input"
import { Button } from "../ui/Button"
import { Loader } from "lucide-react"

/**
 * JoinRoomModal - Modal for joining a room by code
 */
export function JoinRoomModal({ open, onClose, onSubmit, isLoading }) {
  const [code, setCode] = useState("")
  const [error, setError] = useState("")

  const handleChange = (e) => {
    setCode(e.target.value.toUpperCase())
    if (error) setError("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!code.trim()) {
      setError("Please enter a room code")
      return
    }

    if (code.length !== 10) {
      setError("Room code must be exactly 10 characters")
      return
    }

    try {
      await onSubmit(code)
      setCode("")
      setError("")
    } catch (err) {
      setError(err.message || "Failed to join room")
    }
  }

  const handleClose = () => {
    setCode("")
    setError("")
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Join a Room"
      description="Enter the room code to join an existing study room"
      size="sm"
      footer={
        <>
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading || code.length !== 10}>
            {isLoading && <Loader className="h-4 w-4 mr-2 animate-spin" aria-hidden="true" />}
            {isLoading ? "Joining..." : "Join Room"}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="code" className="block text-sm font-medium mb-1">
            Room Code <span className="text-red-500">*</span>
          </label>
          <Input
            id="code"
            value={code}
            onChange={handleChange}
            placeholder="e.g., ABC123DEF0"
            maxLength="10"
            disabled={isLoading}
            aria-invalid={!!error}
            aria-describedby={error ? "code-error" : undefined}
            className="font-mono text-center text-lg tracking-widest"
          />
          {error && (
            <p id="code-error" className="text-xs text-red-500 mt-1">
              {error}
            </p>
          )}
          <p className="text-xs text-muted-foreground mt-1">
            {code.length}/10 characters
          </p>
        </div>

        <div className="p-3 bg-muted rounded-lg text-xs text-muted-foreground">
          Ask your teacher or classmates for the room code to join a study session.
        </div>
      </form>
    </Modal>
  )
}
