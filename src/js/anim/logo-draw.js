import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Logo Draw Animation (What We Do section)
 * - SVG stroke draw-on for both chevron lines, then dot fade-in/scale.
 * - Slow breathing loop on the dot after entrance, paused when out of view.
 * - No hover, click, tilt, glow, shine or ripple effect.
 */
export function initLogoDraw() {
  const container = document.querySelector('[data-logo-draw]')
  if (!container) return

  const outer = container.querySelector('.logo-draw__outer')
  const inner = container.querySelector('.logo-draw__inner')
  const dot = container.querySelector('.logo-draw__dot')

  if (!outer || !inner || !dot) return

  // Measure path lengths for stroke-dasharray draw technique
  const outerLen = outer.getTotalLength()
  const innerLen = inner.getTotalLength()

  // Set hidden starting state: lines fully undrawn, dot invisible + scaled down
  gsap.set(outer, {
    strokeDasharray: outerLen,
    strokeDashoffset: outerLen,
    opacity: 0,
  })
  gsap.set(inner, {
    strokeDasharray: innerLen,
    strokeDashoffset: innerLen,
    opacity: 0,
  })
  gsap.set(dot, {
    opacity: 0,
    scale: 0.85,
    transformOrigin: '50% 50%',
  })

  // Build entrance timeline (play once on scroll)
  const tl = gsap.timeline({
    paused: true,
    defaults: { ease: 'power2.inOut' },
  })

  // Outer chevron draws in
  tl.to(outer, { opacity: 1, duration: 0.01 })
  tl.to(
    outer,
    {
      strokeDashoffset: 0,
      duration: 1.3,
      ease: 'power2.inOut',
    },
    '<',
  )

  // Inner chevron starts 0.45s after outer begins
  tl.to(inner, { opacity: 1, duration: 0.01 }, 0.45)
  tl.to(
    inner,
    {
      strokeDashoffset: 0,
      duration: 1.0,
      ease: 'power2.inOut',
    },
    0.45,
  )

  // Dot appears at 1.5s
  tl.to(
    dot,
    {
      opacity: 1,
      scale: 1,
      duration: 0.7,
      ease: 'power2.out',
    },
    1.5,
  )

  // Breathing loop — defined as a separate tween, started after entrance
  let breathTween = null

  function startBreath() {
    if (breathTween) return
    breathTween = gsap.to(dot, {
      scale: 1.03,
      opacity: 0.9,
      duration: 2.5,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
      transformOrigin: '50% 50%',
    })
  }

  function pauseBreath() {
    if (breathTween) breathTween.pause()
  }

  function resumeBreath() {
    if (breathTween) breathTween.resume()
  }

  // ScrollTrigger: play entrance once when top of container hits 75% viewport
  ScrollTrigger.create({
    trigger: container,
    start: 'top 75%',
    once: true,
    onEnter: () => {
      tl.play().then(() => {
        startBreath()
      })
    },
  })

  // Pause/resume breathing loop when logo scrolls out of / back into view
  ScrollTrigger.create({
    trigger: container,
    start: 'top bottom',
    end: 'bottom top',
    onLeave: pauseBreath,
    onLeaveBack: pauseBreath,
    onEnter: resumeBreath,
    onEnterBack: resumeBreath,
  })
}
