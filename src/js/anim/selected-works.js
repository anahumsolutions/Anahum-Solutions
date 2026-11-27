import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { initGlassButton } from './glass-button.js'

gsap.registerPlugin(ScrollTrigger)

/**
 * Format a 1-based card index as "01 / 06".
 * @param {number} i      0-based index
 * @param {number} total  Total number of cards
 */
function formatCounter(i, total) {
  const n = String(i + 1).padStart(2, '0')
  const t = String(total).padStart(2, '0')
  return `${n} / ${t}`
}

/**
 * Update counter text cleanly on index change and smoothly scale progress bar from 1/total to 1.
 * @param {HTMLElement} counterEl
 * @param {HTMLElement} barEl
 * @param {number} progress  0 -> 1
 * @param {number} total     Card count
 */
function updateHUD(counterEl, barEl, progress, total) {
  if (!counterEl || !barEl || total <= 0) return
  const clamped = Math.min(1, Math.max(0, progress))
  const idx = Math.min(total - 1, Math.round(clamped * (total - 1)))
  const label = formatCounter(idx, total)
  if (counterEl.textContent !== label) {
    counterEl.textContent = label
  }
  const minScale = 1 / total
  const scaleVal = minScale + clamped * (1 - minScale)
  gsap.set(barEl, { scaleX: scaleVal })
}

/**
 * Card 3D tilt + glare on pointer hover (desktop only).
 * Sets per-card transformPerspective so 3D tilt and badge Z-pop render with depth.
 * @param {HTMLElement[]} cards
 * @returns {() => void}  cleanup
 */
function initCardHover(cards) {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return () => {}
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {}

  const MAX_TILT = 6 // degrees
  const LIFT = -4 // px y lift
  const cleanups = []

  const clamp = (v, min, max) => Math.min(max, Math.max(min, v))

  cards.forEach((card) => {
    gsap.set(card, { transformPerspective: 900 })

    const qtRx = gsap.quickTo(card, 'rotateX', { duration: 0.4, ease: 'power3.out' })
    const qtRy = gsap.quickTo(card, 'rotateY', { duration: 0.4, ease: 'power3.out' })
    const qtY = gsap.quickTo(card, 'y', { duration: 0.4, ease: 'power3.out' })
    let leaveTween = null
    let needsSync = true
    let cachedRect = null

    function invalidateRect() {
      cachedRect = null
    }

    function onEnter() {
      if (leaveTween) {
        leaveTween.kill()
        leaveTween = null
      }
      cachedRect = card.getBoundingClientRect()
      card.classList.add('is-hovered')
    }

    function onMove(e) {
      if (leaveTween) {
        leaveTween.kill()
        leaveTween = null
      }
      const rect = cachedRect || (cachedRect = card.getBoundingClientRect())
      if (!rect.width || !rect.height) return
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const nx = (e.clientX - cx) / (rect.width / 2)
      const ny = (e.clientY - cy) / (rect.height / 2)

      const ry = clamp(nx * MAX_TILT, -MAX_TILT, MAX_TILT)
      const rx = clamp(-ny * MAX_TILT, -MAX_TILT, MAX_TILT)

      if (needsSync) {
        needsSync = false
        qtRy(ry, Number(gsap.getProperty(card, 'rotateY')) || 0)
        qtRx(rx, Number(gsap.getProperty(card, 'rotateX')) || 0)
        qtY(LIFT, Number(gsap.getProperty(card, 'y')) || 0)
      } else {
        qtRy(ry)
        qtRx(rx)
        qtY(LIFT)
      }

      const gx = clamp(Math.round((nx + 1) * 50), 0, 100)
      const gy = clamp(Math.round((ny + 1) * 50), 0, 100)
      card.style.setProperty('--sw-gx', String(gx))
      card.style.setProperty('--sw-gy', String(gy))

      card.classList.add('is-hovered')
    }

    function onLeave() {
      cachedRect = null
      qtRx.tween.pause()
      qtRy.tween.pause()
      qtY.tween.pause()
      if (leaveTween) leaveTween.kill()
      needsSync = true

      leaveTween = gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        y: 0,
        duration: 0.7,
        ease: 'elastic.out(1, 0.45)',
        onComplete: () => {
          card.classList.remove('is-hovered')
          leaveTween = null
        },
      })
    }

    card.addEventListener('mouseenter', onEnter)
    card.addEventListener('mousemove', onMove)
    card.addEventListener('mouseleave', onLeave)
    window.addEventListener('scroll', invalidateRect, { passive: true })
    window.addEventListener('resize', invalidateRect, { passive: true })

    cleanups.push(() => {
      if (leaveTween) leaveTween.kill()
      window.removeEventListener('scroll', invalidateRect)
      window.removeEventListener('resize', invalidateRect)
      card.removeEventListener('mouseenter', onEnter)
      card.removeEventListener('mousemove', onMove)
      card.removeEventListener('mouseleave', onLeave)
      card.style.removeProperty('--sw-gx')
      card.style.removeProperty('--sw-gy')
      gsap.set(card, { rotateX: 0, rotateY: 0, y: 0, clearProps: 'transformPerspective' })
      card.classList.remove('is-hovered')
    })
  })

  return () => cleanups.forEach((fn) => fn())
}

/**
 * Native-scroll HUD update for tablet/mobile and reduced-motion.
 * @param {HTMLElement} trackWrap
 * @param {HTMLElement} counterEl
 * @param {HTMLElement} barEl
 * @param {number} total
 * @returns {() => void}  cleanup
 */
function initScrollHUD(trackWrap, counterEl, barEl, total) {
  function onScroll() {
    const max = trackWrap.scrollWidth - trackWrap.clientWidth
    const progress = max > 0 ? trackWrap.scrollLeft / max : 0
    updateHUD(counterEl, barEl, progress, total)
  }

  trackWrap.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
  return () => trackWrap.removeEventListener('scroll', onScroll)
}

/**
 * Main export.
 */
export function initSelectedWorks() {
  const section = document.querySelector('[data-section="selected-works"]')
  if (!section) return

  const trackWrap = document.getElementById('worksTrackWrap')
  const track = document.getElementById('worksTrack')
  const counterEl = document.getElementById('worksCounter')
  const barEl = document.getElementById('worksProgressBar')
  const ctaBtn = section.querySelector('.js-works-cta')
  const cards = Array.from(section.querySelectorAll('.sw-card'))
  const total = cards.length

  if (!trackWrap || !track || total === 0) return

  updateHUD(counterEl, barEl, 0, total)

  // Attach glass button cursor effect to CTA
  let cleanupCta = null
  if (ctaBtn) cleanupCta = initGlassButton(ctaBtn)

  // Card hover 3D tilt
  const cleanupCardHover = initCardHover(cards)

  // matchMedia context — handles both desktop pin and mobile/reduced-motion scroll
  const mm = gsap.matchMedia()

  mm.add(
    {
      isDesktop: '(min-width: 1024px) and (prefers-reduced-motion: no-preference)',
      isScroll: '(max-width: 1023px), (prefers-reduced-motion: reduce)',
    },
    (context) => {
      const { isDesktop } = context.conditions

      if (isDesktop) {
        // Clip horizontally without creating an accidental focus scroll container
        trackWrap.style.overflowX = 'clip'
        trackWrap.style.overflowY = 'visible'
        trackWrap.scrollLeft = 0

        gsap.set(track, { x: 0 })

        const getScrollDist = () => Math.max(1, track.scrollWidth - trackWrap.clientWidth)

        const st = ScrollTrigger.create({
          trigger: section,
          start: 'top top',
          end: () => `+=${getScrollDist()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            updateHUD(counterEl, barEl, self.progress, total)
          },
          animation: gsap.to(track, {
            x: () => -getScrollDist(),
            ease: 'none',
          }),
        })

        // Keep keyboard focus synchronized with horizontal scroll progress while pinned
        function onFocusIn(e) {
          if (!e.target.matches(':focus-visible')) return
          const item = e.target.closest('.sw-card, .works-endcap')
          if (!item) return
          trackWrap.scrollLeft = 0
          const rect = item.getBoundingClientRect()
          if (rect.left >= 24 && rect.right <= window.innerWidth - 24) return
          const dist = track.scrollWidth - trackWrap.clientWidth
          if (dist <= 0) return
          const padLeft = parseFloat(getComputedStyle(track).paddingLeft) || 24
          const p = Math.min(1, Math.max(0, (item.offsetLeft - padLeft) / dist))
          const targetY = st.start + p * (st.end - st.start)
          window.scrollTo({ top: targetY, behavior: 'auto' })
        }

        track.addEventListener('focusin', onFocusIn)

        return () => {
          track.removeEventListener('focusin', onFocusIn)
          st.kill()
          trackWrap.style.overflowX = ''
          trackWrap.style.overflowY = ''
          gsap.set(track, { x: 0 })
        }
      } else {
        // Mobile/tablet or reduced-motion: native horizontal scroll + synced HUD
        gsap.set(track, { x: 0 })
        trackWrap.style.overflowX = 'auto'
        trackWrap.style.overflowY = 'visible'
        trackWrap.style.webkitOverflowScrolling = 'touch'

        const cleanupHUD = initScrollHUD(trackWrap, counterEl, barEl, total)

        return () => {
          cleanupHUD()
          trackWrap.style.overflowX = ''
          trackWrap.style.overflowY = ''
          trackWrap.style.webkitOverflowScrolling = ''
        }
      }
    },
  )

  return () => {
    mm.revert()
    if (cleanupCta) cleanupCta()
    cleanupCardHover()
  }
}
