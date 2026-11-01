import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import Icon from './Icon'
import Reveal from './Reveal'

export default function ServiceCard({ service, delay = 0 }) {
  return (
    <Reveal delay={delay}>
      <Link
        to={`/services/${service.slug}`}
        className="group card flex h-full flex-col p-6 transition duration-300 hover:-translate-y-1 hover:border-pine-500 hover:shadow-[0_18px_40px_-24px_rgba(31,92,85,0.45)]"
      >
        <span className="grid size-12 place-items-center rounded-xl bg-pine-50 text-pine-700 transition group-hover:bg-pine-700 group-hover:text-white">
          <Icon name={service.icon} className="size-6" strokeWidth={1.75} />
        </span>
        <h3 className="mt-5 text-xl font-semibold">{service.title}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{service.summary}</p>
        <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-pine-700">
          Learn more <ArrowRight className="size-4 transition group-hover:translate-x-1" />
        </span>
      </Link>
    </Reveal>
  )
}
