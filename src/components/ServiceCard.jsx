import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import Icon from './Icon'
import Reveal from './Reveal'
import { onImgError } from '../data/images'

// Mingara service card: photo, number badge (01), title, ek line, "Read More"
// Hover: card upar uthta hai, photo zoom hoti hai, badge ghoomta hai
export default function ServiceCard({ service, index = 0, delay = 0 }) {
  const num = String(index + 1).padStart(2, '0')
  return (
    <Reveal delay={delay}>
      <Link
        to={`/services/${service.slug}`}
        className="group flex h-full flex-col overflow-hidden rounded-md bg-white shadow-[0_10px_35px_-18px_rgba(27,68,103,0.35)] transition duration-500 hover:-translate-y-2 hover:shadow-[0_28px_50px_-20px_rgba(27,68,103,0.5)]"
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-pine-700">
          <div className="absolute inset-0 grid place-items-center">
            <Icon name={service.icon} className="size-14 text-white/70" strokeWidth={1.25} />
          </div>
          {service.image && (
            <img
              src={service.image}
              alt={service.title}
              onError={onImgError}
              loading="lazy"
              className="relative size-full object-cover transition duration-700 group-hover:scale-110"
            />
          )}
          <div className="absolute inset-0 bg-pine-900/0 transition duration-500 group-hover:bg-pine-900/25" />
        </div>
        <div className="relative flex flex-1 flex-col px-6 pt-11 pb-7">
          <span className="absolute -top-8 left-6 grid size-16 place-items-center rounded-full border-4 border-white bg-clay text-xl font-black text-white shadow-md transition duration-500 group-hover:rotate-[360deg] group-hover:bg-pine-700">
            {num}
          </span>
          <h3 className="text-xl text-pine-900 transition group-hover:text-pine-700">{service.title}</h3>
          <p className="mt-2 flex-1 text-[15px] leading-relaxed text-muted">{service.summary}</p>
          <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold tracking-wide text-pine-700 uppercase">
            Read More <ArrowRight className="size-4 transition group-hover:translate-x-1.5" />
          </span>
        </div>
      </Link>
    </Reveal>
  )
}
