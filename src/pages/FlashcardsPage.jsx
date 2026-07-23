import { Brain } from "lucide-react"
import { PagePlaceholder } from "../components/shared/PagePlaceholder"

export default function FlashcardsPage() {
  return (
    <PagePlaceholder
      icon={Brain}
      title="Flashcards"
      description="Study with spaced-repetition flashcard decks. Interactive review lands in the next phase."
    />
  )
}
