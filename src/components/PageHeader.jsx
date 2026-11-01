import Reveal from './Reveal'

export default function PageHeader({ eyebrow, title, intro }) {
  return (
    <section className="border-b border-line bg-sand">
      <Reveal className="container-x py-14 sm:py-20">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1 className="mt-3 max-w-3xl text-4xl font-semibold leading-tight sm:text-5xl">{title}</h1>
        {intro && <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">{intro}</p>}
      </Reveal>
    </section>
  )
}
