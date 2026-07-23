import { Avatar } from "../ui/Avatar"
import { Badge } from "../ui/Badge"
import { X } from "lucide-react"

/**
 * RoomMembers - Display list of room members
 */
export function RoomMembers({ members, onRemoveMember, isOwner, currentUserId }) {
  if (!members || members.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-sm text-muted-foreground">No members in this room yet</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {members.map((member) => {
        const isCurrentUser = member.user_id === currentUserId
        const canRemove = isOwner && !isCurrentUser && member.role !== "owner"

        return (
          <div
            key={member.id}
            className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <Avatar name={member.name} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {member.name}
                  {isCurrentUser && <span className="text-muted-foreground"> (You)</span>}
                </p>
                <p className="text-xs text-muted-foreground truncate">{member.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 ml-4 flex-shrink-0">
              <Badge
                variant={member.role === "owner" ? "primary" : "secondary"}
                className="capitalize"
              >
                {member.role}
              </Badge>
              {canRemove && (
                <button
                  onClick={() => onRemoveMember?.(member.user_id)}
                  className="p-1 hover:bg-red-500/10 rounded transition-colors"
                  title={`Remove ${member.name}`}
                  aria-label={`Remove ${member.name}`}
                >
                  <X className="h-4 w-4 text-red-500" aria-hidden="true" />
                </button>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
