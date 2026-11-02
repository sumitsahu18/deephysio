import { useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { X, Upload, LoaderCircle, ImageOff } from 'lucide-react'
import { mediaApi, uploadImage, getErrorMessage } from '../api/endpoints'
import useFetch from '../hooks/useFetch'
import Spinner from './Spinner'

// Media library se image chuno, ya nayi upload karo. onPick(url) milta hai.
export default function MediaPicker({ onPick, onClose, title = 'Choose an image' }) {
  const { data, loading, reload } = useFetch(mediaApi.list)
  const fileRef = useRef(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [url, setUrl] = useState('')

  async function onFile(e) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setBusy(true)
    setError('')
    try {
      onPick(await uploadImage(file))
    } catch (err) {
      setError(getErrorMessage(err))
      reload()
    } finally {
      setBusy(false)
    }
  }

  // Portal: glass card (backdrop-filter) ke andar 'fixed' kaam nahi karta, isliye body par render.
  // Wrapper par theme classes taaki admin ke buttons/inputs ka glass look bana rahe.
  return createPortal(
    <div className="theme-glass admin-glass fixed inset-0 z-[60] flex items-end justify-center bg-black/55 sm:items-center sm:p-4" role="dialog" aria-modal="true" aria-label={title}>
      <div className="glass-dark flex max-h-[90vh] w-full max-w-3xl flex-col rounded-t-3xl sm:rounded-3xl">
        <div className="flex items-center justify-between gap-3 border-b border-white/10 p-5">
          <h2 className="font-glass text-xl font-semibold">{title}</h2>
          <button type="button" onClick={onClose} className="grid size-9 place-items-center rounded-full bg-white/10 hover:bg-white/20" aria-label="Close">
            <X className="size-5" />
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2 border-b border-white/10 p-5">
          <button type="button" onClick={() => fileRef.current?.click()} className="btn-primary" disabled={busy}>
            {busy ? <LoaderCircle className="size-4 animate-spin" /> : <Upload className="size-4" />} Upload new image
          </button>
          <span className="text-xs text-white/50">or paste a link:</span>
          <input value={url} onChange={(e) => setUrl(e.target.value)} onKeyDown={(e) => e.key === "Enter" && e.preventDefault()} placeholder="https://…" className="input min-w-0 flex-1 py-2" />
          <button type="button" className="btn-outline py-2" disabled={!/^https?:\/\//.test(url)} onClick={() => onPick(url.trim())}>
            Use link
          </button>
          <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" onChange={onFile} />
          {error && <p className="w-full text-sm text-red-700">{error}</p>}
        </div>

        <div className="overflow-y-auto p-5">
          <p className="mb-3 text-sm text-white/60">Media library</p>
          {loading ? (
            <Spinner />
          ) : !data?.length ? (
            <p className="flex items-center gap-2 py-8 text-sm text-white/55"><ImageOff className="size-4" /> No uploaded images yet. Upload one above.</p>
          ) : (
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
              {data.map((m) => (
                <button
                  type="button"
                  key={m._id}
                  onClick={() => onPick(m.url)}
                  className="group overflow-hidden rounded-xl border border-white/15 bg-white/5 text-left transition-colors hover:border-white/50"
                  title={m.name}
                >
                  <img src={m.url} alt={m.name} className="aspect-square w-full object-cover" />
                  <span className="block truncate px-2 py-1.5 text-[11px] text-white/70">{m.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  ,
    document.body,
  )
}
