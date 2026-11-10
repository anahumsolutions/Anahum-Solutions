import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Stat Counter & Floating Card Physics Module (Section 7.1)
 * Animates numeral count-up and continuous floating physics unconditionally.
 */
export function initStatCounter() {
  const cardAccent = document.querySelector('.stat-card--accent')
  const cardSurface = document.querySelector('.stat-card--surface')
  const numberEl = document.querySelector('.stat-card--accent .stat-card__number')

  if (!cardAccent || !cardSurface) return

  // Staggered entrance from sides
  gsap.fromTo(
    cardAccent,
    { x: -50, opacity: 0, scale: 0.9 },
    {
      x: 0,
      opacity: 1,
      scale: 1,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: cardAccent,
        start: 'top 88%',
        toggleActions: 'play none none none',
      },
    },
  )

  gsap.fromTo(
    cardSurface,
    { x: 50, opacity: 0, scale: 0.9 },
    {
      x: 0,
      opacity: 1,
      scale: 1,
      duration: 0.8,
      delay: 0.15,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: cardSurface,
        start: 'top 88%',
        toggleActions: 'play none none none',
      },
    },
  )

  // Number Counter (0% -> 98%)
  if (numberEl) {
    const counter = { val: 0 }
    ScrollTrigger.create({
      trigger: cardAccent,
      start: 'top 88%',
      onEnter: () => {
        gsap.to(counter, {
          val: 98,
          duration: 1.5,
          ease: 'power2.out',
          onUpdate: () => {
            numberEl.textContent = `${Math.round(counter.val)}%`
          },
        })
      },
    })
  }

  // Continuous floating oscillation
  gsap.to(cardAccent, {
    y: '+=8',
    duration: 3.0,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
  })

  gsap.to(cardSurface, {
    y: '-=8',
    duration: 3.6,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
    delay: 0.4,
  })
}
