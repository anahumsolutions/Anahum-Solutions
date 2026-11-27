import { gsap } from 'gsap'

/**
 * Hero Entrance Animation Module
 * Smooth blurry-to-sharp headline reveal, subtitle fade, nav and service nodes entrance.
 * Uses .hero-anim-ready pre-hide from <head> so there is no visible-to-hidden flicker.
 */
export function initHeroEntrance() {
  const hero = document.getElementById('hero')
  if (!hero) {
    document.documentElement.classList.remove('hero-anim-ready')
    return
  }

  const navPills = hero.querySelectorAll('.hero__nav-pill, .hero__logo')
  const titleLines = hero.querySelectorAll('.hero__title .l1, .hero__title .l2')
  const subtitle = hero.querySelector('.hero__subtitle')
  const nodes = hero.querySelectorAll('.hero__node')

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

  // Set starting states explicitly before clearing the CSS pre-hide class
  if (titleLines.length) {
    gsap.set(titleLines, {
      y: 28,
      opacity: 0,
      filter: 'blur(10px)',
      willChange: 'transform, opacity, filter',
    })
  }
  if (subtitle) {
    gsap.set(subtitle, { y: 16, opacity: 0, willChange: 'transform, opacity' })
  }
  if (navPills.length) {
    gsap.set(navPills, { y: -12, opacity: 0, willChange: 'transform, opacity' })
  }
  if (nodes.length) {
    gsap.set(nodes, { y: 18, opacity: 0, scale: 0.96, willChange: 'transform, opacity' })
  }

  document.documentElement.classList.remove('hero-anim-ready')

  // 1. Headline blur-to-sharp reveal (smooth, crisp pacing)
  if (titleLines.length) {
    tl.to(
      titleLines,
      {
        y: 0,
        opacity: 1,
        filter: 'blur(0px)',
        duration: 0.8,
        stagger: 0.1,
        clearProps: 'transform,filter,willChange',
      },
      0.04,
    )
  }

  // 2. Nav pills & logo fade in smoothly alongside headline
  if (navPills.length) {
    tl.to(
      navPills,
      {
        y: 0,
        opacity: 1,
        duration: 0.45,
        stagger: 0.06,
        clearProps: 'transform,willChange',
      },
      0.06,
    )
  }

  // 3. Subtitle enters right as second headline line clears
  if (subtitle) {
    tl.to(
      subtitle,
      {
        y: 0,
        opacity: 1,
        duration: 0.5,
        clearProps: 'transform,willChange',
      },
      0.34,
    )
  }

  // 4. Service nodes glide in smoothly without long dead delay
  if (nodes.length) {
    tl.to(
      nodes,
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.55,
        stagger: 0.07,
        ease: 'power3.out',
        clearProps: 'transform,willChange',
      },
      0.4,
    )
  }
}
