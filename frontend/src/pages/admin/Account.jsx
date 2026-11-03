import { useState } from 'react'
import { KeyRound, LoaderCircle, CheckCircle2, Eye, EyeOff } from 'lucide-react'
import { authApi, getErrorMessage } from '../../api/endpoints'
import { useAuth } from '../../context/AuthContext'

// My account: har user (Admin ya Staff) apna password khud badle.
// Server par: purana password check, naya min 10 (letters + numbers), baaki devices se logout.
export default function Account() {
  const { user } = useAuth()
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirm: '' })
  const [show, setShow] = useState(false)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState({})
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  async function save(e) {
    e.preventDefault()
    setMsg({})
    if (form.newPassword.length < 10 || !/[a-zA-Z]/.test(form.newPassword) || !/\d/.test(form.newPassword))
      return setMsg({ type: 'err', text: 'New password must be at least 10 characters, with letters and numbers.' })
    if (form.newPassword !== form.confirm) return setMsg({ type: 'err', text: 'The new passwords do not match.' })
    setSaving(true)
    try {
      await authApi.changePassword({ currentPassword: form.currentPassword, newPassword: form.newPassword })
      setForm({ currentPassword: '', newPassword: '', confirm: '' })
      setMsg({ type: 'ok', text: 'Password changed. You have been signed out on your other devices.' })
    } catch (err) {
      setMsg({ type: 'err', text: getErrorMessage(err) })
    } finally {
      setSaving(false)
    }
  }

  const field = (k, label, auto) => (
    <div>
      <label className="label" htmlFor={k}>{label}</label>
      <input id={k} type={show ? 'text' : 'password'} className="input" value={form[k]} onChange={set(k)} autoComplete={auto} required />
    </div>
  )

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="font-glass text-3xl font-semibold">My account</h1>
        <p className="mt-1 text-muted">
          Signed in as <strong className="text-ink">{user?.email}</strong> · {user?.role === 'admin' ? 'Admin' : 'Staff'}
        </p>
      </div>

      <form onSubmit={save} className="card space-y-4 p-5 sm:p-6">
        <h2 className="flex items-center gap-2 text-lg font-semibold"><KeyRound className="size-5 text-pine-700" /> Change password</h2>
        {field('currentPassword', 'Current password', 'current-password')}
        {field('newPassword', 'New password (min 10 characters, letters and numbers)', 'new-password')}
        {field('confirm', 'Repeat new password', 'new-password')}
        <label className="flex items-center gap-2 text-sm text-muted">
          <input type="checkbox" checked={show} onChange={(e) => setShow(e.target.checked)} className="size-4 accent-pine-700" />
          {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />} Show passwords
        </label>
        {msg.text && (
          <p className={`flex items-center gap-2 rounded-xl p-3 text-sm ${msg.type === 'ok' ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-700'}`} role="status">
            {msg.type === 'ok' && <CheckCircle2 className="size-4" />} {msg.text}
          </p>
        )}
        <button className="btn-primary w-full sm:w-auto" disabled={saving}>
          {saving ? <LoaderCircle className="size-4 animate-spin" /> : <KeyRound className="size-4" />} Change password
        </button>
      </form>
    </div>
  )
}
