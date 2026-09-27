import { useState } from 'react'
import TagInput from './TagInput.jsx'
import SubtaskList from './SubtaskList.jsx'
import { useTaskStore } from '../context/TaskContext.jsx'
import { CATEGORIES, PRIORITIES, RECURRENCES } from '../utils/taskUtils.js'
import { todayISO } from '../utils/dateUtils.js'

export default function TaskForm({ initial = null, submitLabel = 'Save task', onSubmit, onCancel }) {
  const { tasks } = useTaskStore()
  const [form, setForm] = useState({
    title: initial?.title || '',
    description: initial?.description || '',
    notes: initial?.notes || '',
    priority: initial?.priority || 'Medium',
    category: initial?.category || 'Other',
    dueDate: initial?.dueDate || todayISO(),
    recurrence: initial?.recurrence || '',
    tags: initial?.tags || [],
  })
  const [error, setError] = useState('')

  const suggestions = [...new Set(tasks.flatMap((task) => task.tags))]

  function update(field) {
    return (event) => setForm((prev) => ({ ...prev, [field]: event.target.value }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    const result = onSubmit(form)
    if (result && !result.ok) {
      setError(result.message)
      return
    }
    setError('')
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <label className="field">
        <span>Title</span>
        <input
          type="text"
          value={form.title}
          onChange={update('title')}
          placeholder="What needs to be done?"
          autoFocus
        />
      </label>

      <label className="field">
        <span>Description</span>
        <textarea
          rows="2"
          value={form.description}
          onChange={update('description')}
          placeholder="Short summary shown under the title"
        />
      </label>

      <label className="field">
        <span>Notes</span>
        <textarea
          rows="4"
          value={form.notes}
          onChange={update('notes')}
          placeholder="Longer notes, links, checklists"
        />
      </label>

      <div className="field-row">
        <label className="field">
          <span>Priority</span>
          <select value={form.priority} onChange={update('priority')}>
            {PRIORITIES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>Category</span>
          <select value={form.category} onChange={update('category')}>
            {CATEGORIES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>Due date</span>
          <input type="date" value={form.dueDate} onChange={update('dueDate')} />
        </label>

        <label className="field">
          <span>Repeat</span>
          <select value={form.recurrence} onChange={update('recurrence')}>
            {RECURRENCES.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="field">
        <span>Tags</span>
        <TagInput
          tags={form.tags}
          suggestions={suggestions}
          onChange={(tags) => setForm((prev) => ({ ...prev, tags }))}
        />
      </div>

      {initial && (
        <div className="field">
          <span>Subtasks</span>
          <SubtaskList task={initial} />
        </div>
      )}

      {error && <p className="error">{error}</p>}

      <div className="form-actions">
        <button type="submit" className="button">
          {submitLabel}
        </button>
        {onCancel && (
          <button type="button" className="button ghost" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}
