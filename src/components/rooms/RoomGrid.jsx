import { RoomCard } from "./RoomCard"
import { AlertCircle } from "lucide-react"

/**
 * RoomGrid - Grid display for room cards
 */
export function RoomGrid({ rooms, onRoomClick, memberCounts = {}, isEmpty }) {
  if (isEmpty) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted mb-4">
          <AlertCircle className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No rooms yet</h3>
        <p className="text-sm text-muted-foreground">
          Create a room or join an existing one to get started.
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {rooms.map((room, index) => (
        <RoomCard
          key={room.id}
          room={room}
          index={index}
          onClick={() => onRoomClick?.(room)}
          memberCount={memberCounts[room.id] || 0}
        />
      ))}
    </div>
  )
}
