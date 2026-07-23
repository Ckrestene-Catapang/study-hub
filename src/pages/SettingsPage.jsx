import { Settings } from "lucide-react"
import { PagePlaceholder } from "../components/shared/PagePlaceholder"

export default function SettingsPage() {
  return (
    <PagePlaceholder
      icon={Settings}
      title="Settings"
      description="Manage your profile, appearance, and preferences here."
    />
  )
}
