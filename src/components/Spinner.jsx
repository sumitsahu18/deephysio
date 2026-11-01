import { LoaderCircle } from 'lucide-react'

export default function Spinner({ label = 'Loading…', className = '' }) {
  return (
    <div className={`flex items-center justify-center gap-2 py-16 text-sm text-muted ${className}`} role="status">
      <LoaderCircle className="size-5 animate-spin" />
      {label}
    </div>
  )
}
