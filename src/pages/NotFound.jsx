import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="container-x py-28 text-center">
      <p className="font-display text-7xl text-pine-700">404</p>
      <h1 className="mt-4 text-3xl font-semibold">Page not found</h1>
      <Link to="/" className="btn-primary mt-8">Back to home</Link>
    </div>
  )
}
