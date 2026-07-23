import { createContext, useCallback, useContext, useState } from "react"
import { createPortal } from "react-dom"
import { AnimatePresence, motion } from "framer-motion"
import { CheckCircle2, Info, TriangleAlert, X, XCircle } from "lucide-react"
import { cn } from "@/utils/cn"

const ToastContext = createContext({ toast: () => {} })

const icons = {
  success: CheckCircle2,
  error: XCircle,
  warning: TriangleAlert,
  info: Info,
}

const accents = {
  success: "text-success",
  error: "text-destructive",
  warning: "text-warning",
  info: "text-primary",
}

/**
 * Global toast provider. Wrap the app once, then call useToast().toast(...).
 */
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const toast = useCallback(
    ({ title, description, variant = "info", duration = 3500 }) => {
      const id = crypto.randomUUID()
      setToasts((prev) => [...prev, { id, title, description, variant }])
      if (duration) setTimeout(() => remove(id), duration)
      return id
    },
    [remove],
  )

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {createPortal(
        <div className="pointer-events-none fixed bottom-4 right-4 z-[60] flex w-full max-w-sm flex-col gap-2">
          <AnimatePresence>
            {toasts.map((t) => {
              const Icon = icons[t.variant]
              return (
                <motion.div
                  key={t.id}
                  layout
                  initial={{ opacity: 0, x: 40, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 40, scale: 0.95 }}
                  className="pointer-events-auto flex items-start gap-3 rounded-xl border border-border bg-card p-4 shadow-lg"
                  role="status"
                >
                  <Icon className={cn("mt-0.5 h-5 w-5 shrink-0", accents[t.variant])} />
                  <div className="flex-1">
                    {t.title && (
                      <p className="text-sm font-semibold text-card-foreground">
                        {t.title}
                      </p>
                    )}
                    {t.description && (
                      <p className="text-sm text-muted-foreground">{t.description}</p>
                    )}
                  </div>
                  <button
                    onClick={() => remove(t.id)}
                    aria-label="Dismiss notification"
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>,
        document.body,
      )}
    </ToastContext.Provider>
  )
}

export function useToast() {
  return useContext(ToastContext)
}
