import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { ArrowRight, Layers, LineChart, Sparkles } from "lucide-react"
import { Logo } from "@/components/shared/Logo"
import { ThemeToggle } from "@/components/shared/ThemeToggle"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { ROUTES } from "@/constants/routes"

const FEATURES = [
  {
    icon: Sparkles,
    title: "AI Tutor",
    description: "Ask questions and get clear, instant explanations tailored to you.",
  },
  {
    icon: Layers,
    title: "Smart Flashcards",
    description: "Spaced-repetition decks that adapt to what you struggle with.",
  },
  {
    icon: LineChart,
    title: "Progress Insights",
    description: "Track streaks, mastery and study time across every subject.",
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Logo />
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button as={Link} to={ROUTES.LOGIN} variant="ghost">
            Log in
          </Button>
          <Button as={Link} to={ROUTES.REGISTER}>
            Get started
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6">
        <section className="flex flex-col items-center gap-6 py-20 text-center lg:py-28">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Badge variant="primary" className="gap-1.5">
              <Sparkles className="h-3.5 w-3.5" /> AI-powered studying
            </Badge>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="max-w-3xl text-4xl font-extrabold tracking-tight text-balance sm:text-6xl"
          >
            Learn smarter, not harder with StudyHub
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="max-w-xl text-lg text-muted-foreground text-pretty"
          >
            Organize your subjects, generate flashcards and quizzes, and get help
            from an AI tutor — all in one beautifully simple workspace.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="flex flex-col gap-3 sm:flex-row"
          >
            <Button as={Link} to={ROUTES.REGISTER} size="lg">
              Start studying free <ArrowRight className="h-4 w-4" />
            </Button>
            <Button as={Link} to={ROUTES.DASHBOARD} size="lg" variant="outline">
              View demo dashboard
            </Button>
          </motion.div>
        </section>

        <section className="grid gap-5 pb-24 sm:grid-cols-3">
          {FEATURES.map((feature, i) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                <Card hover className="h-full p-6">
                  <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mb-1 text-base font-semibold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground text-pretty">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            )
          })}
        </section>
      </main>
    </div>
  )
}
