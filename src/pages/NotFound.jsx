import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="container-x py-28 text-center">
      <p className="anim-zoom-in text-8xl font-black text-pine-700">404</p>
      <h1 className="mt-4 text-3xl text-pine-900">Page not found</h1>
      <Link to="/" className="btn-primary mt-8 rounded-sm px-8">Back to home</Link>
    </div>
  )
}
