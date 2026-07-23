import { useState, useMemo, useCallback } from "react"
import { useAuth } from "../context/AuthContext"
import { roomService } from "../services"
import { PageHeader } from "../components/shared/PageHeader"
import { Button } from "../components/ui/Button"
import { Skeleton } from "../components/ui/Skeleton"
import { Toast } from "../components/ui/Toast"
import { RoomGrid } from "../components/rooms/RoomGrid"
import { RoomSearch } from "../components/rooms/RoomSearch"
import { CreateRoomModal } from "../components/rooms/CreateRoomModal"
import { JoinRoomModal } from "../components/rooms/JoinRoomModal"
import { Plus, LogIn } from "lucide-react"
import { useAsync } from "../hooks/useAsync"

export default function RoomsPage() {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showJoinModal, setShowJoinModal] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [isJoining, setIsJoining] = useState(false)
  const [toast, setToast] = useState(null)
  const [rooms, setRooms] = useState([])
  const [memberCounts, setMemberCounts] = useState({})

  // Fetch rooms
  const { loading } = useAsync(async () => {
    try {
      const data = await roomService.getUserRooms()
      setRooms(data)

      // Fetch member counts for each room
      const counts = {}
      for (const room of data) {
        try {
          const members = await roomService.getRoomMembers(room.id)
          counts[room.id] = members.length
        } catch (err) {
          // Silently fail member count fetch
        }
      }
      setMemberCounts(counts)
    } catch (err) {
      showToast("Failed to load rooms", "error")
    }
  })

  // Handle create room
  const handleCreateRoom = useCallback(
    async (formData) => {
      setIsCreating(true)
      try {
        const newRoom = await roomService.createRoom(formData)
        setRooms((prev) => [newRoom, ...prev])
        setMemberCounts((prev) => ({ ...prev, [newRoom.id]: 1 }))
        setShowCreateModal(false)
        showToast(`Room "${newRoom.name}" created successfully!`, "success")
      } catch (err) {
        showToast(err.error || "Failed to create room", "error")
      } finally {
        setIsCreating(false)
      }
    },
    []
  )

  // Handle join room
  const handleJoinRoom = useCallback(
    async (code) => {
      setIsJoining(true)
      try {
        const joinedRoom = await roomService.joinRoom(code)
        if (!rooms.find((r) => r.id === joinedRoom.id)) {
          setRooms((prev) => [joinedRoom, ...prev])
        }
        setShowJoinModal(false)
        showToast(`Successfully joined room!`, "success")

        // Refetch member count for this room
        try {
          const members = await roomService.getRoomMembers(joinedRoom.id)
          setMemberCounts((prev) => ({ ...prev, [joinedRoom.id]: members.length }))
        } catch (err) {
          // Silently fail member count fetch
        }
      } catch (err) {
        const errorMessage = err.error || err.message || "Failed to join room. Check the code and try again."
        showToast(errorMessage, "error")
        throw err
      } finally {
        setIsJoining(false)
      }
    },
    [rooms]
  )

  // Filter rooms by search query
  const filteredRooms = useMemo(() => {
    if (!rooms) return []

    if (!searchQuery) return rooms

    const lowercaseQuery = searchQuery.toLowerCase()
    return rooms.filter(
      (room) =>
        room.name.toLowerCase().includes(lowercaseQuery) ||
        (room.description && room.description.toLowerCase().includes(lowercaseQuery)) ||
        room.code.toLowerCase().includes(lowercaseQuery)
    )
  }, [rooms, searchQuery])

  const showToast = (message, type = "info") => {
    setToast({ message, type, id: Date.now() })
    setTimeout(() => setToast(null), 3000)
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-8">
        <PageHeader
          title="Study Rooms"
          subtitle="Create or join a study room to collaborate with classmates"
        />
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Skeleton className="h-10 w-full sm:w-64 rounded-lg" />
          <div className="flex gap-2">
            <Skeleton className="h-9 w-32 rounded-lg" />
            <Skeleton className="h-9 w-32 rounded-lg" />
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
        title="Study Rooms"
        subtitle="Create or join a study room to collaborate with classmates"
      />

      {/* Search and Action Buttons */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1">
            <RoomSearch
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search rooms by name or code..."
            />
          </div>

          <div className="flex gap-2 sm:flex-shrink-0">
            <Button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              Create Room
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowJoinModal(true)}
              className="flex items-center gap-2"
            >
              <LogIn className="h-4 w-4" aria-hidden="true" />
              Join Room
            </Button>
          </div>
        </div>

        {/* Results count */}
        <p className="text-sm text-muted-foreground">
          {filteredRooms.length === 0
            ? "No rooms found"
            : `${filteredRooms.length} room${filteredRooms.length !== 1 ? "s" : ""}`}
        </p>
      </div>

      {/* Grid or Empty State */}
      <RoomGrid
        rooms={filteredRooms}
        onRoomClick={(room) => {
          console.log("[v0] Selected room:", room)
          // TODO: Navigate to room detail page in Phase 2
        }}
        memberCounts={memberCounts}
        isEmpty={filteredRooms.length === 0 && rooms.length === 0}
      />

      {/* Modals */}
      <CreateRoomModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateRoom}
        isLoading={isCreating}
      />

      <JoinRoomModal
        open={showJoinModal}
        onClose={() => setShowJoinModal(false)}
        onSubmit={handleJoinRoom}
        isLoading={isJoining}
      />

      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  )
}
