import { Link, useNavigate } from 'react-router-dom'

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <section className="center">
      <h1>404</h1>
      <p className="muted">That page does not exist.</p>
      <div className="form-actions">
        <Link className="button" to="/">
          Go home
        </Link>
        <button type="button" className="button ghost" onClick={() => navigate(-1)}>
          Go back
        </button>
      </div>
    </section>
  )
}
