import { getStats } from '../utils/taskUtils.js'

export function ProgressRing({ percent, size = 96 }) {
  const stroke = 10
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percent / 100) * circumference

  return (
    <svg className="ring" width={size} height={size} role="img" aria-label={`${percent}% complete`}>
      <circle
        className="ring-track"
        cx={size / 2}
        cy={size / 2}
        r={radius}
        strokeWidth={stroke}
        fill="none"
      />
      <circle
        className="ring-fill"
        cx={size / 2}
        cy={size / 2}
        r={radius}
        strokeWidth={stroke}
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      <text className="ring-text" x="50%" y="50%" textAnchor="middle" dy="0.35em">
        {percent}%
      </text>
    </svg>
  )
}

export default function StatsBar({ tasks }) {
  const { total, completed, pending, overdue, dueToday, progress } = getStats(tasks)

  const cards = [
    { label: 'Total', value: total },
    { label: 'Pending', value: pending },
    { label: 'Completed', value: completed },
    { label: 'Due today', value: dueToday },
    { label: 'Overdue', value: overdue, danger: overdue > 0 },
  ]

  return (
    <div className="stats">
      {cards.map((card) => (
        <div className={card.danger ? 'stat danger' : 'stat'} key={card.label}>
          <strong>{card.value}</strong>
          <span>{card.label}</span>
        </div>
      ))}
      <div className="stat progress-stat">
        <ProgressRing percent={progress} size={72} />
        <span>Progress</span>
      </div>
    </div>
  )
}
