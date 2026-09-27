import { Link, NavLink } from 'react-router-dom'
import { useTaskStore } from '../context/TaskContext.jsx'
import { useTheme } from '../context/ThemeContext.jsx'
import { useUi } from '../context/UiContext.jsx'

const links = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/tasks', label: 'Tasks', end: false },
  { to: '/calendar', label: 'Calendar', end: false },
  { to: '/analytics', label: 'Analytics', end: false },
  { to: '/completed', label: 'Completed', end: false },
]

export default function Navbar() {
  const { tasks } = useTaskStore()
  const { theme, toggleTheme } = useTheme()
  const { openPalette, toggleHelp } = useUi()
  const pending = tasks.filter((task) => !task.completed).length

  return (
    <header className="navbar">
      <Link to="/" className="logo">
        To-Do<span className="logo-tag">pro</span>
      </Link>

      <nav className="nav">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            {link.label}
            {link.to === '/tasks' && pending > 0 && <span className="badge">{pending}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="nav-actions">
        <button type="button" className="ghost-button" onClick={openPalette} title="Command palette (Ctrl+K)">
          Search
        </button>
        <button
          type="button"
          className="ghost-button"
          onClick={toggleHelp}
          title="Keyboard shortcuts (?)"
          aria-label="Keyboard shortcuts"
        >
          ?
        </button>
        <button
          type="button"
          className="ghost-button"
          onClick={toggleTheme}
          title="Toggle theme (t)"
        >
          {theme === 'light' ? 'Dark' : 'Light'}
        </button>
        <Link to="/tasks/new" className="button small">
          + New
        </Link>
      </div>
    </header>
  )
}
