import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTaskStore } from '../context/TaskContext.jsx'
import { useUi } from '../context/UiContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import SubtaskList from './SubtaskList.jsx'
import { isOverdue, subtaskProgress } from '../utils/taskUtils.js'
import { formatDate, relativeDue } from '../utils/dateUtils.js'

export default function TaskItem({ task, showDate = true }) {
  const { toggleTask, deleteTask, reorderTask, sortMode } = useTaskStore()
  const { draggingId, setDraggingId, confirm } = useUi()
  const { success } = useToast()
  const [expanded, setExpanded] = useState(false)
  const [dragOver, setDragOver] = useState(false)

  const overdue = isOverdue(task)
  const progress = subtaskProgress(task)
  const draggable = sortMode === 'manual'
  const hasDetail = task.notes || task.subtasks.length > 0 || task.recurrence

  async function handleDelete() {
    const confirmed = await confirm({
      title: 'Delete task',
      message: `"${task.title}" will be removed permanently.`,
      confirmLabel: 'Delete',
    })
    if (!confirmed) return
    deleteTask(task.id)
    success('Task deleted. Press Ctrl+Z to undo.')
  }

  return (
    <li
      className={[
        'task',
        `priority-${task.priority.toLowerCase()}`,
        task.completed ? 'is-done' : '',
        draggingId === task.id ? 'is-dragging' : '',
        dragOver ? 'is-dragover' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      draggable={draggable}
      onDragStart={(event) => {
        event.dataTransfer.effectAllowed = 'move'
        event.dataTransfer.setData('text/plain', task.id)
        setDraggingId(task.id)
      }}
      onDragEnd={() => {
        setDraggingId(null)
        setDragOver(false)
      }}
      onDragOver={(event) => {
        if (!draggable || draggingId === task.id) return
        event.preventDefault()
        event.dataTransfer.dropEffect = 'move'
        setDragOver(true)
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(event) => {
        event.preventDefault()
        setDragOver(false)
        const draggedId = event.dataTransfer.getData('text/plain') || draggingId
        if (draggedId) reorderTask(draggedId, task.id)
        setDraggingId(null)
      }}
    >
      <div className="task-row">
        {draggable && <span className="drag-handle" aria-hidden="true">⋮⋮</span>}

        <input
          type="checkbox"
          className="task-check"
          checked={task.completed}
          onChange={() => toggleTask(task.id)}
          aria-label={`Mark ${task.title} as ${task.completed ? 'pending' : 'done'}`}
        />

        <div className="task-body">
          <span className={task.completed ? 'task-title done' : 'task-title'}>{task.title}</span>
          {task.description && <span className="task-desc">{task.description}</span>}

          <div className="task-meta">
            <span className={`chip priority-chip ${task.priority.toLowerCase()}`}>
              {task.priority}
            </span>
            <span className="chip">{task.category}</span>
            {task.tags.map((tag) => (
              <span className="chip tag-chip" key={tag}>
                #{tag}
              </span>
            ))}
            {showDate && task.dueDate && (
              <span className={overdue ? 'chip overdue' : 'chip'}>
                {relativeDue(task.dueDate)}
              </span>
            )}
            {task.recurrence && <span className="chip repeat">repeats</span>}
            {progress && (
              <span className="chip">
                {progress.done}/{progress.total} subtasks
              </span>
            )}
          </div>

          {progress && (
            <div className="progress-track thin">
              <div className="progress-fill" style={{ width: `${progress.percent}%` }} />
            </div>
          )}

          {expanded && task.notes && (
            <p className="task-notes">
              {task.notes}
              {showDate && task.dueDate && (
                <span className="muted"> Due {formatDate(task.dueDate)}.</span>
              )}
            </p>
          )}

          {expanded && task.subtasks.length > 0 && <SubtaskList task={task} />}
        </div>

        <div className="task-actions">
          {hasDetail && (
            <button
              type="button"
              className="icon-button"
              onClick={() => setExpanded((prev) => !prev)}
              aria-expanded={expanded}
              aria-label={expanded ? 'Hide details' : 'Show details'}
            >
              {expanded ? '−' : '+'}
            </button>
          )}
          <Link className="link" to={`/tasks/${task.id}/edit`}>
            Edit
          </Link>
          <button type="button" className="delete" onClick={handleDelete}>
            Delete
          </button>
        </div>
      </div>
    </li>
  )
}
