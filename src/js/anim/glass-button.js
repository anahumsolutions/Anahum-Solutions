import { gsap } from 'gsap'

const PRESETS = {
  prism: { mode: 'prism', maxShiftX: 6, maxShiftY: 5, maxTilt: 9, innerX: 4.5, innerY: 3.5 },
  'prism-compact': {
    mode: 'prism',
    maxShiftX: 2.5,
    maxShiftY: 2,
    maxTilt: 5,
    innerX: 2.5,
    innerY: 2,
  },
  crystal: { mode: 'crystal', maxShiftX: 7, maxShiftY: 5, pullX: 0.2, pullY: 0.24 },
  'crystal-compact': { mode: 'crystal', maxShiftX: 2.5, maxShiftY: 2, pullX: 0.14, pullY: 0.16 },
  'crystal-icon': { mode: 'crystal', maxShiftX: 2.5, maxShiftY: 2.5, pullX: 0.16, pullY: 0.16 },
}

const boundElements = new WeakSet()

/**
 * Ensure a GLASS 04 element wraps its contents inside a single `.gb-core` inner core node
 * so static HTML without manual `.gb-core` still gains layered parallax cleanly.
 * @param {HTMLElement} el
 * @returns {HTMLElement}
 */
function ensurePrismCore(el) {
  const existing = el.querySelector(':scope > .gb-core')
  if (existing) return existing

  const core = document.createElement('span')
  core.className = 'gb-core'
  const label = document.createElement('span')
  label.className = 'gb-core-label'

  while (el.firstChild) {
    label.appendChild(el.firstChild)
  }
  core.appendChild(label)
  el.appendChild(core)
  return core
}

/**
 * Initialize GSAP Glass 04 (Layered Prism) or Glass 02 (Liquid Crystal Specular) physics on a button/link.
 * Safe to call repeatedly on the same element; guarded against duplicate listeners, touch devices, and reduced motion.
 *
 * @param {HTMLElement} el
 * @param {{ preset?: keyof typeof PRESETS }} [options]
 * @returns {() => void} cleanup function
 */
export function initGlassButton(el, options = {}) {
  if (!el || boundElements.has(el)) return () => {}

  const inferred =
    el.classList.contains('btn--primary') ||
    el.classList.contains('hero__nav-pill--cta') ||
    el.classList.contains('site-header__cta') ||
    el.classList.contains('hero__btn--primary')
      ? el.classList.contains('site-header__cta') || el.classList.contains('hero__nav-pill--cta')
        ? 'prism-compact'
        : 'prism'
      : 'crystal'

  const presetKey = options.preset || el.dataset.glassPreset || inferred
  const cfg = PRESETS[presetKey] || PRESETS.crystal

  const core = cfg.mode === 'prism' ? ensurePrismCore(el) : null

  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return () => {}
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {}

  boundElements.add(el)

  const clamp = (v, min, max) => Math.min(max, Math.max(min, v))

  if (cfg.mode === 'prism') {
    gsap.set(el, { transformPerspective: 750 })

    const qtX = gsap.quickTo(el, 'x', { duration: 0.48, ease: 'power3.out' })
    const qtY = gsap.quickTo(el, 'y', { duration: 0.48, ease: 'power3.out' })
    const qtRx = gsap.quickTo(el, 'rotateX', { duration: 0.48, ease: 'power3.out' })
    const qtRy = gsap.quickTo(el, 'rotateY', { duration: 0.48, ease: 'power3.out' })
    const qtInX = gsap.quickTo(core, 'x', { duration: 0.38, ease: 'power3.out' })
    const qtInY = gsap.quickTo(core, 'y', { duration: 0.38, ease: 'power3.out' })
    let leaveShellTween = null
    let leaveCoreTween = null
    let pressTween = null
    let needsSync = true
    let cachedRect = null

    function invalidateRect() {
      cachedRect = null
    }

    function onEnter() {
      cachedRect = el.getBoundingClientRect()
    }

    function releasePress() {
      window.removeEventListener('pointerup', releasePress)
      window.removeEventListener('pointercancel', releasePress)
      if (pressTween) pressTween.kill()
      pressTween = gsap.to(core, {
        scale: 1,
        duration: 0.36,
        ease: 'elastic.out(1, 0.5)',
        onComplete: () => {
          pressTween = null
        },
      })
    }

    function onMove(e) {
      if (el.disabled) return
      if (leaveShellTween) {
        leaveShellTween.kill()
        leaveShellTween = null
      }
      if (leaveCoreTween) {
        leaveCoreTween.kill()
        leaveCoreTween = null
      }
      const rect = cachedRect || (cachedRect = el.getBoundingClientRect())
      if (!rect.width || !rect.height) return
      const nx = clamp(((e.clientX - rect.left) / rect.width) * 2 - 1, -1, 1)
      const ny = clamp(((e.clientY - rect.top) / rect.height) * 2 - 1, -1, 1)

      const tx = nx * cfg.maxShiftX
      const ty = ny * cfg.maxShiftY
      const tryVal = nx * cfg.maxTilt
      const trxVal = -ny * cfg.maxTilt
      const tix = nx * cfg.innerX
      const tiy = ny * cfg.innerY

      if (needsSync) {
        needsSync = false
        qtX(tx, Number(gsap.getProperty(el, 'x')) || 0)
        qtY(ty, Number(gsap.getProperty(el, 'y')) || 0)
        qtRy(tryVal, Number(gsap.getProperty(el, 'rotateY')) || 0)
        qtRx(trxVal, Number(gsap.getProperty(el, 'rotateX')) || 0)
        qtInX(tix, Number(gsap.getProperty(core, 'x')) || 0)
        qtInY(tiy, Number(gsap.getProperty(core, 'y')) || 0)
      } else {
        qtX(tx)
        qtY(ty)
        qtRy(tryVal)
        qtRx(trxVal)
        qtInX(tix)
        qtInY(tiy)
      }
    }

    function onLeave() {
      cachedRect = null
      qtX.tween.pause()
      qtY.tween.pause()
      qtRx.tween.pause()
      qtRy.tween.pause()
      qtInX.tween.pause()
      qtInY.tween.pause()
      if (leaveShellTween) leaveShellTween.kill()
      if (leaveCoreTween) leaveCoreTween.kill()
      needsSync = true

      leaveShellTween = gsap.to(el, {
        x: 0,
        y: 0,
        rotateX: 0,
        rotateY: 0,
        duration: 0.72,
        ease: 'elastic.out(1, 0.5)',
        onComplete: () => {
          leaveShellTween = null
        },
      })
      leaveCoreTween = gsap.to(core, {
        x: 0,
        y: 0,
        duration: 0.72,
        ease: 'elastic.out(1, 0.5)',
        onComplete: () => {
          leaveCoreTween = null
        },
      })
    }

    function onDown() {
      if (el.disabled) return
      if (pressTween) pressTween.kill()
      pressTween = gsap.to(core, {
        scale: 0.96,
        duration: 0.12,
        ease: 'power2.out',
      })
      window.addEventListener('pointerup', releasePress)
      window.addEventListener('pointercancel', releasePress)
    }

    el.addEventListener('pointerenter', onEnter)
    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', onLeave)
    el.addEventListener('pointerdown', onDown)
    window.addEventListener('scroll', invalidateRect, { passive: true })
    window.addEventListener('resize', invalidateRect, { passive: true })

    return () => {
      if (leaveShellTween) leaveShellTween.kill()
      if (leaveCoreTween) leaveCoreTween.kill()
      if (pressTween) pressTween.kill()
      qtX.tween.kill()
      qtY.tween.kill()
      qtRx.tween.kill()
      qtRy.tween.kill()
      qtInX.tween.kill()
      qtInY.tween.kill()
      window.removeEventListener('pointerup', releasePress)
      window.removeEventListener('pointercancel', releasePress)
      window.removeEventListener('scroll', invalidateRect)
      window.removeEventListener('resize', invalidateRect)
      el.removeEventListener('pointerenter', onEnter)
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
      el.removeEventListener('pointerdown', onDown)
      gsap.set(el, { x: 0, y: 0, rotateX: 0, rotateY: 0, clearProps: 'transformPerspective' })
      gsap.set(core, { x: 0, y: 0, scale: 1 })
      boundElements.delete(el)
    }
  }

  // GLASS 02: Liquid Crystal Specular + Magnetic Pull + Press Rebound
  const qtX = gsap.quickTo(el, 'x', { duration: 0.42, ease: 'power3.out' })
  const qtY = gsap.quickTo(el, 'y', { duration: 0.42, ease: 'power3.out' })
  let leaveTween = null
  let pressTween = null
  let needsSync = true
  let cachedRect = null

  function invalidateRect() {
    cachedRect = null
  }

  function onEnter() {
    cachedRect = el.getBoundingClientRect()
  }

  function releasePress() {
    window.removeEventListener('pointerup', releasePress)
    window.removeEventListener('pointercancel', releasePress)
    if (pressTween) pressTween.kill()
    pressTween = gsap.to(el, {
      scale: 1,
      duration: 0.36,
      ease: 'elastic.out(1, 0.5)',
      onComplete: () => {
        pressTween = null
      },
    })
  }

  function onMove(e) {
    if (el.disabled) return
    if (leaveTween) {
      leaveTween.kill()
      leaveTween = null
    }
    const rect = cachedRect || (cachedRect = el.getBoundingClientRect())
    if (!rect.width || !rect.height) return
    const relX = e.clientX - rect.left
    const relY = e.clientY - rect.top
    el.style.setProperty('--rx', `${relX.toFixed(1)}px`)
    el.style.setProperty('--ry', `${relY.toFixed(1)}px`)

    const dx = e.clientX - (rect.left + rect.width / 2)
    const dy = e.clientY - (rect.top + rect.height / 2)
    const tx = clamp(dx * cfg.pullX, -cfg.maxShiftX, cfg.maxShiftX)
    const ty = clamp(dy * cfg.pullY, -cfg.maxShiftY, cfg.maxShiftY)

    if (needsSync) {
      needsSync = false
      qtX(tx, Number(gsap.getProperty(el, 'x')) || 0)
      qtY(ty, Number(gsap.getProperty(el, 'y')) || 0)
    } else {
      qtX(tx)
      qtY(ty)
    }
  }

  function onLeave() {
    cachedRect = null
    qtX.tween.pause()
    qtY.tween.pause()
    if (leaveTween) leaveTween.kill()
    needsSync = true

    leaveTween = gsap.to(el, {
      x: 0,
      y: 0,
      duration: 0.68,
      ease: 'elastic.out(1, 0.48)',
      onComplete: () => {
        leaveTween = null
      },
    })
  }

  function onDown() {
    if (el.disabled) return
    if (pressTween) pressTween.kill()
    pressTween = gsap.to(el, {
      scale: 0.96,
      duration: 0.12,
      ease: 'power2.out',
    })
    window.addEventListener('pointerup', releasePress)
    window.addEventListener('pointercancel', releasePress)
  }

  el.addEventListener('pointerenter', onEnter)
  el.addEventListener('pointermove', onMove)
  el.addEventListener('pointerleave', onLeave)
  el.addEventListener('pointerdown', onDown)
  window.addEventListener('scroll', invalidateRect, { passive: true })
  window.addEventListener('resize', invalidateRect, { passive: true })

  return () => {
    if (leaveTween) leaveTween.kill()
    if (pressTween) pressTween.kill()
    qtX.tween.kill()
    qtY.tween.kill()
    window.removeEventListener('pointerup', releasePress)
    window.removeEventListener('pointercancel', releasePress)
    window.removeEventListener('scroll', invalidateRect)
    window.removeEventListener('resize', invalidateRect)
    el.removeEventListener('pointerenter', onEnter)
    el.removeEventListener('pointermove', onMove)
    el.removeEventListener('pointerleave', onLeave)
    el.removeEventListener('pointerdown', onDown)
    el.style.removeProperty('--rx')
    el.style.removeProperty('--ry')
    gsap.set(el, { x: 0, y: 0, scale: 1 })
    boundElements.delete(el)
  }
}

/**
 * Automatically initialize GLASS 04 & GLASS 02 physics across all buttons on the current page.
 * @param {ParentNode} [root=document]
 * @returns {() => void} cleanup function
 */
export function initAllGlassButtons(root = document) {
  const groups = [
    ['.btn--primary, .hero__btn--primary', 'prism'],
    ['.site-header__cta, .hero__nav-pill--cta', 'prism-compact'],
    ['.btn--ghost, .btn--outline, .btn--dark, .hero__btn--secondary', 'crystal'],
    ['.work-filter__btn, .pricing-toggle-btn', 'crystal-compact'],
    [
      '.site-header__menu-btn, .social-btn, #backToTop, .wk-lightbox__close, .wk-lightbox__nav, .social-glass-btn',
      'crystal-icon',
    ],
  ]

  const cleanups = []
  groups.forEach(([selector, preset]) => {
    root.querySelectorAll(selector).forEach((el) => {
      cleanups.push(initGlassButton(el, { preset }))
    })
  })

  return () => cleanups.forEach((fn) => fn())
}
