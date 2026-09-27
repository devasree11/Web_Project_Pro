import { normalizeTask } from './taskUtils.js'
import { addDays, todayISO } from './dateUtils.js'

export const STORAGE_KEYS = {
  tasks: 'todo_advanced_tasks',
  theme: 'todo_advanced_theme',
  sort: 'todo_advanced_sort',
  legacy: 'todo_medium_tasks',
}

export function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

export function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* storage full or unavailable */
  }
}

export function migrateLegacy() {
  const legacy = readJSON(STORAGE_KEYS.legacy, null)
  if (!Array.isArray(legacy) || legacy.length === 0) return null

  const migrated = legacy.map((task, index) =>
    normalizeTask({ ...task, order: index, createdAt: Date.now() - index * 1000 }),
  )
  writeJSON(STORAGE_KEYS.tasks, migrated)
  localStorage.removeItem(STORAGE_KEYS.legacy)
  return migrated
}

export function buildSampleTasks() {
  const today = todayISO()

  return [
    {
      title: 'Ship the advanced to-do app',
      description: 'Replace the medium version with the full feature set.',
      notes: 'Check subtasks, drag and drop, calendar and analytics before submitting.',
      priority: 'High',
      category: 'Work',
      tags: ['unit5', 'react'],
      dueDate: today,
      subtasks: [
        { title: 'State layer with undo', completed: true },
        { title: 'Calendar and analytics pages', completed: false },
        { title: 'Keyboard shortcuts', completed: false },
      ],
    },
    {
      title: 'Review React 19 release notes',
      description: 'Focus on the useOptimistic and action patterns.',
      priority: 'Medium',
      category: 'Study',
      tags: ['react'],
      dueDate: addDays(today, 2),
      subtasks: [],
    },
    {
      title: 'Book gym session',
      priority: 'Low',
      category: 'Personal',
      tags: ['health'],
      dueDate: addDays(today, 1),
      recurrence: 'weekly',
      subtasks: [],
    },
    {
      title: 'Write unit 5 report notes',
      description: 'Summarise what changed between minimal, medium and advanced.',
      priority: 'Medium',
      category: 'Study',
      tags: ['unit5', 'docs'],
      dueDate: addDays(today, -1),
      subtasks: [
        { title: 'Feature comparison table', completed: true },
        { title: 'Screenshots', completed: true },
      ],
    },
  ].map((task, index) => normalizeTask({ ...task, order: index, createdAt: Date.now() - index * 1000 }))
}

export function serializeTasks(tasks) {
  return JSON.stringify({ version: 1, exportedAt: new Date().toISOString(), tasks }, null, 2)
}

export function parseBackup(raw) {
  const parsed = JSON.parse(raw)
  const list = Array.isArray(parsed) ? parsed : parsed.tasks

  if (!Array.isArray(list)) throw new Error('Backup file has no task list.')

  return list.map((task, index) =>
    normalizeTask({ ...task, order: Number.isFinite(task.order) ? task.order : index }),
  )
}

export function downloadJSON(filename, data) {
  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
