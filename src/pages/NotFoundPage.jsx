import { Link } from "react-router-dom"
import { Button } from "../components/ui"
import { ROUTES } from "../constants/routes"

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
      <p className="text-7xl font-extrabold text-primary">404</p>
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">Page not found</h1>
        <p className="max-w-md text-muted-foreground">
          The page you are looking for doesn&apos;t exist or has been moved.
        </p>
      </div>
      <Button as={Link} to={ROUTES.HOME}>
        Back to home
      </Button>
    </div>
  )
}
