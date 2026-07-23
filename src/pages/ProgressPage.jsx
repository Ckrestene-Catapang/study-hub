import { TrendingUp } from "lucide-react"
import { PagePlaceholder } from "../components/shared/PagePlaceholder"

export default function ProgressPage() {
  return (
    <PagePlaceholder
      icon={TrendingUp}
      title="Progress"
      description="Visualize study streaks, mastery, and performance trends with charts in the next phase."
    />
  )
}
