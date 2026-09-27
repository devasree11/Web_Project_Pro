export default function EmptyState({ title = 'Nothing here yet', message = 'Add a task to get started.' }) {
  return (
    <div className="empty">
      <h3>{title}</h3>
      <p className="muted">{message}</p>
    </div>
  )
}
