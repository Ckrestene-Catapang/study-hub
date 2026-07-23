import {
  LayoutDashboard,
  Users,
  BookOpen,
  NotebookPen,
  Layers,
  ListChecks,
  LineChart,
  Sparkles,
  Settings,
} from "lucide-react"
import { ROUTES } from "./routes"

// Primary sidebar navigation.
export const MAIN_NAV = [
  { label: "Dashboard", to: ROUTES.DASHBOARD, icon: LayoutDashboard, end: true },
  { label: "Rooms", to: ROUTES.ROOMS, icon: Users },
  { label: "Subjects", to: ROUTES.SUBJECTS, icon: BookOpen },
  { label: "Notes", to: ROUTES.NOTES, icon: NotebookPen },
  { label: "Flashcards", to: ROUTES.FLASHCARDS, icon: Layers },
  { label: "Quiz", to: ROUTES.QUIZ, icon: ListChecks },
  { label: "Progress", to: ROUTES.PROGRESS, icon: LineChart },
  { label: "AI Tutor", to: ROUTES.AI_TUTOR, icon: Sparkles, badge: "New" },
]

// Secondary navigation pinned to the bottom of the sidebar.
export const SECONDARY_NAV = [
  { label: "Settings", to: ROUTES.SETTINGS, icon: Settings },
]
