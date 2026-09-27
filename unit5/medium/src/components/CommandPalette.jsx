import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Modal from './Modal.jsx'
import { useTaskStore } from '../context/TaskContext.jsx'
import { useTheme } from '../context/ThemeContext.jsx'
import { useUi } from '../context/UiContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { serializeTasks, downloadJSON } from '../utils/storage.js'

function score(command, term) {
  const haystack = `${command.label} ${command.group}`.toLowerCase()
  if (!term) return 1
  if (haystack.includes(term)) return 100 - haystack.indexOf(term)
  let index = 0
  for (const char of term) {
    index = haystack.indexOf(char, index)
    if (index === -1) return 0
    index += 1
  }
  return 1
}

export default function CommandPalette() {
  const navigate = useNavigate()
  const { tasks, loadSample, clearCompleted, removeAll, setSortMode, undo, redo } = useTaskStore()
  const { toggleTheme } = useTheme()
  const { paletteOpen, closePalette, confirm } = useUi()
  const { success } = useToast()
  const [term, setTerm] = useState('')
  const [cursor, setCursor] = useState(0)

  const commands = useMemo(
    () => [
      { group: 'Navigate', label: 'Go to dashboard', run: () => navigate('/') },
      { group: 'Navigate', label: 'Go to tasks', run: () => navigate('/tasks') },
      { group: 'Navigate', label: 'Go to calendar', run: () => navigate('/calendar') },
      { group: 'Navigate', label: 'Go to analytics', run: () => navigate('/analytics') },
      { group: 'Navigate', label: 'Go to completed tasks', run: () => navigate('/completed') },
      { group: 'Navigate', label: 'Go to settings', run: () => navigate('/settings') },
      { group: 'Create', label: 'Create a new task', hint: 'n', run: () => navigate('/tasks/new') },
      ...tasks.slice(0, 8).map((task) => ({
        group: 'Tasks',
        label: task.title,
        hint: task.category,
        run: () => navigate(`/tasks/${task.id}/edit`),
      })),
      {
        group: 'Actions',
        label: 'Toggle dark mode',
        hint: 't',
        run: () => {
          toggleTheme()
          success('Theme toggled.')
        },
      },
      { group: 'Actions', label: 'Sort tasks by due date', run: () => setSortMode('due') },
      { group: 'Actions', label: 'Sort tasks by priority', run: () => setSortMode('priority') },
      { group: 'Actions', label: 'Sort tasks manually', run: () => setSortMode('manual') },
      { group: 'Actions', label: 'Undo last change', hint: 'Ctrl+Z', run: undo },
      { group: 'Actions', label: 'Redo', hint: 'Ctrl+Shift+Z', run: redo },
      {
        group: 'Data',
        label: 'Export tasks as JSON',
        run: () => {
          downloadJSON('todo-backup.json', serializeTasks(tasks))
          success('Backup downloaded.')
        },
      },
      { group: 'Data', label: 'Load sample tasks', run: () => (loadSample(), success('Sample data loaded.')) },
      {
        group: 'Data',
        label: 'Clear completed tasks',
        run: async () => {
          const ok = await confirm({
            title: 'Clear completed',
            message: 'All completed tasks will be removed.',
            confirmLabel: 'Clear',
          })
          if (ok) {
            clearCompleted()
            success('Completed tasks cleared.')
          }
        },
      },
      {
        group: 'Data',
        label: 'Delete every task',
        run: async () => {
          const ok = await confirm({
            title: 'Delete all tasks',
            message: 'This wipes the whole list. You can undo it afterwards.',
            confirmLabel: 'Delete everything',
          })
          if (ok) {
            removeAll()
            success('All tasks deleted. Ctrl+Z restores them.')
          }
        },
      },
    ],
    [navigate, tasks, toggleTheme, setSortMode, undo, redo, loadSample, success, clearCompleted, removeAll, confirm],
  )

  const results = useMemo(() => {
    const clean = term.trim().toLowerCase()
    return commands
      .map((command) => ({ command, rank: score(command, clean) }))
      .filter((entry) => entry.rank > 0)
      .sort((a, b) => b.rank - a.rank)
      .slice(0, 40)
      .map((entry) => entry.command)
  }, [commands, term])

  useEffect(() => {
    if (paletteOpen) {
      setTerm('')
      setCursor(0)
    }
  }, [paletteOpen])

  useEffect(() => {
    setCursor(0)
  }, [term])

  function run(command) {
    closePalette()
    command.run()
  }

  function onKeyDown(event) {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setCursor((prev) => Math.min(prev + 1, results.length - 1))
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault()
      setCursor((prev) => Math.max(prev - 1, 0))
    }
    if (event.key === 'Enter' && results[cursor]) {
      event.preventDefault()
      run(results[cursor])
    }
  }

  return (
    <Modal open={paletteOpen} title="Command palette" onClose={closePalette} wide>
      <div className="palette">
        <input
          className="palette-input"
          type="text"
          value={term}
          placeholder="Type a command or task name"
          onChange={(event) => setTerm(event.target.value)}
          onKeyDown={onKeyDown}
          autoFocus
        />

        <ul className="palette-list">
          {results.map((command, index) => (
            <li key={`${command.group}-${command.label}`}>
              <button
                type="button"
                className={index === cursor ? 'palette-item active' : 'palette-item'}
                onMouseEnter={() => setCursor(index)}
                onClick={() => run(command)}
              >
                <span className="palette-group">{command.group}</span>
                <span className="palette-label">{command.label}</span>
                {command.hint && <span className="chip">{command.hint}</span>}
              </button>
            </li>
          ))}
          {results.length === 0 && <li className="muted palette-empty">No matching commands.</li>}
        </ul>
      </div>
    </Modal>
  )
}
