import { gsap } from 'gsap'

/**
 * Blur-To-Sharp Reveal Animation Module
 * Smoothly reveals headings and text blocks from soft blur to crisp clarity on scroll,
 * promoting compositor layers only during the active tween and clearing them on completion.
 */
export function initBlurReveal() {
  const elements = Array.from(document.querySelectorAll('[data-anim="blur-reveal"]'))
  if (!elements.length) return

  if (!('IntersectionObserver' in window)) return

  const revealed = new WeakSet()

  function reveal(el, instant = false) {
    if (revealed.has(el)) return
    revealed.add(el)

    if (instant) {
      gsap.set(el, {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        clearProps: 'transform,filter,willChange',
      })
      return
    }

    const delay = parseFloat(el.getAttribute('data-delay')) || 0
    gsap.to(el, {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      duration: 0.85,
      delay,
      ease: 'power3.out',
      overwrite: 'auto',
      clearProps: 'transform,filter,willChange',
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
    gsap.set(el, {
      opacity: 0,
      y: 34,
      filter: 'blur(11px)',
      willChange: 'transform, opacity, filter',
    })
    observer.observe(el)
  })
}
