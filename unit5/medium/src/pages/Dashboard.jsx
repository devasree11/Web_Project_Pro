import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import StatsBar from '../components/StatsBar.jsx'
import TaskItem from '../components/TaskItem.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { useTaskStore } from '../context/TaskContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { isOverdue, sortTasks } from '../utils/taskUtils.js'
import { relativeDue, todayISO } from '../utils/dateUtils.js'

export default function Dashboard() {
  const { tasks, sortMode, addTask } = useTaskStore()
  const { notify } = useToast()
  const navigate = useNavigate()
  const [quick, setQuick] = useState('')

  function handleQuickAdd(event) {
    event.preventDefault()
    const result = addTask({ title: quick, dueDate: todayISO() })
    if (!result.ok) {
      notify(result.message, 'error')
      return
    }
    setQuick('')
    notify('Task added.', 'success')
  }

  const sections = useMemo(() => {
    const pending = sortTasks(tasks.filter((task) => !task.completed), sortMode)
    return {
      overdue: pending.filter(isOverdue).slice(0, 4),
      today: pending.filter((task) => !isOverdue(task) && relativeDue(task.dueDate) === 'Due today').slice(0, 4),
      upNext: pending.filter((task) => !isOverdue(task) && relativeDue(task.dueDate) !== 'Due today').slice(0, 5),
    }
  }, [tasks, sortMode])

  return (
    <section>
      <h1>Dashboard</h1>
      <p className="muted">Everything on your list, grouped by what needs attention first.</p>

      <form className="quick-add" onSubmit={handleQuickAdd}>
        <input
          type="text"
          value={quick}
          placeholder="Quick add: type a title and press Enter"
          onChange={(event) => setQuick(event.target.value)}
        />
        <button type="submit" className="button small">
          Add
        </button>
      </form>

      <StatsBar tasks={tasks} />

      {sections.overdue.length > 0 && (
        <Group
          title="Overdue"
          tone="danger"
          tasks={sections.overdue}
          to="/tasks?status=overdue"
        />
      )}

      {sections.today.length > 0 && (
        <Group title="Due today" tasks={sections.today} to="/tasks?status=pending" />
      )}

      <Group title="Up next" tasks={sections.upNext} to="/tasks" empty />
    </section>
  )
}

function Group({ title, tasks, to, tone, empty = false }) {
  if (!tasks.length && !empty) return null

  return (
    <div className={tone === 'danger' ? 'group danger' : 'group'}>
      <div className="section-head">
        <h2>
          {title} <span className="count-pill">{tasks.length}</span>
        </h2>
        <Link className="link" to={to}>
          View all
        </Link>
      </div>

      {tasks.length === 0 ? (
        <EmptyState title="All clear" message="Nothing in this group right now." />
      ) : (
        <ul className="task-list">
          {tasks.map((task) => (
            <TaskItem key={task.id} task={task} />
          ))}
        </ul>
      )}
    </div>
  )
}
