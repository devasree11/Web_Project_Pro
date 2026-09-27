import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'

const ToastContext = createContext(null)

let nextId = 1

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const timers = useRef(new Map())

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
    const timer = timers.current.get(id)
    if (timer) {
      clearTimeout(timer)
      timers.current.delete(id)
    }
  }, [])

  const push = useCallback(
    (message, tone = 'info') => {
      if (!message) return
      const id = nextId
      nextId += 1
      setToasts((prev) => [...prev.slice(-3), { id, message, tone }])
      const timer = setTimeout(() => dismiss(id), 3200)
      timers.current.set(id, timer)
    },
    [dismiss],
  )

  const value = useMemo(
    () => ({
      toasts,
      dismiss,
      notify: push,
      success: (message) => push(message, 'success'),
      error: (message) => push(message, 'error'),
    }),
    [toasts, dismiss, push],
  )

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
}

export function useToast() {
  const store = useContext(ToastContext)
  if (!store) throw new Error('useToast must be used inside ToastProvider')
  return store
}
