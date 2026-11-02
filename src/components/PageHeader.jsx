import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { onImgError } from '../data/images'

// Inner pages ka banner: rounded photo panel + upar frosted glass card (image ke "hero" jaisa)
export default function PageHeader({ crumb, title, intro, image, children }) {
  return (
    <section className="shell pt-2">
      <div className="relative isolate overflow-hidden rounded-3xl border border-white/10">
        {image && <img src={image} alt="" onError={onImgError} className="hero-zoom absolute inset-0 -z-20 size-full object-cover" />}
        <div className="absolute inset-0 -z-10 photo-fade" />

        <div className="p-2.5 min-[400px]:p-4 sm:p-8 lg:p-10">
          <div className="glass relative isolate max-w-2xl overflow-hidden rounded-[1.25rem] p-5 min-[400px]:p-6 sm:rounded-3xl sm:p-9">
            <div className="inner-glow" />
            <p className="anim-fade-down flex flex-wrap items-center gap-1 text-sm text-white/70">
              <Link to="/" className="hover:text-white">Home</Link> <ChevronRight className="size-3.5" /> <span>{crumb || title}</span>
            </p>
            <h1 className="anim-fade-up mt-3 font-glass text-[clamp(1.4rem,7.2vw,1.875rem)] leading-[1.08] font-bold tracking-tight uppercase [overflow-wrap:anywhere] hyphens-auto [animation-delay:120ms] sm:text-5xl">{title}</h1>
            {intro && <p className="anim-fade-up mt-4 text-base leading-relaxed text-white/85 [animation-delay:240ms] sm:text-lg">{intro}</p>}
            {children}
          </div>
        </div>
      </div>
    </section>
  )
}
