import { useState } from 'react'
import { Navigate, useLocation, useNavigate, Link } from 'react-router-dom'
import { Lock, Eye, EyeOff, LoaderCircle, ArrowLeft } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useSite } from '../../context/SiteContext'
import { USE_MOCK, getErrorMessage } from '../../api/endpoints'
import Logo from '../../components/Logo'
import GlassBackground from '../../components/GlassBackground'

// Ek hi login: Admin aur Staff dono apne email + password se. Role database se aata hai
// (Admin ne jo account banaya) aur usi hisaab se dashboard mein options dikhte hain.
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
      await login(email.trim(), password)
      navigate(location.state?.from?.pathname || '/admin', { replace: true })
    } catch (err) {
      setError(getErrorMessage(err))
      setPassword('')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="theme-glass relative grid min-h-dvh place-items-center px-4 py-10 text-white">
      <GlassBackground />
      <div className="w-full max-w-md">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm font-semibold text-white/80 transition-colors hover:text-white">
          <ArrowLeft className="size-4" /> Back to website
        </Link>

        <div className="mt-6 flex flex-col items-center text-center">
          <Logo light />
          <h1 className="mt-5 font-glass text-2xl font-bold sm:text-3xl">Sign in</h1>
          <p className="mt-1 text-sm text-white/65">{settings.clinicName} website management</p>
        </div>

        <form onSubmit={onSubmit} className="glass relative isolate mt-6 space-y-4 overflow-hidden rounded-3xl p-5 sm:p-7" noValidate>
          <div>
            <label htmlFor="email" className="label-glass">Email</label>
            <input id="email" type="email" required className="input-glass" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" autoFocus />
          </div>
          <div>
            <label htmlFor="password" className="label-glass">Password</label>
            <div className="relative">
              <input
                id="password"
                type={show ? 'text' : 'password'}
                required
                className="input-glass pr-11"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              <button type="button" onClick={() => setShow((v) => !v)} className="absolute inset-y-0 right-3 text-white/60 hover:text-white" aria-label={show ? 'Hide password' : 'Show password'}>
                {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>
          {error && <p className="rounded-xl bg-coral/25 p-3 text-sm text-white" role="alert">{error}</p>}
          <button className="btn-white w-full py-3.5" disabled={loading || !email || !password}>
            {loading ? <LoaderCircle className="size-4 animate-spin" /> : <Lock className="size-4" />} Sign in
          </button>
          <p className="text-center text-xs text-white/55">Staff accounts are created by the clinic admin. Forgot your password? Ask the admin to reset it.</p>
        </form>

        {USE_MOCK && <p className="mt-4 text-center text-xs text-white/45">Demo mode (no server): admin@deephysio.co.uk / admin123</p>}
      </div>
    </div>
  )
}
