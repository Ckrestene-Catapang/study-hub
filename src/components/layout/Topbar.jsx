import { useNavigate } from "react-router-dom"
import { Bell, LogOut, Menu, Search, Settings, User } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Avatar } from "@/components/ui/Avatar"
import { Dropdown, DropdownItem, DropdownSeparator } from "@/components/ui/Dropdown"
import { ThemeToggle } from "@/components/shared/ThemeToggle"
import { ROUTES } from "@/constants/routes"

/**
 * Top application bar: mobile nav trigger, global search, theme toggle,
 * notifications, and the user menu.
 */
export function Topbar({ onOpenSidebar, user }) {
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-md lg:px-6">
      <Button
        variant="ghost"
        size="icon"
        onClick={onOpenSidebar}
        aria-label="Open navigation"
        className="lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </Button>

      <div className="hidden max-w-md flex-1 sm:block">
        <Input
          placeholder="Search subjects, notes, flashcards…"
          aria-label="Search"
          leftIcon={<Search className="h-4 w-4" />}
          className="bg-secondary"
        />
      </div>

      <div className="flex flex-1 items-center justify-end gap-1.5">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Search"
          className="sm:hidden"
        >
          <Search className="h-5 w-5" />
        </Button>

        <ThemeToggle />

        <Button variant="ghost" size="icon" aria-label="Notifications" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary" />
        </Button>

        <Dropdown
          trigger={
            <button
              className="ml-1 flex items-center gap-2 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Open user menu"
            >
              <Avatar name={user?.name} src={user?.avatar} size="sm" />
            </button>
          }
        >
          <div className="px-3 py-2">
            <p className="text-sm font-semibold text-foreground">{user?.name}</p>
            <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
          </div>
          <DropdownSeparator />
          <DropdownItem
            icon={<User className="h-4 w-4" />}
            onClick={() => navigate(ROUTES.PROFILE)}
          >
            Profile
          </DropdownItem>
          <DropdownItem
            icon={<Settings className="h-4 w-4" />}
            onClick={() => navigate(ROUTES.SETTINGS)}
          >
            Settings
          </DropdownItem>
          <DropdownSeparator />
          <DropdownItem
            icon={<LogOut className="h-4 w-4" />}
            className="text-destructive hover:bg-destructive/10"
            onClick={() => navigate(ROUTES.LOGIN)}
          >
            Log out
          </DropdownItem>
        </Dropdown>
      </div>
    </header>
  )
}
