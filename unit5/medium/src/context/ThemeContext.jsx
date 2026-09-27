import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { STORAGE_KEYS, readJSON, writeJSON } from '../utils/storage.js'

const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => readJSON(STORAGE_KEYS.theme, 'light'))

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    writeJSON(STORAGE_KEYS.theme, theme)
  }, [theme])

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      toggleTheme: () => setTheme((prev) => (prev === 'light' ? 'dark' : 'light')),
    }),
    [theme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const store = useContext(ThemeContext)
  if (!store) throw new Error('useTheme must be used inside ThemeProvider')
  return store
}
