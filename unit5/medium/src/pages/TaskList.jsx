import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import TaskItem from '../components/TaskItem.jsx'
import TaskFilters, { defaultFilters } from '../components/TaskFilters.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { useTaskStore } from '../context/TaskContext.jsx'
import { useUi } from '../context/UiContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { collectTags, filterTasks, sortTasks } from '../utils/taskUtils.js'

export default function TaskList() {
  const { tasks, sortMode, setSortMode, canUndo, canRedo, undo, redo, clearCompleted: wipe } = useTaskStore()
  const { confirm } = useUi()
  const { success } = useToast()
  const [params] = useSearchParams()
  const [filters, setFilters] = useState(() => ({
    ...defaultFilters,
    sort: sortMode,
    status: params.get('status') || defaultFilters.status,
  }))

  const tags = useMemo(() => collectTags(tasks).map((item) => item.tag), [tasks])

  const visible = useMemo(
    () => sortTasks(filterTasks(tasks, filters), filters.sort),
    [tasks, filters],
  )

  function handleChange(next) {
    setFilters(next)
    if (next.sort !== sortMode) setSortMode(next.sort)
  }

  async function handleClearCompleted() {
    const removed = tasks.filter((task) => task.completed).length
    if (!removed) return
    const ok = await confirm({
      title: 'Clear completed',
      message: `${removed} completed task${removed === 1 ? '' : 's'} will be removed.`,
      confirmLabel: 'Clear them',
    })
    if (ok) {
      wipe()
      success('Completed tasks cleared. Ctrl+Z restores them.')
    }
  }

  return (
    <section>
      <div className="section-head">
        <div>
          <h1>Tasks</h1>
          <p className="muted">
            {visible.length} of {tasks.length} shown
          </p>
        </div>

        <div className="head-actions">
          <button
            type="button"
            className="ghost-button"
            onClick={undo}
            disabled={!canUndo}
            title="Undo (Ctrl+Z)"
          >
            Undo
          </button>
          <button
            type="button"
            className="ghost-button"
            onClick={redo}
            disabled={!canRedo}
            title="Redo (Ctrl+Shift+Z)"
          >
            Redo
          </button>
          <button type="button" className="delete" onClick={handleClearCompleted}>
            Clear completed
          </button>
        </div>
      </div>

      <TaskFilters filters={filters} onChange={handleChange} tags={tags} />

      {visible.length === 0 ? (
        <EmptyState
          title="No matches"
          message={
            tasks.length
              ? 'Try clearing the search or filters.'
              : 'Add your first task to get started.'
          }
        />
      ) : (
        <>
          {filters.sort === 'manual' && visible.length > 1 && (
            <p className="hint">Drag the handle on the left to reorder.</p>
          )}
          <ul className="task-list">
            {visible.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </ul>
        </>
      )}
    </section>
  )
}
