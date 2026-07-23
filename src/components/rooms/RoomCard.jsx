import { Card, CardBody } from "../ui/Card"
import { motion } from "framer-motion"
import { Users, Copy, Check } from "lucide-react"
import { useState } from "react"
import { cn } from "@/utils/cn"

/**
 * RoomCard - Individual room display card
 */
export function RoomCard({ room, index, onClick, memberCount = 0, className }) {
  const [copied, setCopied] = useState(false)

  const handleCopyCode = (e) => {
    e.stopPropagation()
    navigator.clipboard.writeText(room.code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={cn("h-full", className)}
    >
      <Card
        hover
        className="flex h-full flex-col gap-4 cursor-pointer"
        onClick={onClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            onClick?.()
          }
        }}
      >
        <CardBody className="flex flex-col gap-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-sm">{room.name}</h3>
              <p className="text-xs text-muted-foreground mt-1">
                {room.description || "No description"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-border">
            <Users className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            <span className="text-xs text-muted-foreground">
              {memberCount} {memberCount === 1 ? "member" : "members"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <code className="text-xs bg-muted px-2 py-1 rounded font-mono flex-1 text-center">
              {room.code}
            </code>
            <button
              onClick={handleCopyCode}
              className="p-2 hover:bg-muted rounded transition-colors"
              title="Copy invite code"
              aria-label="Copy invite code"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-500" aria-hidden="true" />
              ) : (
                <Copy className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              )}
            </button>
          </div>
        </CardBody>
      </Card>
    </motion.div>
  )
}
