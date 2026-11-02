import { useState } from 'react'
import { Navigate, useLocation, useNavigate, Link } from 'react-router-dom'
import { Lock, Eye, EyeOff, LoaderCircle, ArrowLeft, ShieldCheck, UserCog, Headset } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useSite } from '../../context/SiteContext'
import { USE_MOCK, getErrorMessage } from '../../api/endpoints'
import Logo from '../../components/Logo'
import GlassBackground from '../../components/GlassBackground'

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
    <div className="relative grid min-h-dvh place-items-center px-4 py-10 text-white">
      <GlassBackground />
      <div className="w-full max-w-md">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm font-semibold text-white/80 transition-colors hover:text-white">
          <ArrowLeft className="size-4" /> Back to website
        </Link>

        <div className="mt-6 flex flex-col items-center text-center">
          <Logo light />
          <h1 className="mt-5 font-glass text-2xl font-bold sm:text-3xl">Staff &amp; Admin Sign In</h1>
          <p className="mt-1 text-sm text-white/65">{settings.clinicName} website management portal</p>
        </div>

        <form onSubmit={onSubmit} className="glass relative isolate mt-6 space-y-4 overflow-hidden rounded-3xl p-5 sm:p-7">
          {USE_MOCK && (
            <>
              {/* Admin / Staff demo switch */}
              <div className="grid grid-cols-2 gap-2 rounded-full border border-white/15 bg-white/5 p-1.5" role="tablist" aria-label="Choose login type">
                {Object.entries(DEMO).map(([key, d]) => (
                  <button
                    key={key}
                    type="button"
                    role="tab"
                    aria-selected={role === key}
                    onClick={() => pick(key)}
                    className={`flex items-center justify-center gap-2 rounded-full py-2.5 text-sm font-bold transition-colors ${
                      role === key ? 'bg-white text-deep shadow-[0_0_20px_-4px_rgba(255,255,255,0.6)]' : 'text-white/75 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <d.Icon className="size-4" /> {d.label} demo
                  </button>
                ))}
              </div>
              <div className="flex items-start gap-2 rounded-xl border border-white/15 bg-white/10 p-3 text-xs text-white/90">
                <ShieldCheck className="mt-0.5 size-4 shrink-0 text-aqua-300" />
                <span>
                  <strong>{DEMO[role].label}</strong> demo details are filled in. Click <strong>Sign in</strong>.
                  <span className="mt-0.5 block text-white/65">{DEMO[role].note}</span>
                </span>
              </div>
            </>
          )}

          <div>
            <label htmlFor="email" className="label-glass">Email</label>
            <input id="email" type="email" required className="input-glass" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" />
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
          {error && <p className="rounded-xl bg-coral/25 p-3 text-sm text-white">{error}</p>}
          <button className="btn-white w-full py-3.5" disabled={loading}>
            {loading ? <LoaderCircle className="size-4 animate-spin" /> : <Lock className="size-4" />}
            {USE_MOCK ? `Sign in as ${DEMO[role].label}` : 'Sign in'}
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-white/55">Only authorised clinic staff can access this area.</p>
      </div>
    </div>
  )
}
