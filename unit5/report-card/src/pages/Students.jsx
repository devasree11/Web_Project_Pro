import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useStudents } from '../App'
import StudentCard from '../components/StudentCard'
import { computeStudentStats, exportStudentsCsv, getClassList } from '../data'

const PER_PAGE = 6

export default function Students() {
  const { students, deleteStudent, resetStudents } = useStudents()
  const navigate = useNavigate()
  const location = useLocation()
  const [search, setSearch] = useState('')
  const [classFilter, setClassFilter] = useState('all')
  const [resultFilter, setResultFilter] = useState('all')
  const [sortBy, setSortBy] = useState('name')
  const [sortDir, setSortDir] = useState('asc')
  const [page, setPage] = useState(1)
  const [successMsg, setSuccessMsg] = useState('')

  useEffect(() => {
    if (!location.state?.successMsg) return
    setSuccessMsg(location.state.successMsg)
    const timer = setTimeout(() => setSuccessMsg(''), 5000)
    return () => clearTimeout(timer)
  }, [location.state])

  useEffect(() => {
    setPage(1)
  }, [search, classFilter, resultFilter, sortBy, sortDir])

  const classes = useMemo(() => getClassList(students), [students])

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    const list = students.filter((student) => {
      const matchQuery =
        !query ||
        student.name.toLowerCase().includes(query) ||
        student.id.toLowerCase().includes(query)
      const matchClass = classFilter === 'all' || student.cls === classFilter
      const stats = computeStudentStats(student.subjects)
      const matchResult = resultFilter === 'all' || stats.result === resultFilter
      return matchQuery && matchClass && matchResult
    })

    return [...list].sort((a, b) => {
      const statsA = computeStudentStats(a.subjects)
      const statsB = computeStudentStats(b.subjects)
      let comparison = 0
      if (sortBy === 'name') comparison = a.name.localeCompare(b.name)
      else if (sortBy === 'id') comparison = a.id.localeCompare(b.id)
      else if (sortBy === 'percentage') comparison = statsA.percentage - statsB.percentage
      else if (sortBy === 'total') comparison = statsA.total - statsB.total
      return sortDir === 'asc' ? comparison : -comparison
    })
  }, [students, search, classFilter, resultFilter, sortBy, sortDir])

  const rankMap = useMemo(() => {
    const map = {}
    const ranked = students.map((student) => ({
      student,
      percentage: computeStudentStats(student.subjects).percentage,
    }))
    ranked.sort((a, b) => b.percentage - a.percentage)
    ranked.forEach((item, index) => {
      map[item.student.id] = index + 1
    })
    return map
  }, [students])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const pageItems = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)
  const fromCount = filtered.length === 0 ? 0 : (page - 1) * PER_PAGE + 1
  const toCount = Math.min(page * PER_PAGE, filtered.length)

  const handleDelete = (student) => {
    if (window.confirm(`Delete ${student.name} (${student.id})? This cannot be undone.`)) {
      deleteStudent(student.id)
    }
  }

  const handleReset = () => {
    if (window.confirm('Replace all existing data with the sample students?')) {
      resetStudents()
      setSuccessMsg('Sample data loaded successfully!')
    }
  }

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1 className="page-title">Students</h1>
          <p className="page-subtitle">
            {students.length} student{students.length === 1 ? '' : 's'} enrolled
          </p>
        </div>
        <Link to="/add-student" className="btn btn-primary">
          + Add Student
        </Link>
      </div>

      {successMsg && (
        <div className="success-banner no-print" role="status">
          <span className="success-banner-text">{successMsg}</span>
          <button type="button" className="alert-close" onClick={() => setSuccessMsg('')}>
            &times;
          </button>
        </div>
      )}

      <div className="toolbar no-print">
        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by name or student ID..."
          />
        </div>
        <div className="filter-group">
          <select
            className="select"
            value={classFilter}
            onChange={(event) => setClassFilter(event.target.value)}
            aria-label="Filter by class"
          >
            <option value="all">All Classes</option>
            {classes.map((cls) => (
              <option key={cls} value={cls}>
                Class {cls}
              </option>
            ))}
          </select>
          <select
            className="select"
            value={resultFilter}
            onChange={(event) => setResultFilter(event.target.value)}
            aria-label="Filter by result"
          >
            <option value="all">All Results</option>
            <option value="PASS">Passed</option>
            <option value="FAIL">Failed</option>
          </select>
          <select
            className="select"
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
            aria-label="Sort students"
          >
            <option value="name">Sort: Name</option>
            <option value="id">Sort: ID</option>
            <option value="percentage">Sort: Percentage</option>
            <option value="total">Sort: Total Marks</option>
          </select>
          <button
            type="button"
            className="btn btn-secondary sort-dir"
            onClick={() => setSortDir((dir) => (dir === 'asc' ? 'desc' : 'asc'))}
            title={sortDir === 'asc' ? 'Sort ascending' : 'Sort descending'}
            aria-label="Toggle sort direction"
          >
            {sortDir === 'asc' ? 'Asc ↑' : 'Desc ↓'}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => exportStudentsCsv(students)}
            title="Download all students as CSV"
          >
            ⬇ Export CSV
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleReset}
            title="Restore the sample student data"
          >
            ↺ Reset Data
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="card empty-state">
          <div className="empty-icon">🗂️</div>
          <h3>{students.length === 0 ? 'No students yet' : 'No matching students'}</h3>
          <p>
            {students.length === 0
              ? 'Start by adding your first student to generate report cards.'
              : 'Try changing the search term or clearing some filters.'}
          </p>
          {students.length === 0 && (
            <Link to="/add-student" className="btn btn-primary">
              + Add Student
            </Link>
          )}
        </div>
      ) : (
        <>
          <div className="students-grid">
            {pageItems.map((student) => (
              <StudentCard
                key={student.id}
                student={student}
                stats={computeStudentStats(student.subjects)}
                rank={rankMap[student.id]}
                onView={() => navigate(`/report/${student.id}`)}
                onEdit={() => navigate(`/add-student?id=${student.id}`)}
                onDelete={() => handleDelete(student)}
              />
            ))}
          </div>

          <div className="footer-bar">
            <span className="result-count">
              Showing {fromCount}–{toCount} of {filtered.length} student
              {filtered.length === 1 ? '' : 's'}
            </span>
            {totalPages > 1 && (
              <div className="pagination">
                <button
                  type="button"
                  className="btn btn-secondary"
                  disabled={page === 1}
                  onClick={() => setPage((current) => current - 1)}
                >
                  ← Prev
                </button>
                <span className="page-info">
                  Page {page} of {totalPages}
                </span>
                <button
                  type="button"
                  className="btn btn-secondary"
                  disabled={page === totalPages}
                  onClick={() => setPage((current) => current + 1)}
                >
                  Next →
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}