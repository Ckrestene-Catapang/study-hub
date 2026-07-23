import { lazy, Suspense } from "react"
import { Navigate, Route, Routes } from "react-router-dom"
import { DashboardLayout } from "./components/layout/DashboardLayout"
import { ProtectedRoute } from "./components/shared/ProtectedRoute"
import { Loading } from "./components/ui/Loading"
import { ROUTES } from "./constants/routes"

const LandingPage = lazy(() => import("./pages/LandingPage"))
const LoginPage = lazy(() => import("./pages/LoginPage"))
const RegisterPage = lazy(() => import("./pages/RegisterPage"))
const DashboardPage = lazy(() => import("./pages/DashboardPage"))
const RoomsPage = lazy(() => import("./pages/RoomsPage"))
const SubjectsPage = lazy(() => import("./pages/SubjectsPage"))
const NotesPage = lazy(() => import("./pages/NotesPage"))
const FlashcardsPage = lazy(() => import("./pages/FlashcardsPage"))
const QuizzesPage = lazy(() => import("./pages/QuizzesPage"))
const ProgressPage = lazy(() => import("./pages/ProgressPage"))
const TutorPage = lazy(() => import("./pages/TutorPage"))
const SettingsPage = lazy(() => import("./pages/SettingsPage"))
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"))

function PageFallback() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Loading label="Loading" />
    </div>
  )
}

// Wraps the authenticated app shell so every protected page shares one layout.
function ProtectedShell() {
  return (
    <ProtectedRoute>
      <DashboardLayout />
    </ProtectedRoute>
  )
}

export function AppRouter() {
  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        <Route path={ROUTES.LANDING} element={<LandingPage />} />
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.REGISTER} element={<RegisterPage />} />

        <Route element={<ProtectedShell />}>
          <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
          <Route path={ROUTES.ROOMS} element={<RoomsPage />} />
          <Route path={ROUTES.SUBJECTS} element={<SubjectsPage />} />
          <Route path={ROUTES.NOTES} element={<NotesPage />} />
          <Route path={ROUTES.FLASHCARDS} element={<FlashcardsPage />} />
          <Route path={ROUTES.QUIZ} element={<QuizzesPage />} />
          <Route path={ROUTES.PROGRESS} element={<ProgressPage />} />
          <Route path={ROUTES.AI_TUTOR} element={<TutorPage />} />
          <Route path={ROUTES.SETTINGS} element={<SettingsPage />} />
        </Route>

        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </Suspense>
  )
}
