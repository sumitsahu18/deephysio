import { useState } from 'react'
import { ImagePlus, X } from 'lucide-react'
import MediaPicker from './MediaPicker'

// Image field: preview + "Change image" (upload / library / link) + Remove
export default function MediaInput({ id, value, onChange, fit = 'cover' }) {
  const [picking, setPicking] = useState(false)

  return (
    <div className="flex items-center gap-4">
      <div className="relative grid size-24 shrink-0 place-items-center overflow-hidden rounded-xl border border-line bg-sand text-[11px] text-muted">
        {value ? <img src={value} alt="" className={`size-full ${fit === 'contain' ? 'object-contain p-2' : 'object-cover'}`} /> : 'No image'}
      </div>
      <div className="flex flex-wrap gap-2">
        <button id={id} type="button" onClick={() => setPicking(true)} className="btn-outline py-2">
          <ImagePlus className="size-4" /> {value ? 'Change image' : 'Add image'}
        </button>
        {value && (
          <button type="button" onClick={() => onChange('')} className="btn py-2 text-red-700 hover:bg-red-50">
            <X className="size-4" /> Remove
          </button>
        )}
      </div>
      {picking && (
        <MediaPicker
          onClose={() => setPicking(false)}
          onPick={(url) => {
            onChange(url)
            setPicking(false)
          }}
        />
      )}
    </div>
  )
}
