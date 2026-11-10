import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Bento Panel Scroll Scale Animation Module
 * Gradually expands the dark bento container as it scrolls into viewport unconditionally.
 */
export function initPanelScale() {
  const panel = document.querySelector('[data-anim="panel-scale"]')
  if (!panel) return

  gsap.fromTo(
    panel,
    {
      scale: 0.93,
      borderRadius: '64px',
    },
    {
      scale: 1,
      borderRadius: '48px',
      ease: 'power2.out',
      scrollTrigger: {
        trigger: panel,
        start: 'top 92%',
        end: 'top 55%',
        scrub: 1.2,
      },
    },
  )
}
