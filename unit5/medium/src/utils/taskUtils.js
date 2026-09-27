import { addDays, daysUntil, parseISO, toISO, todayISO } from './dateUtils.js'

export const PRIORITIES = ['Low', 'Medium', 'High']
export const CATEGORIES = ['Work', 'Personal', 'Study', 'Other']
export const RECURRENCES = [
  { value: '', label: 'Never' },
  { value: 'daily', label: 'Every day' },
  { value: 'weekly', label: 'Every week' },
  { value: 'monthly', label: 'Every month' },
]

export const SORT_MODES = [
  { value: 'manual', label: 'Manual order' },
  { value: 'due', label: 'Due date' },
  { value: 'priority', label: 'Priority' },
  { value: 'alpha', label: 'A to Z' },
  { value: 'created', label: 'Newest first' },
]

export function createId() {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`
}

export function blankTask() {
  return {
    id: '',
    title: '',
    description: '',
    notes: '',
    priority: 'Medium',
    category: 'Other',
    tags: [],
    dueDate: todayISO(),
    completed: false,
    recurrence: '',
    subtasks: [],
    order: 0,
    createdAt: 0,
    updatedAt: 0,
    completedAt: 0,
  }
}

export function normalizeTask(input) {
  const base = blankTask()
  const next = { ...base, ...input }

  return {
    ...next,
    title: String(next.title || '').trim(),
    description: String(next.description || ''),
    notes: String(next.notes || ''),
    tags: Array.isArray(next.tags) ? next.tags.filter(Boolean) : [],
    subtasks: Array.isArray(next.subtasks)
      ? next.subtasks.map((subtask) => ({
          id: subtask.id || createId(),
          title: String(subtask.title || '').trim(),
          completed: Boolean(subtask.completed),
        }))
      : [],
  }
}

export function subtaskProgress(task) {
  const total = task.subtasks.length
  if (!total) return null
  const done = task.subtasks.filter((subtask) => subtask.completed).length
  return { total, done, percent: Math.round((done / total) * 100) }
}

export function isOverdue(task) {
  return !task.completed && Boolean(task.dueDate) && task.dueDate < todayISO()
}

export function nextDueDate(recurrence, from = todayISO()) {
  if (recurrence === 'daily') return addDays(from, 1)
  if (recurrence === 'weekly') return addDays(from, 7)
  if (recurrence === 'monthly') {
    const date = parseISO(from)
    if (!date) return null
    date.setMonth(date.getMonth() + 1)
    return toISO(date)
  }
  return null
}

export function filterTasks(tasks, filters = {}) {
  const { search = '', status = 'all', priority = 'all', category = 'all', tag = 'all' } = filters
  const term = search.trim().toLowerCase()

  return tasks.filter((task) => {
    const haystack = [task.title, task.description, task.notes, task.category, ...task.tags]
      .join(' ')
      .toLowerCase()

    const matchesSearch = !term || haystack.includes(term)
    const matchesStatus =
      status === 'all' ||
      (status === 'completed' && task.completed) ||
      (status === 'pending' && !task.completed) ||
      (status === 'overdue' && isOverdue(task))
    const matchesPriority = priority === 'all' || task.priority === priority
    const matchesCategory = category === 'all' || task.category === category
    const matchesTag = tag === 'all' || task.tags.includes(tag)

    return matchesSearch && matchesStatus && matchesPriority && matchesCategory && matchesTag
  })
}

const PRIORITY_RANK = { High: 0, Medium: 1, Low: 2 }

export function sortTasks(tasks, mode = 'manual') {
  const copy = [...tasks]

  if (mode === 'due') {
    copy.sort((a, b) => {
      if (!a.dueDate && !b.dueDate) return a.order - b.order
      if (!a.dueDate) return 1
      if (!b.dueDate) return -1
      if (a.dueDate === b.dueDate) return PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority]
      return a.dueDate < b.dueDate ? -1 : 1
    })
    return copy
  }

  if (mode === 'priority') {
    copy.sort(
      (a, b) =>
        PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority] ||
        Number(a.completed) - Number(b.completed) ||
        a.order - b.order,
    )
    return copy
  }

  if (mode === 'alpha') {
    copy.sort((a, b) => a.title.localeCompare(b.title))
    return copy
  }

  if (mode === 'created') {
    copy.sort((a, b) => b.createdAt - a.createdAt)
    return copy
  }

  copy.sort((a, b) => a.order - b.order)
  return copy
}

export function getStats(tasks) {
  const total = tasks.length
  const completed = tasks.filter((task) => task.completed).length
  const pending = total - completed
  const overdue = tasks.filter(isOverdue).length
  const dueToday = tasks.filter((task) => !task.completed && daysUntil(task.dueDate) === 0).length
  const progress = total ? Math.round((completed / total) * 100) : 0

  return { total, completed, pending, overdue, dueToday, progress }
}

export function groupByCategory(tasks) {
  return CATEGORIES.map((category) => {
    const items = tasks.filter((task) => task.category === category)
    const completed = items.filter((task) => task.completed).length
    return {
      category,
      total: items.length,
      completed,
      percent: items.length ? Math.round((completed / items.length) * 100) : 0,
    }
  }).filter((group) => group.total > 0)
}

export function groupByPriority(tasks) {
  return PRIORITIES.map((priority) => {
    const items = tasks.filter((task) => task.priority === priority)
    return { priority, total: items.length }
  }).filter((group) => group.total > 0)
}

export function collectTags(tasks) {
  const counts = new Map()
  tasks.forEach((task) => {
    task.tags.forEach((tag) => counts.set(tag, (counts.get(tag) || 0) + 1))
  })
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag))
}
