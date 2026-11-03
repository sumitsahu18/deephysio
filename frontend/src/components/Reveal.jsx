import { useEffect, useRef } from 'react'

// Scroll karne par element animate hoke aata hai (koi library nahi, IntersectionObserver)
// anim: 'up' (default) | 'down' | 'left' | 'right' | 'zoom' | 'fade'
export default function Reveal({ as: Tag = 'div', anim = 'up', delay = 0, className = '', children, ...rest }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('is-visible')
          io.disconnect()
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <Tag ref={ref} data-anim={anim} className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms` }} {...rest}>
      {children}
    </Tag>
  )
}
