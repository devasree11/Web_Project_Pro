export function pad(value) {
  return String(value).padStart(2, '0')
}

export function toISO(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

export function todayISO() {
  return toISO(new Date())
}

export function parseISO(value) {
  if (!value) return null
  const [year, month, day] = value.split('-').map(Number)
  if (!year || !month || !day) return null
  return new Date(year, month - 1, day)
}

export function addDays(value, amount) {
  const date = typeof value === 'string' ? parseISO(value) : new Date(value)
  if (!date) return null
  date.setDate(date.getDate() + amount)
  return toISO(date)
}

export function startOfWeek(value) {
  const date = typeof value === 'string' ? parseISO(value) : new Date(value)
  if (!date) return null
  const day = date.getDay()
  const diff = day === 0 ? -6 : 1 - day
  date.setDate(date.getDate() + diff)
  date.setHours(0, 0, 0, 0)
  return date
}

export function isSameDay(a, b) {
  const left = typeof a === 'string' ? parseISO(a) : a
  const right = typeof b === 'string' ? parseISO(b) : b
  if (!left || !right) return false
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  )
}

export function daysUntil(value) {
  const target = parseISO(value)
  if (!target) return null
  const today = parseISO(todayISO())
  return Math.round((target - today) / 86400000)
}

export function formatDate(value) {
  const date = parseISO(value)
  if (!date) return ''
  return date.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })
}

export function formatMonth(value) {
  const date = typeof value === 'string' ? parseISO(value) : value
  if (!date) return ''
  return date.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })
}

export function relativeDue(value) {
  const diff = daysUntil(value)
  if (diff === null) return ''
  if (diff === 0) return 'Due today'
  if (diff === 1) return 'Due tomorrow'
  if (diff === -1) return '1 day overdue'
  if (diff < 0) return `${Math.abs(diff)} days overdue`
  return `Due in ${diff} days`
}

export function monthMatrix(anchor) {
  const first = new Date(anchor.getFullYear(), anchor.getMonth(), 1)
  const start = startOfWeek(first)
  const weeks = []

  for (let week = 0; week < 6; week += 1) {
    const days = []
    for (let day = 0; day < 7; day += 1) {
      const current = new Date(start)
      current.setDate(start.getDate() + week * 7 + day)
      days.push(current)
    }
    weeks.push(days)
  }

  return weeks
}

export function lastNDays(n) {
  const days = []
  for (let offset = n - 1; offset >= 0; offset -= 1) {
    days.push(addDays(todayISO(), -offset))
  }
  return days
}
