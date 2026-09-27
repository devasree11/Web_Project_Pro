import { Link, useParams } from 'react-router-dom'
import { useStudents } from '../App'
import {
  MAX_MARKS,
  SCHOOL_NAME,
  SUBJECTS,
  computeStudentStats,
  getRank,
  getSubjectGrade,
} from '../data'

export default function ReportCard() {
  const { id } = useParams()
  const { students, getStudent } = useStudents()
  const student = getStudent(id)

  if (!student) {
    return (
      <div className="page">
        <div className="card empty-state">
          <div className="empty-icon">🔍</div>
          <h3>Student not found</h3>
          <p>No student record exists with ID: {id}</p>
          <Link to="/students" className="btn btn-primary">
            Back to Students
          </Link>
        </div>
      </div>
    )
  }

  const stats = computeStudentStats(student.subjects)
  const passed = stats.result === 'PASS'
  const rank = getRank(students, student)

  return (
    <div className="page">
      <div className="page-head no-print">
        <div>
          <h1 className="page-title">Report Card</h1>
          <p className="page-subtitle">Annual performance report for {student.name}</p>
        </div>
        <div className="page-actions">
          <Link to="/students" className="btn btn-secondary">
            Back to Students
          </Link>
          <button type="button" className="btn btn-primary" onClick={() => window.print()}>
            🖨️ Print Report
          </button>
        </div>
      </div>

      <div className="report-card">
        <div className="report-header">
          <div className="report-school">
            <span className="report-logo">🎓</span>
            <div>
              <h2 className="report-school-name">{SCHOOL_NAME}</h2>
              <p className="report-school-tagline">Annual Academic Report Card</p>
            </div>
          </div>
          <div className={`report-result-badge ${passed ? 'pass' : 'fail'}`}>{stats.result}</div>
        </div>

        <div className="report-title">
          <h3>Student Report Card</h3>
          <p>Session {student.year}</p>
        </div>

        <div className="report-meta">
          <div className="report-meta-item">
            <span>Student ID</span>
            <b>{student.id}</b>
          </div>
          <div className="report-meta-item">
            <span>Student Name</span>
            <b>{student.name}</b>
          </div>
          <div className="report-meta-item">
            <span>Class</span>
            <b>{student.cls}</b>
          </div>
          <div className="report-meta-item">
            <span>Academic Year</span>
            <b>{student.year}</b>
          </div>
          <div className="report-meta-item">
            <span>Class Rank</span>
            <b>#{rank}</b>
          </div>
        </div>

        <div className="report-table-wrap">
          <table className="report-table">
            <thead>
              <tr>
                <th>Subject</th>
                <th>Max Marks</th>
                <th>Obtained Marks</th>
                <th>Grade</th>
                <th>Result</th>
              </tr>
            </thead>
            <tbody>
              {SUBJECTS.map((subject) => {
                const mark = Number(student.subjects[subject.key]) || 0
                const grade = getSubjectGrade(mark)
                const subjectPass = mark >= 35
                return (
                  <tr key={subject.key} className={subjectPass ? '' : 'row-fail'}>
                    <td>{subject.label}</td>
                    <td>{MAX_MARKS}</td>
                    <td>{mark}</td>
                    <td>
                      <span className={`badge ${subjectPass ? 'badge-grade' : 'badge-fail'}`}>
                        {grade}
                      </span>
                    </td>
                    <td className={subjectPass ? 'text-pass' : 'text-fail'}>
                      {subjectPass ? 'PASS' : 'FAIL'}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <div className="report-summary">
          <div className="summary-cell">
            <span>Total Marks</span>
            <b>
              {stats.total} / {stats.maxTotal}
            </b>
          </div>
          <div className="summary-cell">
            <span>Percentage</span>
            <b>{stats.percentage}%</b>
          </div>
          <div className="summary-cell">
            <span>Overall Grade</span>
            <b className={passed ? 'text-pass' : 'text-fail'}>{stats.grade}</b>
          </div>
          <div className="summary-cell">
            <span>Result</span>
            <span className={`badge ${passed ? 'badge-pass' : 'badge-fail'}`}>{stats.result}</span>
          </div>
        </div>

        <div className="report-footer">
          <div>
            <p>
              Grading scale: A+ (90-100), A (80-89), B+ (70-79), B (60-69), C (50-59), F (below 50).
            </p>
            <p>Fail criteria: any subject below 35 marks.</p>
          </div>
          <div className="report-sign">
            <div className="sign-line" />
            <span>Principal</span>
          </div>
        </div>
      </div>
    </div>
  )
}