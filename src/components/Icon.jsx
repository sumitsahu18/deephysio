import { Hand, Move, Dumbbell, Zap, ArrowUpDown, ScanLine, HeartPulse } from 'lucide-react'

// Services ke icon naam DB mein string ki tarah save hote hain ("Hand", "Zap"...)
export const SERVICE_ICONS = { Hand, Move, Dumbbell, Zap, ArrowUpDown, ScanLine, HeartPulse }

export default function Icon({ name, ...props }) {
  const C = SERVICE_ICONS[name] || HeartPulse
  return <C {...props} />
}
