import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'

const UiContext = createContext(null)

export function UiProvider({ children }) {
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [helpOpen, setHelpOpen] = useState(false)
  const [pending, setPending] = useState(null)
  const [draggingId, setDraggingId] = useState(null)
  const resolver = useRef(null)
  const searchRef = useRef(null)

  const confirm = useCallback((options) => {
    setPending({
      title: options.title || 'Are you sure?',
      message: options.message || '',
      confirmLabel: options.confirmLabel || 'Confirm',
      tone: options.tone || 'danger',
    })
    return new Promise((resolve) => {
      resolver.current = resolve
    })
  }, [])

  const close = useCallback((result) => {
    setPending(null)
    if (resolver.current) {
      resolver.current(result)
      resolver.current = null
    }
  }, [])

  const value = useMemo(
    () => ({
      paletteOpen,
      setPaletteOpen,
      openPalette: () => setPaletteOpen(true),
      closePalette: () => setPaletteOpen(false),
      helpOpen,
      setHelpOpen,
      toggleHelp: () => setHelpOpen((prev) => !prev),
      searchRef,
      focusSearch: () => searchRef.current?.focus(),
      draggingId,
      setDraggingId,
      confirm,
      pending,
      resolveConfirm: close,
    }),
    [paletteOpen, helpOpen, confirm, draggingId, pending],
  )

  return <UiContext.Provider value={value}>{children}</UiContext.Provider>
}

export function useUi() {
  const store = useContext(UiContext)
  if (!store) throw new Error('useUi must be used inside UiProvider')
  return store
}
