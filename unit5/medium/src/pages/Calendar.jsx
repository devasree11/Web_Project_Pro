import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTaskStore } from '../context/TaskContext.jsx'
import { formatMonth, isSameDay, monthMatrix, todayISO, toISO } from '../utils/dateUtils.js'

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export default function Calendar() {
  const { tasks } = useTaskStore()
  const navigate = useNavigate()
  const [anchor, setAnchor] = useState(() => new Date())
  const [selected, setSelected] = useState(todayISO())

  const weeks = useMemo(() => monthMatrix(anchor), [anchor])
  const today = todayISO()

  function shift(months) {
    setAnchor((prev) => new Date(prev.getFullYear(), prev.getMonth() + months, 1))
  }

  const grouped = useMemo(
    () =>
      tasks.reduce((map, task) => {
        if (!task.dueDate) return map
        map[task.dueDate] = map[task.dueDate] ? [...map[task.dueDate], task] : [task]
        return map
      }, {}),
    [tasks],
  )

  const dayTasks = grouped[selected] || []

  return (
    <section>
      <div className="section-head">
        <div>
          <h1>Calendar</h1>
          <p className="muted">Due dates across the month. Click a day to see its tasks.</p>
        </div>

        <div className="head-actions">
          <button type="button" className="ghost-button" onClick={() => shift(-1)}>
            Prev
          </button>
          <strong className="month-label">{formatMonth(anchor)}</strong>
          <button type="button" className="ghost-button" onClick={() => shift(1)}>
            Next
          </button>
          <button
            type="button"
            className="button ghost small"
            onClick={() => {
              setAnchor(new Date())
              setSelected(todayISO())
            }}
          >
            Today
          </button>
        </div>
      </div>

      <div className="calendar">
        <div className="calendar-grid weekdays">
          {WEEKDAYS.map((day) => (
            <span key={day}>{day}</span>
          ))}
        </div>

        {weeks.map((week) => (
          <div className="calendar-grid" key={week[0].toISOString()}>
            {week.map((day) => {
              const key = toISO(day)
              const items = grouped[key] || []
              const outside = day.getMonth() !== anchor.getMonth()

              return (
                <button
                  type="button"
                  key={key}
                  className={[
                    'calendar-day',
                    outside ? 'outside' : '',
                    key === today ? 'today' : '',
                    key === selected ? 'selected' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  onClick={() => setSelected(key)}
                >
                  <span className="day-number">{day.getDate()}</span>
                  <span className="day-dots">
                    {items.slice(0, 3).map((task) => (
                      <i
                        key={task.id}
                        className={`dot priority-${task.priority.toLowerCase()}`}
                        title={task.title}
                      />
                    ))}
                    {items.length > 3 && <i className="dot more" />}
                  </span>
                </button>
              )
            })}
          </div>
        ))}
      </div>

      <div className="section-head">
        <h2>
          {formatMonth(selected)} <span className="count-pill">{dayTasks.length}</span>
        </h2>
        <button
          type="button"
          className="button small"
          onClick={() => navigate(`/tasks/new?due=${selected}`)}
        >
          + Add on this day
        </button>
      </div>

      {dayTasks.length === 0 ? (
        <p className="muted">No tasks due on this day.</p>
      ) : (
        <ul className="mini-list">
          {dayTasks.map((task) => (
            <li
              key={task.id}
              className={task.completed ? 'mini-item done' : 'mini-item'}
              onClick={() => navigate(`/tasks/${task.id}/edit`)}
            >
              <span className={`chip priority-chip ${task.priority.toLowerCase()}`}>
                {task.priority}
              </span>
              <span>{task.title}</span>
            </li>
          ))}
        </ul>
      )}

      {!isSameDay(selected, today) && (
        <p className="hint">Tip: press d, l, c or a to jump between pages.</p>
      )}
    </section>
  )
}
