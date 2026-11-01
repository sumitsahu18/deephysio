import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Lock, Eye, EyeOff, LoaderCircle } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useSite } from '../../context/SiteContext'
import { USE_MOCK, getErrorMessage } from '../../api/endpoints'

export default function Login() {
  const { login, isAuthenticated } = useAuth()
  const { settings } = useSite()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (isAuthenticated) return <Navigate to="/admin" replace />

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate(location.state?.from?.pathname || '/admin', { replace: true })
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid min-h-screen place-items-center bg-sand px-4">
      <div className="w-full max-w-sm">
        <div className="text-center">
          <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-pine-700 text-white">
            <Lock className="size-5" />
          </span>
          <h1 className="mt-4 text-3xl font-semibold">{settings.clinicName} admin</h1>
          <p className="mt-1 text-sm text-muted">Sign in to manage your website</p>
        </div>

        <form onSubmit={onSubmit} className="card mt-8 space-y-4 p-6">
          <div>
            <label htmlFor="email" className="label">Email</label>
            <input id="email" type="email" required className="input" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" />
          </div>
          <div>
            <label htmlFor="password" className="label">Password</label>
            <div className="relative">
              <input
                id="password"
                type={show ? 'text' : 'password'}
                required
                className="input pr-11"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              <button type="button" onClick={() => setShow((v) => !v)} className="absolute inset-y-0 right-3 text-muted" aria-label={show ? 'Hide password' : 'Show password'}>
                {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>
          {error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          <button className="btn-primary w-full" disabled={loading}>
            {loading && <LoaderCircle className="size-4 animate-spin" />} Sign in
          </button>
        </form>

        {USE_MOCK && (
          <div className="mt-4 rounded-xl border border-dashed border-line bg-white/60 p-4 text-xs text-muted">
            <p className="font-semibold text-ink">Demo logins</p>
            <p className="mt-1">Admin: admin@deephysio.co.uk / admin123</p>
            <p>Editor (reception): editor@deephysio.co.uk / editor123</p>
          </div>
        )}
      </div>
    </div>
  )
}
