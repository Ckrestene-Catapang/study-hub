import { PageHeader } from "../components/shared/PageHeader"
import { Card, CardBody } from "../components/ui/Card"
import { useAuth } from "../context/AuthContext"
import { BookOpen, Layers, Brain, TrendingUp } from "lucide-react"

const stats = [
  { label: "Subjects", value: "4", icon: BookOpen },
  { label: "Notes", value: "23", icon: Layers },
  { label: "Flashcards", value: "142", icon: Brain },
  { label: "Avg. score", value: "86%", icon: TrendingUp },
]

export default function DashboardPage() {
  const { user } = useAuth()

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title={`Welcome back${user?.name ? `, ${user.name.split(" ")[0]}` : ""}`}
        subtitle="Here's an overview of your learning. Feature modules land in the next phases."
      />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon }) => (
          <Card key={label}>
            <CardBody className="flex flex-col gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <p className="text-2xl font-bold">{value}</p>
                <p className="text-sm text-muted-foreground">{label}</p>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  )
}
