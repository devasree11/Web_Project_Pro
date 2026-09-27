import { Link } from 'react-router-dom'
import StatCard from '../components/StatCard'
import { useStudents } from '../App'
import { GRADE_ORDER, SUBJECTS, computeStudentStats, getClassStats } from '../data'

const gradeBarClass = {
  'A+': 'grade-aplus',
  A: 'grade-a',
  'B+': 'grade-bplus',
  B: 'grade-b',
  C: 'grade-c',
  F: 'grade-f',
}

const medallions = ['🥇', '🥈', '🥉']

export default function Home() {
  const { students } = useStudents()

  const statsList = students.map((student) => computeStudentStats(student.subjects))
  const total = students.length
  const passed = statsList.filter((stats) => stats.result === 'PASS').length
  const failed = statsList.filter((stats) => stats.result === 'FAIL').length
  const average = total ? statsList.reduce((sum, stats) => sum + stats.percentage, 0) / total : 0

  const { subjectAverages, gradeCounts } = getClassStats(students)
  const maxGradeCount = Math.max(1, ...GRADE_ORDER.map((grade) => gradeCounts[grade]))

  const topPerformers = students
    .map((student) => ({ student, stats: computeStudentStats(student.subjects) }))
    .sort((a, b) => b.stats.percentage - a.stats.percentage)
    .slice(0, 5)

  return (
    <div className="page">
      <section className="hero card">
        <h1 className="hero-title">Student Report Card Management System</h1>
        <p className="hero-text">
          A simple yet complete system to manage students, record subject-wise marks, automatically
          calculate totals, percentages, grades and pass/fail results, and generate printable report
          cards. All data is saved locally in your browser.
        </p>
        <div className="hero-actions">
          <Link to="/students" className="btn btn-primary">
            View Students
          </Link>
          <Link to="/add-student" className="btn btn-outline">
            Add New Student
          </Link>
        </div>
      </section>

      <section className="stats-grid">
        <StatCard label="Total Students" value={total} icon="👥" tone="blue" />
        <StatCard label="Passed Students" value={passed} icon="✅" tone="green" />
        <StatCard label="Failed Students" value={failed} icon="❌" tone="red" />
        <StatCard label="Class Average" value={`${average.toFixed(1)}%`} icon="📊" tone="purple" />
      </section>

      {total === 0 ? (
        <div className="card empty-state">
          <div className="empty-icon">📈</div>
          <h3>No analytics yet</h3>
          <p>Add a few students and their report data will show up here automatically.</p>
          <Link to="/add-student" className="btn btn-primary">
            + Add Student
          </Link>
        </div>
      ) : (
        <section className="card analytics-card">
          <h2 className="section-title">Performance Analytics</h2>
          <div className="analytics-grid">
            <div className="analytics-col">
              <h3 className="analytics-subtitle">Grade Distribution</h3>
              {maxGradeCount === 0 ? (
                <p className="analytics-empty">No data yet.</p>
              ) : (
                <div className="bar-list">
                  {GRADE_ORDER.map((grade) => (
                    <div className="bar-row" key={grade}>
                      <span className="bar-label">{grade}</span>
                      <div className="bar-track">
                        <div
                          className={`bar-fill ${gradeBarClass[grade]}`}
                          style={{ width: `${(gradeCounts[grade] / maxGradeCount) * 100}%` }}
                        />
                      </div>
                      <span className="bar-value">{gradeCounts[grade]}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="analytics-col">
              <h3 className="analytics-subtitle">Subject Wise Class Average</h3>
              <div className="bar-list">
                {SUBJECTS.map((subject) => (
                  <div className="bar-row" key={subject.key}>
                    <span className="bar-label" title={subject.label}>
                      {subject.label}
                    </span>
                    <div className="bar-track">
                      <div
                        className="bar-fill subject-avg"
                        style={{ width: `${subjectAverages[subject.key]}%` }}
                      />
                    </div>
                    <span className="bar-value">{subjectAverages[subject.key]}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="analytics-col">
              <h3 className="analytics-subtitle">Top Performers</h3>
              <div className="top-performers">
                {topPerformers.map((entry, index) => (
                  <Link to={`/report/${entry.student.id}`} className="top-performer" key={entry.student.id}>
                    <span className="performer-rank">{medallions[index] || `#${index + 1}`}</span>
                    <div className="performer-info">
                      <b>{entry.student.name}</b>
                      <small>
                        {entry.student.id} &bull; Class {entry.student.cls}
                      </small>
                    </div>
                    <span className={`badge ${entry.stats.result === 'PASS' ? 'badge-grade' : 'badge-fail'}`}>
                      {entry.stats.grade}
                    </span>
                    <span className="performer-pct">{entry.stats.percentage}%</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}