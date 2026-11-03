import { useSite } from '../context/SiteContext'
import { onImgError } from '../data/images'

// Poori website ke peeche ki layer (position: fixed -> scroll par kabhi nahi hilti):
//   1) clinic ki photo (Admin > Page content > Home > Website background photo)
//   2) halka off-white overlay (light theme - text padhne layak rahe)
//   3) dheere chalte soft sky / yellow gradient blobs
// Upar ke glass cards inhe blur karke dikhate hain = "Fluid Glassmorphism"
export default function GlassBackground() {
  const { pages } = useSite()
  const img = pages.home?.backgroundImage

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-deep" aria-hidden="true">
      {img && <img src={img} alt="" onError={onImgError} className="absolute inset-0 size-full scale-105 object-cover opacity-20 blur-[2px]" />}
      <div className="absolute inset-0 bg-[color-mix(in_srgb,var(--color-deep)_82%,transparent)]" />

      <div className="aurora-blob drift-a -top-[10%] -left-[8%] size-[55vmax] bg-[radial-gradient(circle,var(--color-violet)_0%,transparent_65%)] opacity-100" />
      <div className="aurora-blob drift-b top-[20%] -right-[15%] size-[50vmax] bg-[radial-gradient(circle,var(--color-violet)_0%,transparent_65%)] opacity-90" />
      <div className="aurora-blob drift-c -bottom-[20%] left-[25%] size-[48vmax] bg-[radial-gradient(circle,var(--color-coral)_0%,transparent_65%)] opacity-25" />
    </div>
  )
}
