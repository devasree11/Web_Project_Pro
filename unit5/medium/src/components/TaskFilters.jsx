import { useUi } from '../context/UiContext.jsx'
import { CATEGORIES, PRIORITIES, SORT_MODES } from '../utils/taskUtils.js'

const defaultFilters = {
  search: '',
  status: 'all',
  priority: 'all',
  category: 'all',
  tag: 'all',
  sort: 'manual',
}

export default function TaskFilters({ filters, onChange, tags = [], showSort = true }) {
  const { searchRef } = useUi()
  const active =
    filters.status !== 'all' ||
    filters.priority !== 'all' ||
    filters.category !== 'all' ||
    filters.tag !== 'all' ||
    filters.search.trim() !== ''

  function set(field, value) {
    onChange({ ...filters, [field]: value })
  }

  return (
    <div className="toolbar">
      <input
        ref={searchRef}
        type="search"
        value={filters.search}
        placeholder="Search title, notes, category or #tag  (press /)"
        onChange={(event) => set('search', event.target.value)}
      />

      <select value={filters.status} onChange={(event) => set('status', event.target.value)}>
        <option value="all">All status</option>
        <option value="pending">Pending</option>
        <option value="completed">Completed</option>
        <option value="overdue">Overdue</option>
      </select>

      <select value={filters.priority} onChange={(event) => set('priority', event.target.value)}>
        <option value="all">All priorities</option>
        {PRIORITIES.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>

      <select value={filters.category} onChange={(event) => set('category', event.target.value)}>
        <option value="all">All categories</option>
        {CATEGORIES.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>

      {tags.length > 0 && (
        <select value={filters.tag} onChange={(event) => set('tag', event.target.value)}>
          <option value="all">All tags</option>
          {tags.map((item) => (
            <option key={item} value={item}>
              #{item}
            </option>
          ))}
        </select>
      )}

      {showSort && (
        <select value={filters.sort} onChange={(event) => set('sort', event.target.value)}>
          {SORT_MODES.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      )}

      {active && (
        <button type="button" className="button ghost small" onClick={() => onChange(defaultFilters)}>
          Reset
        </button>
      )}
    </div>
  )
}

export { defaultFilters }
