import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTaskStore } from '../context/TaskContext.jsx'
import { useTheme } from '../context/ThemeContext.jsx'
import { useUi } from '../context/UiContext.jsx'

function isTyping(target) {
  if (!target) return false
  const tag = target.tagName
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || target.isContentEditable
}

export default function useHotkeys() {
  const navigate = useNavigate()
  const { undo, redo, clearCompleted } = useTaskStore()
  const { toggleTheme } = useTheme()
  const {
    paletteOpen,
    helpOpen,
    openPalette,
    closePalette,
    toggleHelp,
    focusSearch,
    pending,
  } = useUi()

  useEffect(() => {
    function onKeyDown(event) {
      const key = event.key
      const mod = event.ctrlKey || event.metaKey

      if (mod && key.toLowerCase() === 'k') {
        event.preventDefault()
        if (paletteOpen) closePalette()
        else openPalette()
        return
      }

      if (mod && key.toLowerCase() === 'z') {
        event.preventDefault()
        if (event.shiftKey) redo()
        else undo()
        return
      }

      if (key === 'Escape') {
        if (helpOpen) toggleHelp()
        if (paletteOpen) closePalette()
        return
      }

      if (mod || event.altKey || isTyping(event.target)) return
      if (pending) return

      switch (key) {
        case 'n':
          event.preventDefault()
          navigate('/tasks/new')
          break
        case '/':
          event.preventDefault()
          focusSearch()
          break
        case 't':
          toggleTheme()
          break
        case 'd':
          navigate('/')
          break
        case 'l':
          navigate('/tasks')
          break
        case 'c':
          navigate('/calendar')
          break
        case 'a':
          navigate('/analytics')
          break
        case 'x':
          clearCompleted()
          break
        case '?':
          event.preventDefault()
          toggleHelp()
          break
        default:
          break
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [
    navigate,
    undo,
    redo,
    clearCompleted,
    toggleTheme,
    paletteOpen,
    helpOpen,
    openPalette,
    closePalette,
    toggleHelp,
    focusSearch,
    pending,
  ])
}
