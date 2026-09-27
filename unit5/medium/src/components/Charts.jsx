export function BarChart({ data, unit = '' }) {
  const max = Math.max(1, ...data.map((item) => item.value))

  return (
    <div className="bar-chart">
      {data.map((item) => (
        <div className="bar-col" key={item.label} title={`${item.label}: ${item.value}${unit}`}>
          <span className="bar-value">{item.value}</span>
          <div className="bar-track">
            <div
              className="bar-fill"
              style={{ height: `${Math.round((item.value / max) * 100)}%` }}
            />
          </div>
          <span className="bar-label">{item.label}</span>
        </div>
      ))}
    </div>
  )
}

export function StackBar({ segments }) {
  const total = segments.reduce((sum, segment) => sum + segment.value, 0)

  return (
    <div className="stack-bar">
      <div className="stack-track">
        {total > 0 &&
          segments
            .filter((segment) => segment.value > 0)
            .map((segment) => (
              <div
                key={segment.label}
                className="stack-segment"
                style={{ width: `${(segment.value / total) * 100}%`, background: segment.color }}
                title={`${segment.label}: ${segment.value}`}
              />
            ))}
      </div>
      <ul className="legend">
        {segments.map((segment) => (
          <li key={segment.label}>
            <span className="dot" style={{ background: segment.color }} />
            {segment.label}
            <strong>{segment.value}</strong>
          </li>
        ))}
      </ul>
    </div>
  )
}
