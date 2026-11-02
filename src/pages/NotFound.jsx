import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="shell glass relative isolate mt-6 overflow-hidden rounded-3xl px-6 py-24 text-center">
      <div className="inner-glow" />
      <p className="anim-zoom-in font-glass text-7xl font-bold sm:text-8xl">404</p>
      <h1 className="mt-4 font-glass text-3xl font-semibold">Page not found</h1>
      <Link to="/" className="btn-white mt-8 px-8">Back to home</Link>
    </div>
  )
}
