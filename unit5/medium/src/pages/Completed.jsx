import TaskItem from '../components/TaskItem.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { useTaskStore } from '../context/TaskContext.jsx'
import { useUi } from '../context/UiContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { sortTasks } from '../utils/taskUtils.js'

export default function Completed() {
  const { tasks, sortMode, clearCompleted } = useTaskStore()
  const { confirm } = useUi()
  const { success } = useToast()

  const done = sortTasks(
    tasks.filter((task) => task.completed),
    sortMode,
  )

  async function handleClear() {
    const ok = await confirm({
      title: 'Clear completed',
      message: `${done.length} completed task(s) will be removed.`,
      confirmLabel: 'Clear them',
    })
    if (ok) {
      clearCompleted()
      success('Completed tasks cleared. Ctrl+Z restores them.')
    }
  }

  return (
    <section>
      <div className="section-head">
        <div>
          <h1>Completed</h1>
          <p className="muted">{done.length} finished task(s)</p>
        </div>
        {done.length > 0 && (
          <button type="button" className="delete" onClick={handleClear}>
            Clear completed
          </button>
        )}
      </div>

      {done.length === 0 ? (
        <EmptyState title="No completed tasks" message="Tick off a task and it will show up here." />
      ) : (
        <ul className="task-list">
          {done.map((task) => (
            <TaskItem key={task.id} task={task} />
          ))}
        </ul>
      )}
    </section>
  )
}
