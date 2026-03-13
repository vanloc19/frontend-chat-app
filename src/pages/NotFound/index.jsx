import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <section className="page">
      <h1>404</h1>
      <p>Page not found. Go back to the home page.</p>
      <p>
        <Link to="/">Back to Home</Link>
      </p>
    </section>
  )
}

export default NotFoundPage
