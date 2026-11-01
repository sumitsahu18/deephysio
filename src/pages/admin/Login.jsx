import { useState } from 'react'
import { Navigate, useLocation, useNavigate, Link } from 'react-router-dom'
import { Lock, Eye, EyeOff, LoaderCircle, ArrowLeft, ShieldCheck, UserCog, Headset } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useSite } from '../../context/SiteContext'
import { USE_MOCK, getErrorMessage } from '../../api/endpoints'
import Logo from '../../components/Logo'

// Demo logins (sirf mock mode). Backend lagne ke baad ye box apne aap hat jayega.
const DEMO = {
  admin: { email: 'admin@deephysio.co.uk', password: 'admin123', label: 'Admin', note: 'Full access: users, site settings, delete', Icon: UserCog },
  editor: { email: 'editor@deephysio.co.uk', password: 'editor123', label: 'Staff', note: 'Reception: text, hours, services, team, FAQs, enquiries', Icon: Headset },
}

export default function Login() {
  const { login, isAuthenticated } = useAuth()
  const { settings } = useSite()
  const navigate = useNavigate()
  const location = useLocation()
  const [role, setRole] = useState('admin')
  const [email, setEmail] = useState(USE_MOCK ? DEMO.admin.email : '')
  const [password, setPassword] = useState(USE_MOCK ? DEMO.admin.password : '')
  const [show, setShow] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (isAuthenticated) return <Navigate to="/admin" replace />

  function pick(r) {
    setRole(r)
    setError('')
    if (USE_MOCK) {
      setEmail(DEMO[r].email)
      setPassword(DEMO[r].password)
    }
  }

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
    <div className="grid min-h-dvh place-items-center bg-sand px-4 py-10">
      <div className="w-full max-w-md">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm font-semibold text-pine-700 transition-colors hover:text-pine-900">
          <ArrowLeft className="size-4" /> Back to website
        </Link>

        <div className="mt-6 flex flex-col items-center text-center">
          <Logo />
          <h1 className="mt-5 text-2xl font-bold text-ink sm:text-3xl">Staff &amp; Admin Sign In</h1>
          <p className="mt-1 text-sm text-muted">{settings.clinicName} website management portal</p>
        </div>

        <form onSubmit={onSubmit} className="card mt-6 space-y-4 p-5 shadow-sm sm:p-7">
          {USE_MOCK && (
            <>
              {/* Admin / Staff demo switch */}
              <div className="grid grid-cols-2 gap-2 rounded-xl bg-sand p-1.5" role="tablist" aria-label="Choose login type">
                {Object.entries(DEMO).map(([key, d]) => (
                  <button
                    key={key}
                    type="button"
                    role="tab"
                    aria-selected={role === key}
                    onClick={() => pick(key)}
                    className={`flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-bold transition-colors ${
                      role === key ? 'bg-pine-700 text-white shadow-sm' : 'text-ink hover:bg-white'
                    }`}
                  >
                    <d.Icon className="size-4" /> {d.label} demo
                  </button>
                ))}
              </div>
              <div className="flex items-start gap-2 rounded-xl border border-pine-100 bg-pine-50 p-3 text-xs text-pine-900">
                <ShieldCheck className="mt-0.5 size-4 shrink-0 text-pine-700" />
                <span>
                  <strong>{DEMO[role].label}</strong> demo details are filled in. Click <strong>Sign in</strong>.
                  <span className="mt-0.5 block text-pine-900/75">{DEMO[role].note}</span>
                </span>
              </div>
            </>
          )}

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
              <button type="button" onClick={() => setShow((v) => !v)} className="absolute inset-y-0 right-3 text-muted hover:text-ink" aria-label={show ? 'Hide password' : 'Show password'}>
                {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>
          {error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          <button className="btn-primary w-full py-3.5" disabled={loading}>
            {loading ? <LoaderCircle className="size-4 animate-spin" /> : <Lock className="size-4" />}
            {USE_MOCK ? `Sign in as ${DEMO[role].label}` : 'Sign in'}
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-muted">Only authorised clinic staff can access this area.</p>
      </div>
    </div>
  )
}
