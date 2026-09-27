import { useState } from 'react'
import { useTaskStore } from '../context/TaskContext.jsx'
import { subtaskProgress } from '../utils/taskUtils.js'

export default function SubtaskList({ task }) {
  const { toggleSubtask, addSubtask, removeSubtask } = useTaskStore()
  const [draft, setDraft] = useState('')
  const progress = subtaskProgress(task)

  function handleAdd(event) {
    event.preventDefault()
    if (!draft.trim()) return
    addSubtask(task.id, draft)
    setDraft('')
  }

  return (
    <div className="subtasks">
      {task.subtasks.length > 0 && (
        <>
          <div className="subtask-head">
            <span className="subtask-count">
              {progress.done}/{progress.total} subtasks
            </span>
            <div className="progress-track thin">
              <div className="progress-fill" style={{ width: `${progress.percent}%` }} />
            </div>
          </div>

          <ul className="subtask-list">
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
        </>
      )}

      <form className="subtask-add" onSubmit={handleAdd}>
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
