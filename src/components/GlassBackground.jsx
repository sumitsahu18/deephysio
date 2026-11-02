import { useSite } from '../context/SiteContext'
import { onImgError } from '../data/images'

// Poori website ke peeche ki layer (position: fixed -> scroll par kabhi nahi hilti):
//   1) clinic ki photo (Admin > Page content > Home > Website background photo)
//   2) gehra teal overlay (text padhne layak rahe)
//   3) dheere chalte teal / purple / coral gradient blobs
// Upar ke glass cards inhe blur karke dikhate hain = "Fluid Glassmorphism"
export default function GlassBackground() {
  const { pages } = useSite()
  const img = pages.home?.backgroundImage

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-deep" aria-hidden="true">
      {img && <img src={img} alt="" onError={onImgError} className="absolute inset-0 size-full scale-105 object-cover opacity-45 blur-[2px]" />}
      <div className="absolute inset-0 bg-[linear-gradient(160deg,color-mix(in_srgb,var(--color-deep)_84%,transparent)_0%,color-mix(in_srgb,var(--color-deep)_70%,transparent)_45%,color-mix(in_srgb,color-mix(in_srgb,var(--color-deep)_70%,#14284a)_80%,transparent)_100%)]" />

      <div className="aurora-blob drift-a -top-[10%] -left-[8%] size-[55vmax] bg-[radial-gradient(circle,var(--color-aqua)_0%,transparent_65%)]" />
      <div className="aurora-blob drift-b top-[20%] -right-[15%] size-[50vmax] bg-[radial-gradient(circle,var(--color-violet)_0%,transparent_65%)]" />
      <div className="aurora-blob drift-c -bottom-[20%] left-[25%] size-[48vmax] bg-[radial-gradient(circle,var(--color-coral)_0%,transparent_65%)] opacity-45" />

      {/* Halka grain/vignette taaki gradient "plastic" na lage */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_0%,transparent_40%,rgba(0,0,0,0.4)_100%)]" />
    </div>
  )
}
