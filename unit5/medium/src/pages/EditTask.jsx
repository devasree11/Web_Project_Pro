import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import TaskForm from '../components/TaskForm.jsx'
import { useTaskStore } from '../context/TaskContext.jsx'
import { useUi } from '../context/UiContext.jsx'
import { useToast } from '../context/ToastContext.jsx'

export default function EditTask() {
  const { id } = useParams()
  const { tasks, updateTask, deleteTask, toggleTask } = useTaskStore()
  const { confirm } = useUi()
  const { success } = useToast()
  const navigate = useNavigate()
  const [tab, setTab] = useState('details')

  const task = tasks.find((item) => item.id === id)

  if (!task) {
    return (
      <section className="narrow center">
        <h1>Task not found</h1>
        <p className="muted">It may have been deleted or undone.</p>
        <Link className="button" to="/tasks">
          Back to tasks
        </Link>
      </section>
    )
  }

  function handleSubmit(form) {
    const result = updateTask(id, form)
    if (result.ok) {
      success('Task updated.')
      navigate('/tasks')
    }
    return result
  }

  async function handleDelete() {
    const ok = await confirm({
      title: 'Delete task',
      message: `"${task.title}" will be removed permanently.`,
      confirmLabel: 'Delete',
    })
    if (!ok) return
    deleteTask(id)
    success('Task deleted. Ctrl+Z restores it.')
    navigate('/tasks')
  }

  return (
    <section className="narrow">
      <div className="section-head">
        <h1>Edit Task</h1>
        <button
          type="button"
          className={task.completed ? 'button ghost' : 'button'}
          onClick={() => toggleTask(id)}
        >
          {task.completed ? 'Mark pending' : 'Mark complete'}
        </button>
      </div>

      <div className="tabs">
        <button
          type="button"
          className={tab === 'details' ? 'tab active' : 'tab'}
          onClick={() => setTab('details')}
        >
          Details
        </button>
        <button
          type="button"
          className={tab === 'subtasks' ? 'tab active' : 'tab'}
          onClick={() => setTab('subtasks')}
        >
          Subtasks ({task.subtasks.length})
        </button>
      </div>

      {tab === 'details' ? (
        <TaskForm
          initial={task}
          submitLabel="Update task"
          onSubmit={handleSubmit}
          onCancel={() => navigate('/tasks')}
        />
      ) : (
        <SubtaskEditor task={task} />
      )}

      <button type="button" className="delete large" onClick={handleDelete}>
        Delete this task
      </button>
    </section>
  )
}

function SubtaskEditor({ task }) {
  const { addSubtask, toggleSubtask, removeSubtask } = useTaskStore()
  const [draft, setDraft] = useState('')

  return (
    <div className="task-form">
      {task.subtasks.length === 0 && <p className="muted">No subtasks yet.</p>}

      <ul className="subtask-list standalone">
        {task.subtasks.map((subtask) => (
          <li key={subtask.id} className={subtask.completed ? 'subtask done' : 'subtask'}>
            <label>
              <input
                type="checkbox"
                checked={subtask.completed}
                onChange={() => toggleSubtask(task.id, subtask.id)}
              />
              <span>{subtask.title}</span>
            </label>
            <button
              type="button"
              className="icon-button"
              onClick={() => removeSubtask(task.id, subtask.id)}
              aria-label={`Remove ${subtask.title}`}
            >
              x
            </button>
          </li>
        ))}
      </ul>

      <form
        className="subtask-add"
        onSubmit={(event) => {
          event.preventDefault()
          if (!draft.trim()) return
          addSubtask(task.id, draft)
          setDraft('')
        }}
      >
        <input
          type="text"
          value={draft}
          placeholder="Add a subtask and press Enter"
          onChange={(event) => setDraft(event.target.value)}
        />
        <button type="submit" className="button ghost small">
          Add
        </button>
      </form>
    </div>
  )
}
