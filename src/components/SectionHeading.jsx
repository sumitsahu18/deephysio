import Reveal from './Reveal'

export default function SectionHeading({ eyebrow, title, intro, center = false }) {
  return (
    <Reveal className={`max-w-2xl ${center ? 'mx-auto text-center' : ''}`}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">{title}</h2>
      {intro && <p className="mt-4 text-base leading-relaxed text-muted">{intro}</p>}
    </Reveal>
  )
}
