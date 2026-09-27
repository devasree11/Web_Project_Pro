import { useNavigate, useSearchParams } from 'react-router-dom'
import TaskForm from '../components/TaskForm.jsx'
import { useTaskStore } from '../context/TaskContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { todayISO } from '../utils/dateUtils.js'

export default function AddTask() {
  const { addTask } = useTaskStore()
  const { success } = useToast()
  const navigate = useNavigate()
  const [params] = useSearchParams()

  function handleSubmit(form) {
    const result = addTask(form)
    if (result.ok) {
      success('Task added.')
      navigate('/tasks')
    }
    return result
  }

  return (
    <section className="narrow">
      <h1>New Task</h1>
      <p className="muted">Add subtasks after saving, straight from the edit screen.</p>

      <TaskForm
        initial={{ dueDate: params.get('due') || todayISO() }}
        submitLabel="Add task"
        onSubmit={handleSubmit}
        onCancel={() => navigate(-1)}
      />
    </section>
  )
}
