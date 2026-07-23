import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { AuthLayout } from "../components/layout/AuthLayout"
import { Button, Input } from "../components/ui"
import { useToast } from "../components/ui/Toast"
import { useAuth } from "../context/AuthContext"
import { ROUTES } from "../constants/routes"

export default function RegisterPage() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const { toast } = useToast()
  const [values, setValues] = useState({ name: "", email: "", password: "" })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  function validate() {
    const next = {}
    if (!values.name.trim()) next.name = "Name is required"
    if (!values.email) next.email = "Email is required"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) next.email = "Enter a valid email"
    if (!values.password) next.password = "Password is required"
    else if (values.password.length < 6) next.password = "Password must be at least 6 characters"
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      await register(values)
      toast({ title: "Account created!", variant: "success" })
      navigate(ROUTES.DASHBOARD)
    } catch (err) {
      toast({ title: "Sign up failed", description: err.message, variant: "error" })
    } finally {
      setLoading(false)
    }
  }

  function handleChange(e) {
    const { name, value } = e.target
    setValues((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <AuthLayout title="Create your account" subtitle="Start learning smarter with StudyHub today.">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        <Input
          label="Full name"
          name="name"
          autoComplete="name"
          placeholder="Ada Lovelace"
          value={values.name}
          onChange={handleChange}
          error={errors.name}
        />
        <Input
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={values.email}
          onChange={handleChange}
          error={errors.email}
        />
        <Input
          label="Password"
          name="password"
          type="password"
          autoComplete="new-password"
          placeholder="Create a password"
          value={values.password}
          onChange={handleChange}
          error={errors.password}
          hint="At least 6 characters."
        />
        <Button type="submit" size="lg" loading={loading} className="mt-2 w-full">
          Create account
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        {"Already have an account? "}
        <Link to={ROUTES.LOGIN} className="font-medium text-primary hover:underline">
          Log in
        </Link>
      </p>
    </AuthLayout>
  )
}
