import { useMemo } from 'react'
import StatsBar, { ProgressRing } from '../components/StatsBar.jsx'
import { BarChart, StackBar } from '../components/Charts.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { useTaskStore } from '../context/TaskContext.jsx'
import { getStats, groupByCategory, groupByPriority } from '../utils/taskUtils.js'
import { lastNDays, parseISO } from '../utils/dateUtils.js'

const PRIORITY_COLORS = { High: 'var(--high)', Medium: 'var(--medium)', Low: 'var(--low)' }
const CATEGORY_COLORS = ['#4f46e5', '#0ea5e9', '#059669', '#d97706', '#db2777']

export default function Analytics() {
  const { tasks } = useTaskStore()
  const stats = getStats(tasks)

  const byCategory = useMemo(() => groupByCategory(tasks), [tasks])
  const byPriority = useMemo(
    () => groupByPriority(tasks).map((item) => ({ ...item, color: PRIORITY_COLORS[item.priority] })),
    [tasks],
  )

  const last30 = useMemo(() => {
    const days = lastNDays(30)
    const completedByDay = new Map()

    tasks.forEach((task) => {
      if (!task.completedAt) return
      const day = new Date(task.completedAt)
      const key = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, '0')}-${String(
        day.getDate(),
      ).padStart(2, '0')}`
      completedByDay.set(key, (completedByDay.get(key) || 0) + 1)
    })

    return days.map((day) => {
      const date = parseISO(day)
      return {
        label: String(date.getDate()),
        value: completedByDay.get(day) || 0,
        title: day,
      }
    })
  }, [tasks])

  const subtaskTotals = useMemo(() => {
    let total = 0
    let done = 0
    tasks.forEach((task) => {
      total += task.subtasks.length
      done += task.subtasks.filter((subtask) => subtask.completed).length
    })
    return { total, done, percent: total ? Math.round((done / total) * 100) : 0 }
  }, [tasks])

  const busiest = useMemo(() => {
    const counts = new Map()
    tasks.forEach((task) => {
      if (!task.dueDate) return
      counts.set(task.dueDate, (counts.get(task.dueDate) || 0) + 1)
    })
    return [...counts.entries()].sort((a, b) => b[1] - a[1])[0] || null
  }, [tasks])

  if (!tasks.length) {
    return (
      <section>
        <h1>Analytics</h1>
        <p className="muted">Add a few tasks and the charts will fill in.</p>
        <EmptyState title="No data yet" message="Create tasks to unlock insights." />
      </section>
    )
  }

  return (
    <section>
      <h1>Analytics</h1>
      <p className="muted">Where your time is going and what is piling up.</p>

      <StatsBar tasks={tasks} />

      <div className="panel-grid">
        <div className="panel">
          <h3>Completion rate</h3>
          <div className="ring-wrap">
            <ProgressRing percent={stats.progress} size={140} />
            <p className="muted">
              {stats.completed} of {stats.total} tasks done
            </p>
          </div>
        </div>

        <div className="panel">
          <h3>By priority</h3>
          <StackBar segments={byPriority} />
        </div>

        <div className="panel">
          <h3>By category</h3>
          <StackBar
            segments={byCategory.map((group, index) => ({
              label: group.category,
              value: group.total,
              color: CATEGORY_COLORS[index % CATEGORY_COLORS.length],
            }))}
          />
        </div>

        <div className="panel">
          <h3>Subtask progress</h3>
          <div className="ring-wrap">
            <ProgressRing percent={subtaskTotals.percent} size={140} />
            <p className="muted">
              {subtaskTotals.done} of {subtaskTotals.total} subtasks done
            </p>
          </div>
        </div>
      </div>

      <div className="panel">
        <h3>Tasks completed in the last 30 days</h3>
        <BarChart data={last30} />
      </div>

      <div className="panel-grid">
        <div className="panel">
          <h3>Category completion</h3>
          <ul className="metric-list">
            {byCategory.map((group) => (
              <li key={group.category}>
                <span>{group.category}</span>
                <div className="progress-track thin">
                  <div className="progress-fill" style={{ width: `${group.percent}%` }} />
                </div>
                <strong>
                  {group.completed}/{group.total}
                </strong>
              </li>
            ))}
          </ul>
        </div>

        <div className="panel">
          <h3>Highlights</h3>
          <ul className="metric-list">
            <li>
              <span>Overdue tasks</span>
              <strong className={stats.overdue ? 'danger-text' : ''}>{stats.overdue}</strong>
            </li>
            <li>
              <span>Due today</span>
              <strong>{stats.dueToday}</strong>
            </li>
            <li>
              <span>Busiest due date</span>
              <strong>{busiest ? `${busiest[0]} (${busiest[1]})` : 'None'}</strong>
            </li>
            <li>
              <span>Recurring tasks</span>
              <strong>{tasks.filter((task) => task.recurrence).length}</strong>
            </li>
          </ul>
        </div>
      </div>
    </section>
  )
}
