import { NavLink } from "react-router-dom"
import { motion } from "framer-motion"
import { PanelLeftClose, PanelLeftOpen } from "lucide-react"
import { cn } from "@/utils/cn"
import { Logo } from "@/components/shared/Logo"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { MAIN_NAV, SECONDARY_NAV } from "@/constants/navigation"

function NavItem({ item, collapsed }) {
  const Icon = item.icon
  return (
    <NavLink
      to={item.to}
      end={item.end}
      title={collapsed ? item.label : undefined}
      className={({ isActive }) =>
        cn(
          "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
          collapsed && "justify-center px-0",
          isActive
            ? "bg-accent text-accent-foreground"
            : "text-muted-foreground hover:bg-secondary hover:text-foreground",
        )
      }
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <motion.span
              layoutId="sidebar-active"
              className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-primary"
            />
          )}
          <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
          {!collapsed && <span className="flex-1">{item.label}</span>}
          {!collapsed && item.badge && (
            <Badge variant="primary" className="text-[10px]">
              {item.badge}
            </Badge>
          )}
        </>
      )}
    </NavLink>
  )
}

/**
 * Application sidebar. Supports a collapsed (icon-only) state on desktop.
 */
export function Sidebar({ collapsed, onToggleCollapse, onNavigate }) {
  return (
    <aside
      className={cn(
        "flex h-full flex-col border-r border-sidebar-border bg-sidebar transition-[width] duration-300",
        collapsed ? "w-20" : "w-64",
      )}
    >
      <div
        className={cn(
          "flex h-16 items-center px-4",
          collapsed ? "justify-center" : "justify-between",
        )}
      >
        <Logo collapsed={collapsed} />
        {!collapsed && onToggleCollapse && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
            aria-label="Collapse sidebar"
            className="hidden lg:inline-flex"
          >
            <PanelLeftClose className="h-5 w-5" />
          </Button>
        )}
      </div>

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-4" onClick={onNavigate}>
        {MAIN_NAV.map((item) => (
          <NavItem key={item.to} item={item} collapsed={collapsed} />
        ))}
      </nav>

      <div className="flex flex-col gap-1 border-t border-sidebar-border px-3 py-4" onClick={onNavigate}>
        {SECONDARY_NAV.map((item) => (
          <NavItem key={item.to} item={item} collapsed={collapsed} />
        ))}
        {collapsed && onToggleCollapse && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
            aria-label="Expand sidebar"
            className="mx-auto hidden lg:inline-flex"
          >
            <PanelLeftOpen className="h-5 w-5" />
          </Button>
        )}
      </div>
    </aside>
  )
}
