import { useRef, useState } from 'react'
import { Upload, X, LoaderCircle } from 'lucide-react'
import { uploadImage, getErrorMessage } from '../api/endpoints'

// Image field: upload karo YA URL paste karo, preview ke saath (PDF: editor "page copy and media" edit kare)
export default function MediaInput({ id, value, onChange }) {
  const fileRef = useRef(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function onFile(e) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    if (!file.type.startsWith('image/')) return setError('Please choose an image file.')
    setBusy(true)
    setError('')
    try {
      onChange(await uploadImage(file))
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex gap-3">
      <div className="relative grid size-20 shrink-0 place-items-center overflow-hidden rounded-lg border border-line bg-sand text-[10px] text-muted">
        {value ? <img src={value} alt="" className="size-full object-cover" /> : 'No image'}
      </div>
      <div className="min-w-0 flex-1 space-y-2">
        <input
          id={id}
          className="input py-2.5"
          value={value?.startsWith('data:') ? '(uploaded image)' : value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste an image URL or upload"
          readOnly={value?.startsWith('data:')}
        />
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => fileRef.current?.click()} className="btn-outline py-2" disabled={busy}>
            {busy ? <LoaderCircle className="size-4 animate-spin" /> : <Upload className="size-4" />} Upload image
          </button>
          {value && (
            <button type="button" onClick={() => onChange('')} className="btn py-2 text-red-700 hover:bg-red-50">
              <X className="size-4" /> Remove
            </button>
          )}
        </div>
        {error && <p className="text-xs text-red-700">{error}</p>}
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFile} />
      </div>
    </div>
  )
}
