import { Link } from 'react-router-dom'
import { ArrowUpRight, ShieldCheck } from 'lucide-react'
import Icon from './Icon'
import Reveal from './Reveal'
import { onImgError } from '../data/images'

// Glass service card. tone: 'glass' (frosted) | 'aurora' (teal->purple) | 'sunset' (coral)
// variant: 'compact' (image jaisa: icon + text + pill) | 'photo' (upar photo ke saath)
export default function ServiceCard({ service, tone = 'glass', variant = 'compact', delay = 0, className = '', cta = 'Read more' }) {
  const toneCls = tone === 'aurora' ? 'grad-aurora border border-white/25' : tone === 'sunset' ? 'grad-sunset border border-white/25' : 'glass'
  const colored = tone !== 'glass'

  return (
    <Reveal delay={delay} className={`h-full ${className}`}>
      <Link
        to={`/services/${service.slug}`}
        className={`glow-hover group relative isolate flex h-full flex-col overflow-hidden rounded-3xl backdrop-blur-xl ${toneCls}`}
      >
        {!colored && <div className="inner-glow opacity-0 transition-opacity duration-500 group-hover:opacity-70" />}

        {variant === 'photo' && (
          <div className="relative aspect-[16/10] overflow-hidden">
            <div className="absolute inset-0 grid place-items-center bg-white/5">
              <Icon name={service.icon} className="size-12 text-white/50" strokeWidth={1.25} />
            </div>
            {service.image && (
              <img src={service.image} alt={service.title} onError={onImgError} loading="lazy" className="relative size-full object-cover transition-transform duration-700 group-hover:scale-105" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-deep/70 via-transparent to-transparent" />
          </div>
        )}

        <div className="flex flex-1 flex-col p-6">
          {variant === 'compact' && (
            <span className={`grid size-11 place-items-center rounded-full border ${colored ? 'border-white/40 bg-white/20' : 'border-white/20 bg-white/10'} text-white`}>
              <Icon name={service.icon} className="size-5" />
            </span>
          )}
          <h3 className={`${variant === 'compact' ? 'mt-5' : ''} font-glass text-xl font-semibold text-white`}>{service.title}</h3>
          
          {service.provider && (
            <div className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-white/20 bg-white/10 px-2.5 py-1 text-xs font-medium text-white/90">
              <ShieldCheck className="size-3.5 shrink-0 text-aqua-300" />
              <span className="line-clamp-1">{service.provider}</span>
            </div>
          )}

          <p className={`mt-2 flex-1 text-[15px] leading-relaxed ${colored ? 'text-white/90' : 'text-white/70'}`}>{service.summary}</p>

          {service.helpsWith?.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {service.helpsWith.slice(0, 3).map((h) => (
                <span key={h} className="rounded-md border border-white/15 bg-white/10 px-2 py-0.5 text-[11px] text-white/80">
                  {h}
                </span>
              ))}
              {service.helpsWith.length > 3 && (
                <span className="rounded-md border border-white/15 bg-white/10 px-2 py-0.5 text-[11px] text-white/60">
                  +{service.helpsWith.length - 3} more
                </span>
              )}
            </div>
          )}

          <span
            className={`mt-5 inline-flex items-center gap-1.5 self-start rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              colored ? 'bg-white text-deep group-hover:bg-white/90' : 'border border-white/25 bg-white/10 text-white group-hover:bg-white/20'
            }`}
          >
            {cta} <ArrowUpRight className="size-4" />
          </span>
        </div>
      </Link>
    </Reveal>
  )
}
