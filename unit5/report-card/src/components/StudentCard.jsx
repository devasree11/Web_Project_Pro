export default function StudentCard({ student, stats, rank, onView, onEdit, onDelete }) {
  const passed = stats.result === 'PASS'

  return (
    <div className={`student-card ${passed ? 'is-pass' : 'is-fail'}`}>
      <div className="student-card-top">
        <div className="student-top-left">
          <span className="student-id">ID: {student.id}</span>
          {rank && <span className="rank-chip">#{rank}</span>}
        </div>
        <span className={`badge ${passed ? 'badge-pass' : 'badge-fail'}`}>{stats.result}</span>
      </div>
      <h3 className="student-name">{student.name}</h3>
      <p className="student-meta">
        Class {student.cls} &bull; {student.year}
      </p>
      <div className="student-grid">
        <div className="student-cell">
          <span>Total</span>
          <b>
            {stats.total} / {stats.maxTotal}
          </b>
        </div>
        <div className="student-cell">
          <span>Percentage</span>
          <b>{stats.percentage}%</b>
        </div>
        <div className="student-cell">
          <span>Grade</span>
          <b className={passed ? 'text-pass' : 'text-fail'}>{stats.grade}</b>
        </div>
      </div>
      <div className="student-actions">
        <button type="button" className="btn btn-view" onClick={onView}>
          View Report
        </button>
        <button type="button" className="btn btn-edit" onClick={onEdit}>
          Edit
        </button>
        <button type="button" className="btn btn-delete" onClick={onDelete}>
          Delete
        </button>
      </div>
    </div>
  )
}