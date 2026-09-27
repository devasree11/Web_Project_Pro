import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useStudents } from '../App'
import { DEFAULT_YEAR, SUBJECTS, computeStudentStats } from '../data'

const emptySubjects = () => ({
  mathematics: '',
  physics: '',
  chemistry: '',
  computer: '',
  english: '',
})

export default function AddStudent() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const editingId = searchParams.get('id')

  const { students, addStudent, updateStudent, getStudent } = useStudents()
  const editingStudent = editingId ? getStudent(editingId) : null

  const [errors, setErrors] = useState({})
  const [form, setForm] = useState(() => ({
    id: editingStudent?.id || '',
    name: editingStudent?.name || '',
    cls: editingStudent?.cls || '',
    year: editingStudent?.year || DEFAULT_YEAR,
    subjects: editingStudent
      ? { ...editingStudent.subjects }
      : emptySubjects(),
  }))

  useEffect(() => {
    if (editingStudent) {
      setForm({
        id: editingStudent.id,
        name: editingStudent.name,
        cls: editingStudent.cls,
        year: editingStudent.year,
        subjects: { ...editingStudent.subjects },
      })
    } else {
      setForm({
        id: '',
        name: '',
        cls: '',
        year: DEFAULT_YEAR,
        subjects: emptySubjects(),
      })
    }
    setErrors({})
  }, [editingId])

  const preview = useMemo(() => computeStudentStats(form.subjects), [form.subjects])

  const handleTextChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleMarkChange = (key, value) => {
    setForm((prev) => ({ ...prev, subjects: { ...prev.subjects, [key]: value } }))
  }

  const validate = () => {
    const nextErrors = {}
    if (!form.id.trim()) nextErrors.id = 'Student ID is required'
    else if (
      !editingStudent &&
      students.some(
        (student) => student.id.trim().toLowerCase() === form.id.trim().toLowerCase()
      )
    ) {
      nextErrors.id = 'This Student ID is already taken'
    }

    if (!form.name.trim()) nextErrors.name = 'Student name is required'
    if (!form.cls.trim()) nextErrors.cls = 'Class is required'
    if (!form.year.trim()) nextErrors.year = 'Academic year is required'

    SUBJECTS.forEach((subject) => {
      const value = form.subjects[subject.key]
      const number = Number(value)
      if (value === '' || value === null || Number.isNaN(number)) {
        nextErrors[subject.key] = 'Mark is required'
      } else if (number < 0 || number > 100) {
        nextErrors[subject.key] = 'Mark must be between 0 and 100'
      }
    })

    return nextErrors
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const nextErrors = validate()
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    const student = {
      id: form.id.trim(),
      name: form.name.trim(),
      cls: form.cls.trim(),
      year: form.year.trim(),
      subjects: Object.fromEntries(
        SUBJECTS.map((subject) => [subject.key, Number(form.subjects[subject.key])])
      ),
    }

    if (editingStudent) {
      updateStudent(student)
      navigate('/students', { state: { successMsg: 'Student updated successfully!' } })
    } else {
      addStudent(student)
      navigate('/students', { state: { successMsg: 'Student added successfully!' } })
    }
  }

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1 className="page-title">{editingStudent ? 'Edit Student' : 'Add New Student'}</h1>
          <p className="page-subtitle">
            {editingStudent
              ? `Updating record of ${editingStudent.name}`
              : 'Fill in the details below to register a student.'}
          </p>
        </div>
        <Link to="/students" className="btn btn-secondary">
          Cancel
        </Link>
      </div>

      <div className="add-layout">
        <form className="card form-card" onSubmit={handleSubmit} noValidate>
          <h2 className="section-title">Student Details</h2>
          <div className="form-grid">
            <div className="form-field">
              <label htmlFor="id">Student ID *</label>
              <input
                id="id"
                name="id"
                type="text"
                placeholder="e.g. STU106"
                value={form.id}
                onChange={handleTextChange}
                readOnly={Boolean(editingStudent)}
                className={editingStudent ? 'readonly' : ''}
              />
              {errors.id && <span className="field-error">{errors.id}</span>}
              {editingStudent && <span className="field-hint">Student ID cannot be changed</span>}
            </div>

            <div className="form-field">
              <label htmlFor="name">Student Name *</label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="e.g. Aarav Verma"
                value={form.name}
                onChange={handleTextChange}
              />
              {errors.name && <span className="field-error">{errors.name}</span>}
            </div>

            <div className="form-field">
              <label htmlFor="cls">Class *</label>
              <input
                id="cls"
                name="cls"
                type="text"
                placeholder="e.g. 12-A"
                value={form.cls}
                onChange={handleTextChange}
              />
              {errors.cls && <span className="field-error">{errors.cls}</span>}
            </div>

            <div className="form-field">
              <label htmlFor="year">Academic Year *</label>
              <input
                id="year"
                name="year"
                type="text"
                placeholder="e.g. 2025-2026"
                value={form.year}
                onChange={handleTextChange}
              />
              {errors.year && <span className="field-error">{errors.year}</span>}
            </div>
          </div>

          <h2 className="section-title">Subject Marks <small>(out of 100)</small></h2>
          <div className="form-grid">
            {SUBJECTS.map((subject) => (
              <div className="form-field" key={subject.key}>
                <label htmlFor={subject.key}>{subject.label} *</label>
                <input
                  id={subject.key}
                  type="number"
                  min="0"
                  max="100"
                  placeholder="0-100"
                  value={form.subjects[subject.key]}
                  onChange={(event) => handleMarkChange(subject.key, event.target.value)}
                />
                {errors[subject.key] && <span className="field-error">{errors[subject.key]}</span>}
              </div>
            ))}
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary btn-lg">
              {editingStudent ? 'Save Changes' : 'Add Student'}
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-lg"
              onClick={() => {
                setForm({
                  id: '',
                  name: '',
                  cls: '',
                  year: DEFAULT_YEAR,
                  subjects: emptySubjects(),
                })
                setErrors({})
              }}
            >
              Reset Form
            </button>
          </div>
        </form>

        <aside className="preview-card">
          <h3 className="preview-title">Live Summary</h3>
          <div className="preview-avatar">{form.name.trim() ? form.name.trim().charAt(0).toUpperCase() : '?'}</div>
          <div className="preview-name">{form.name.trim() || 'Student Name'}</div>
          <div className="preview-meta">
            {form.id.trim() || '—'} &bull; {form.cls.trim() || '—'}
          </div>
          <div className="preview-stats">
            <div className="preview-row">
              <span>Total Marks</span>
              <b>
                {preview.total} / {preview.maxTotal}
              </b>
            </div>
            <div className="preview-row">
              <span>Percentage</span>
              <b>{preview.percentage}%</b>
            </div>
            <div className="preview-row">
              <span>Overall Grade</span>
              <b className={preview.result === 'PASS' ? 'text-pass' : 'text-fail'}>{preview.grade}</b>
            </div>
            <div className="preview-row">
              <span>Result</span>
              <span className={`badge ${preview.result === 'PASS' ? 'badge-pass' : 'badge-fail'}`}>
                {preview.result}
              </span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}