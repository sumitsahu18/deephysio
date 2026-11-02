import Reveal from './Reveal'

// Section ka chhota heading: eyebrow + bada title (+ optional right side cheez)
export default function SectionTitle({ eyebrow, title, children, className = '' }) {
  return (
    <Reveal className={`flex flex-wrap items-end justify-between gap-4 ${className}`}>
      <div>
        {eyebrow && <p className="eyebrow-glass">{eyebrow}</p>}
        <h2 className="mt-2 font-glass text-2xl font-semibold tracking-tight text-white sm:text-3xl">{title}</h2>
      </div>
      {children}
    </Reveal>
  )
}
