import { gsap } from 'gsap'

/**
 * Fade-Up Animation Module
 * Uses IntersectionObserver to trigger GPU-friendly slide+fade reveals without ScrollTrigger overhead.
 */
export function initFadeUp() {
  const elements = Array.from(
    document.querySelectorAll('#mainContent [data-anim="fade-up"]:not(.hero-section *)'),
  )
  if (!elements.length) return

  if (!('IntersectionObserver' in window)) return

  const revealed = new WeakSet()

  function reveal(el, instant = false) {
    if (revealed.has(el)) return
    revealed.add(el)

    if (instant) {
      gsap.set(el, { opacity: 1, y: 0, clearProps: 'transform,willChange' })
      return
    }

    const delay = parseFloat(el.getAttribute('data-delay')) || 0
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 0.75,
      delay,
      ease: 'power3.out',
      overwrite: 'auto',
      clearProps: 'transform,willChange',
    })
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          reveal(entry.target, false)
          observer.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.05, rootMargin: '0px 0px -8% 0px' },
  )

  elements.forEach((el) => {
    const rect = el.getBoundingClientRect()
    if (rect.height > 0 && rect.bottom < 0) {
      reveal(el, true)
      return
    }
    gsap.set(el, { opacity: 0, y: 36, willChange: 'transform, opacity' })
    observer.observe(el)
  })
}
