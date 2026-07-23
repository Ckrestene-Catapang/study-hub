import { Card, CardBody } from "../ui/Card"
import { motion } from "framer-motion"
import * as Icons from "lucide-react"
import { cn } from "@/utils/cn"

/**
 * SubjectCard - Individual subject display card with stats and visual indicators
 */
export function SubjectCard({ subject, index, onClick, className }) {
  const Icon = subject.icon ? Icons[subject.icon] : null

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
            <div
              className="flex h-10 w-10 items-center justify-center rounded-lg"
              style={{ backgroundColor: `${subject.color}15` }}
            >
              {Icon && (
                <Icon
                  className="h-5 w-5"
                  style={{ color: subject.color }}
                  aria-hidden="true"
                />
              )}
            </div>
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary/10 text-primary">
              {subject.progress}%
            </span>
          </div>

          <div>
            <h3 className="font-semibold text-sm">{subject.name}</h3>
            <p className="text-xs text-muted-foreground mt-1">
              {subject.description}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border">
            <div className="flex flex-col gap-1">
              <p className="text-xs text-muted-foreground">Notes</p>
              <p className="text-sm font-semibold">{subject.notesCount}</p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-xs text-muted-foreground">Cards</p>
              <p className="text-sm font-semibold">{subject.flashcardsCount}</p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-xs text-muted-foreground">Quizzes</p>
              <p className="text-sm font-semibold">{subject.quizzesTaken}</p>
            </div>
          </div>
        </CardBody>
      </Card>
    </motion.div>
  )
}
