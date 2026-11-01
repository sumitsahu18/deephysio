import { Link } from 'react-router-dom'
import { onImgError } from '../data/images'

// Inner pages ka banner: photo (slow zoom) + blue overlay + breadcrumb + title
export default function PageHeader({ crumb, title, intro, image }) {
  return (
    <section className="relative isolate overflow-hidden bg-pine-900">
      {image && <img src={image} alt="" onError={onImgError} className="hero-zoom absolute inset-0 -z-20 size-full object-cover" />}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(27,68,103,0.92),rgba(51,108,155,0.72))]" />
      <div className="container-x py-16 text-white sm:py-24">
        <p className="anim-fade-down text-sm text-white/75">
          <Link to="/" className="hover:text-white">Home</Link> <span className="mx-1.5">/</span> {crumb || title}
        </p>
        <h1 className="anim-fade-up mt-4 max-w-4xl text-4xl leading-tight [animation-delay:150ms] sm:text-6xl">{title}</h1>
        {intro && <p className="anim-fade-up mt-5 max-w-2xl text-lg leading-relaxed text-white/85 [animation-delay:300ms]">{intro}</p>}
      </div>
    </section>
  )
}
