import { NavLink } from 'react-router-dom'
import { useTheme } from '../App'

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/students', label: 'Students', end: false },
  { to: '/add-student', label: 'Add Student', end: false },
]

export default function Navbar() {
  const { theme, setTheme } = useTheme()

  return (
    <nav className="navbar no-print">
      <div className="container nav-inner">
        <NavLink to="/" className="navbar-brand">
          <span className="brand-mark">🎓</span>
          <span>Report Card Manager</span>
        </NavLink>
        <div className="nav-links">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              {link.label}
            </NavLink>
          ))}
          <button
            type="button"
            className="theme-toggle"
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            aria-label="Toggle dark mode"
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
      </div>
    </nav>
  )
}