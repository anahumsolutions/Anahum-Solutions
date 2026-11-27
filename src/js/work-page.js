import { gsap } from 'gsap'
import { initMenu, initStickyHeader } from './anim/menu.js'
import { initFadeUp } from './anim/fade-up.js'
import { initBlurReveal } from './anim/blur-reveal.js'
import { initBackToTop } from './anim/back-to-top.js'
import { initAllGlassButtons } from './anim/glass-button.js'

// ---------------------------------------------------------------------------
// Filter bar
// ---------------------------------------------------------------------------
function initFilter(onAfterFilter) {
  const buttons = document.querySelectorAll('[data-filter]')
  const groups = document.querySelectorAll('.work-group[data-group]')
  if (!buttons.length) return

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter

      buttons.forEach((b) => b.setAttribute('aria-pressed', 'false'))
      btn.setAttribute('aria-pressed', 'true')

      groups.forEach((group) => {
        if (filter === 'all' || group.dataset.group === filter) {
          group.removeAttribute('hidden')
        } else {
          group.setAttribute('hidden', '')
        }
      })

      if (typeof onAfterFilter === 'function') {
        requestAnimationFrame(onAfterFilter)
      }
    })
  })
}

// ---------------------------------------------------------------------------
// Lightbox
// ---------------------------------------------------------------------------
function initLightbox() {
  const lightbox = document.getElementById('wkLightbox')
  const img = document.getElementById('wkLightboxImg')
  const closeBtn = document.getElementById('wkLightboxClose')
  const prevBtn = document.getElementById('wkLightboxPrev')
  const nextBtn = document.getElementById('wkLightboxNext')
  const counterEl = document.getElementById('wkLightboxCounter')
  const captionEl = document.getElementById('wkLightboxCaption')
  const liveEl = document.getElementById('wkLightboxLive')

  if (!lightbox || !img || !closeBtn) {
    return {
      open: () => {},
      close: () => {},
      isOpen: () => false,
      onToggle: () => {},
      destroy: () => {},
    }
  }

  const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  let reducedMotion = reducedMotionQuery.matches
  const onReducedMotionChange = () => {
    reducedMotion = reducedMotionQuery.matches
  }
  reducedMotionQuery.addEventListener('change', onReducedMotionChange)

  function setBackgroundInert(active) {
    const header = document.querySelector('.site-header')
    const footer = document.querySelector('.site-footer')
    const backToTop = document.getElementById('backToTop')
    const main = document.getElementById('mainContent')

    ;[header, footer, backToTop].forEach((el) => {
      if (el) el.inert = active
    })
    if (main) {
      Array.from(main.children).forEach((child) => {
        if (child !== lightbox) child.inert = active
      })
    }
  }
  let currentPhotos = []
  let currentIndex = 0
  let openState = false
  let returnFocusEl = null
  let savedOverflow = ''
  let swipeStartX = 0
  let swipeActive = false
  const toggleListeners = new Set()

  function notifyToggle(isOpen) {
    toggleListeners.forEach((fn) => fn(isOpen))
  }

  function renderPhoto() {
    const item = currentPhotos[currentIndex]
    if (!item) return

    const hasMultiple = currentPhotos.length > 1
    img.src = item.full
    img.alt = item.alt || ''

    if (prevBtn) {
      prevBtn.hidden = !hasMultiple
      prevBtn.disabled = !hasMultiple
    }
    if (nextBtn) {
      nextBtn.hidden = !hasMultiple
      nextBtn.disabled = !hasMultiple
    }
    if (counterEl) {
      counterEl.textContent = hasMultiple ? `${currentIndex + 1} / ${currentPhotos.length}` : ''
    }
    if (captionEl) {
      captionEl.textContent = item.alt || ''
    }
    if (liveEl) {
      const countText = hasMultiple ? ` (${currentIndex + 1} of ${currentPhotos.length})` : ''
      liveEl.textContent = ''
      requestAnimationFrame(() => {
        liveEl.textContent = `${item.alt || 'Project photo'}${countText}`
      })
    }
  }

  function step(delta) {
    if (currentPhotos.length <= 1) return
    currentIndex = (currentIndex + delta + currentPhotos.length) % currentPhotos.length
    renderPhoto()
  }

  function open(photos, startIndex = 0, triggerEl = null) {
    if (!photos || !photos.length) return
    currentPhotos = photos
    currentIndex = Math.max(0, Math.min(photos.length - 1, startIndex))
    returnFocusEl = triggerEl || document.activeElement
    savedOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    openState = true

    renderPhoto()
    setBackgroundInert(true)
    lightbox.classList.add('is-open')
    lightbox.setAttribute('aria-hidden', 'false')
    notifyToggle(true)

    if (reducedMotion) {
      gsap.set(lightbox, { opacity: 1 })
    } else {
      gsap.fromTo(
        lightbox,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.25,
          ease: 'power2.out',
          overwrite: 'auto',
        },
      )
    }

    closeBtn.focus({ preventScroll: true })
  }

  function finalizeClose() {
    lightbox.classList.remove('is-open')
    lightbox.setAttribute('aria-hidden', 'true')
    setBackgroundInert(false)
    img.removeAttribute('src')
    img.alt = ''
    if (counterEl) counterEl.textContent = ''
    if (captionEl) captionEl.textContent = ''
    if (liveEl) liveEl.textContent = ''
    if (returnFocusEl && typeof returnFocusEl.focus === 'function') {
      returnFocusEl.focus({ preventScroll: true })
    }
    returnFocusEl = null
    notifyToggle(false)
  }

  function close() {
    if (!openState) return
    openState = false
    document.body.style.overflow = savedOverflow

    if (reducedMotion) {
      gsap.set(lightbox, { opacity: 0 })
      finalizeClose()
    } else {
      gsap.to(lightbox, {
        opacity: 0,
        duration: 0.2,
        ease: 'power2.in',
        overwrite: 'auto',
        onComplete: finalizeClose,
      })
    }
  }

  function onBackdropClick(e) {
    if (e.target === lightbox || e.target.closest('[data-lightbox-close]')) {
      close()
    }
  }

  function onPrevClick() {
    step(-1)
  }

  function onNextClick() {
    step(1)
  }

  function onSwipeDown(e) {
    if (!openState || currentPhotos.length <= 1) return
    if (e.target.closest('button')) return
    swipeStartX = e.clientX
    swipeActive = true
  }

  function onSwipeUp(e) {
    if (!swipeActive) return
    swipeActive = false
    const dx = e.clientX - swipeStartX
    if (dx <= -50) step(1)
    else if (dx >= 50) step(-1)
  }

  function onKeyDown(e) {
    if (!openState) return

    if (e.key === 'Escape') {
      e.preventDefault()
      close()
      return
    }
    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      step(-1)
      return
    }
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      step(1)
      return
    }
    if (e.key === 'Tab') {
      const focusable = Array.from(
        lightbox.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((el) => !el.hidden && !el.disabled && el.offsetParent !== null)

      if (!focusable.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      } else if (!lightbox.contains(document.activeElement)) {
        e.preventDefault()
        first.focus()
      }
    }
  }

  // Wire single-image project zoom buttons
  const singleBtns = Array.from(document.querySelectorAll('.work-project__single-btn'))
  const singleCleanups = singleBtns.map((btn) => {
    const handler = () => {
      const singleImg = btn.querySelector('img')
      const full = btn.dataset.full || singleImg?.currentSrc || singleImg?.src || ''
      const alt = singleImg?.alt || ''
      if (full) open([{ full, alt }], 0, btn)
    }
    btn.addEventListener('click', handler)
    return () => btn.removeEventListener('click', handler)
  })

  closeBtn.addEventListener('click', close)
  if (prevBtn) prevBtn.addEventListener('click', onPrevClick)
  if (nextBtn) nextBtn.addEventListener('click', onNextClick)
  lightbox.addEventListener('click', onBackdropClick)
  lightbox.addEventListener('pointerdown', onSwipeDown, { passive: true })
  lightbox.addEventListener('pointerup', onSwipeUp, { passive: true })
  document.addEventListener('keydown', onKeyDown)

  return {
    open,
    close,
    isOpen: () => openState,
    onToggle: (fn) => toggleListeners.add(fn),
    destroy: () => {
      singleCleanups.forEach((off) => off())
      closeBtn.removeEventListener('click', close)
      if (prevBtn) prevBtn.removeEventListener('click', onPrevClick)
      if (nextBtn) nextBtn.removeEventListener('click', onNextClick)
      lightbox.removeEventListener('click', onBackdropClick)
      lightbox.removeEventListener('pointerdown', onSwipeDown)
      lightbox.removeEventListener('pointerup', onSwipeUp)
      document.removeEventListener('keydown', onKeyDown)
      toggleListeners.clear()
      document.body.style.overflow = savedOverflow
    },
  }
}

// ---------------------------------------------------------------------------
// Per-project 3D coverflows with autoscroll
// ---------------------------------------------------------------------------
function initCoverflows(lightbox) {
  const flows = Array.from(document.querySelectorAll('.wk-flow'))
  if (!flows.length) {
    return {
      setLightboxOpen: () => {},
      refreshLayout: () => {},
      pauseAll: () => {},
      resumeAll: () => {},
      destroy: () => {},
    }
  }

  const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  let reducedMotion = reducedMotionQuery.matches
  const hasHoverPointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches
  const AUTOSCROLL_MS = 3500
  const RESUME_DELAY_MS = 2000
  const DRAG_THRESHOLD = 50
  const WHEEL_MIN_LOCK_MS = 450
  const WHEEL_IDLE_MS = 160

  const controllers = flows
    .map((flow) => {
      const stage = flow.querySelector('.wk-flow__stage')
      const liveEl = flow.querySelector('.wk-flow__live')
      const items = Array.from(flow.querySelectorAll('.wk-flow__item'))
      if (!stage || !items.length) return null

      const photos = items.map((item) => {
        const img = item.querySelector('img')
        return {
          full: img?.dataset.full || img?.currentSrc || img?.src || '',
          alt: img?.alt || '',
        }
      })

      const count = items.length
      const isPortrait = flow.dataset.layout === 'portrait'
      // Start centred so both sides show fanned cards symmetrically on load
      let activeIdx = Math.floor(count / 2)

      // State flags
      let isVisible = false
      let isHovered = false
      let isDragging = false
      let isFocused = false
      let isLightboxOpen = false
      let isTabHidden = document.hidden

      // Timers / drag state
      let intervalId = null
      let resumeTimer = null
      let wheelTimer = null
      let wheelIdleTimer = null
      let wheelLocked = false
      let wheelMinDone = true
      let wheelIdleDone = true
      let resizeRaf = 0
      let suppressClickUntil = 0
      let activePointerId = null
      let dragStartX = 0
      let dragStartY = 0
      let didDrag = false

      function fallbackWidth() {
        const vw = window.innerWidth
        if (vw < 640) return isPortrait ? 180 : 240
        if (vw < 1024) return isPortrait ? 220 : 300
        return isPortrait ? 270 : 380
      }

      function computeX(offset, cardW) {
        if (reducedMotion) {
          return offset * (cardW + 16)
        }
        const abs = Math.abs(offset)
        if (abs === 0) return 0
        const dir = offset > 0 ? 1 : -1
        const vw = window.innerWidth
        const ratio = vw < 640 ? 0.54 : vw < 1024 ? 0.58 : 0.62
        const step = cardW * ratio

        if (abs === 1) return dir * step
        if (abs === 2) return dir * step * 1.72
        if (abs === 3) return dir * step * 2.28
        return dir * step * (2.28 + (abs - 3) * 0.45)
      }

      function announceActive() {
        if (!liveEl) return
        const current = photos[activeIdx]
        if (!current) return
        liveEl.textContent = ''
        requestAnimationFrame(() => {
          liveEl.textContent = `${current.alt || 'Photo'} (${activeIdx + 1} of ${count})`
        })
      }

      function layout(animate = true) {
        const cardW = items[0].offsetWidth || fallbackWidth()
        const useAnim = animate && !reducedMotion

        items.forEach((el, i) => {
          const offset = i - activeIdx
          const abs = Math.abs(offset)
          const x = computeX(offset, cardW)

          let ry = 0
          let z = 0
          let scale = 1
          let opacity = 1
          let isHiddenFar = false

          if (reducedMotion) {
            scale = offset === 0 ? 1 : 0.9
            opacity = offset === 0 ? 1 : 0.7
          } else {
            // Left side (offset < 0) positive rotateY; right side (offset > 0) negative rotateY
            const sign = offset > 0 ? -1 : 1
            if (abs === 1) {
              ry = sign * 28
              z = -90
              scale = 0.84
              opacity = 0.75
            } else if (abs === 2) {
              ry = sign * 32
              z = -170
              scale = 0.72
              opacity = 0.45
            } else if (abs === 3) {
              ry = sign * 35
              z = -230
              scale = 0.62
              opacity = 0.22
            } else if (abs >= 4) {
              ry = sign * 35
              z = -270
              scale = 0.56
              opacity = 0
              isHiddenFar = true
            }
          }

          el.style.zIndex = String(30 - abs)
          el.style.pointerEvents = isHiddenFar ? 'none' : 'auto'
          el.classList.toggle('is-active', offset === 0)
          el.setAttribute('aria-current', offset === 0 ? 'true' : 'false')

          if (useAnim) {
            el.classList.add('is-animating')
            gsap.to(el, {
              x,
              z,
              rotateY: ry,
              scale,
              opacity,
              duration: 0.7,
              ease: 'power3.out',
              overwrite: 'auto',
              onComplete: () => {
                el.classList.remove('is-animating')
              },
            })
          } else {
            gsap.killTweensOf(el)
            el.classList.remove('is-animating')
            gsap.set(el, { x, z, rotateY: ry, scale, opacity })
          }
        })
      }

      function goToManual(idx, announce = false) {
        const clamped = Math.max(0, Math.min(count - 1, idx))
        if (clamped === activeIdx) return
        activeIdx = clamped
        layout(true)
        if (announce) announceActive()
      }

      function canAuto() {
        return (
          !reducedMotion &&
          count > 1 &&
          isVisible &&
          !isHovered &&
          !isDragging &&
          !isFocused &&
          !isLightboxOpen &&
          !isTabHidden
        )
      }

      function stopAuto() {
        if (intervalId !== null) {
          clearInterval(intervalId)
          intervalId = null
        }
        if (resumeTimer !== null) {
          clearTimeout(resumeTimer)
          resumeTimer = null
        }
      }

      function startAuto() {
        if (intervalId !== null || !canAuto()) return
        intervalId = setInterval(() => {
          activeIdx = (activeIdx + 1) % count
          layout(true)
        }, AUTOSCROLL_MS)
      }

      function scheduleResume() {
        stopAuto()
        if (!canAuto()) return
        resumeTimer = setTimeout(() => {
          resumeTimer = null
          startAuto()
        }, RESUME_DELAY_MS)
      }

      // --- Item click ---
      const itemClickHandlers = items.map((el, i) => {
        const handler = () => {
          if (performance.now() < suppressClickUntil) return
          if (i !== activeIdx) {
            goToManual(i, isFocused)
            scheduleResume()
          } else if (lightbox) {
            stopAuto()
            lightbox.open(photos, i, el)
          }
        }
        el.addEventListener('click', handler)
        return () => el.removeEventListener('click', handler)
      })

      // --- Pointer drag (keeps isDragging true until release, cancels on vertical scroll) ---
      function onWindowPointerMove(e) {
        if (activePointerId !== e.pointerId) return
        const dx = e.clientX - dragStartX
        const dy = e.clientY - dragStartY

        if (!didDrag && Math.abs(dy) > 10 && Math.abs(dy) > Math.abs(dx)) {
          finishDrag()
          scheduleResume()
          return
        }

        if (!didDrag && Math.abs(dx) > 10 && Math.abs(dx) > Math.abs(dy)) {
          didDrag = true
        }

        if (Math.abs(dx) >= DRAG_THRESHOLD) {
          goToManual(dx < 0 ? activeIdx + 1 : activeIdx - 1)
          dragStartX = e.clientX
          didDrag = true
        }
      }

      function finishDrag() {
        if (activePointerId === null) return
        activePointerId = null
        isDragging = false
        stage.classList.remove('is-dragging')
        window.removeEventListener('pointermove', onWindowPointerMove)
        window.removeEventListener('pointerup', onWindowPointerUp)
        window.removeEventListener('pointercancel', onWindowPointerUp)
        if (didDrag) {
          suppressClickUntil = performance.now() + 250
        }
      }

      function onWindowPointerUp(e) {
        if (activePointerId !== e.pointerId) return
        finishDrag()
        scheduleResume()
      }

      function onPointerDown(e) {
        if (e.pointerType === 'mouse' && e.button !== 0) return
        activePointerId = e.pointerId
        dragStartX = e.clientX
        dragStartY = e.clientY
        didDrag = false
        isDragging = true
        stage.classList.add('is-dragging')
        stopAuto()
        window.addEventListener('pointermove', onWindowPointerMove, { passive: true })
        window.addEventListener('pointerup', onWindowPointerUp)
        window.addEventListener('pointercancel', onWindowPointerUp)
      }

      // --- Wheel (horizontal only, debounced across trackpad inertia tail) ---
      function tryUnlockWheel() {
        if (wheelMinDone && wheelIdleDone) {
          wheelLocked = false
        }
      }

      function onWheel(e) {
        if (Math.abs(e.deltaX) <= Math.abs(e.deltaY) * 1.4) return
        if (Math.abs(e.deltaX) < 12) return
        e.preventDefault()

        // Extend idle gate on every inertia tick
        wheelIdleDone = false
        clearTimeout(wheelIdleTimer)
        wheelIdleTimer = setTimeout(() => {
          wheelIdleDone = true
          tryUnlockWheel()
        }, WHEEL_IDLE_MS)

        if (wheelLocked) return
        wheelLocked = true
        wheelMinDone = false
        goToManual(e.deltaX > 0 ? activeIdx + 1 : activeIdx - 1)
        scheduleResume()

        clearTimeout(wheelTimer)
        wheelTimer = setTimeout(() => {
          wheelMinDone = true
          tryUnlockWheel()
        }, WHEEL_MIN_LOCK_MS)
      }

      // --- Keyboard when stage has focus ---
      function onKeyDown(e) {
        if (lightbox && lightbox.isOpen()) return
        if (e.key === 'ArrowLeft') {
          e.preventDefault()
          goToManual(activeIdx - 1, true)
          scheduleResume()
        } else if (e.key === 'ArrowRight') {
          e.preventDefault()
          goToManual(activeIdx + 1, true)
          scheduleResume()
        } else if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          if (lightbox) {
            stopAuto()
            lightbox.open(photos, activeIdx, stage)
          }
        }
      }

      function onMouseEnter() {
        isHovered = true
        stopAuto()
      }

      function onMouseLeave() {
        isHovered = false
        scheduleResume()
      }

      function onFocusIn() {
        isFocused = true
        stopAuto()
      }

      function onFocusOut(e) {
        if (stage.contains(e.relatedTarget)) return
        isFocused = false
        scheduleResume()
      }

      function onVisibilityChange() {
        isTabHidden = document.hidden
        if (isTabHidden) stopAuto()
        else startAuto()
      }

      function onResize() {
        if (resizeRaf) return
        resizeRaf = requestAnimationFrame(() => {
          resizeRaf = 0
          layout(false)
        })
      }

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            isVisible = entry.isIntersecting && entry.intersectionRatio >= 0.4
            if (isVisible) {
              layout(false)
              startAuto()
            } else {
              stopAuto()
            }
          })
        },
        { threshold: [0, 0.4] },
      )

      stage.addEventListener('pointerdown', onPointerDown, { passive: true })
      stage.addEventListener('wheel', onWheel, { passive: false })
      stage.addEventListener('keydown', onKeyDown)
      // Only bind hover pause on true fine-pointer hover devices (avoids mobile tap lock)
      if (hasHoverPointer) {
        stage.addEventListener('mouseenter', onMouseEnter)
        stage.addEventListener('mouseleave', onMouseLeave)
      }
      stage.addEventListener('focusin', onFocusIn)
      stage.addEventListener('focusout', onFocusOut)
      document.addEventListener('visibilitychange', onVisibilityChange)
      window.addEventListener('resize', onResize, { passive: true })
      observer.observe(stage)

      function onReducedMotionChange() {
        reducedMotion = reducedMotionQuery.matches
        layout(false)
        if (reducedMotion) stopAuto()
        else startAuto()
      }
      reducedMotionQuery.addEventListener('change', onReducedMotionChange)

      layout(false)

      return {
        refreshLayout() {
          layout(false)
        },
        pauseAuto() {
          stopAuto()
        },
        resumeAuto() {
          startAuto()
        },
        setLightboxOpen(open) {
          isLightboxOpen = open
          if (open) stopAuto()
          else scheduleResume()
        },
        destroy() {
          stopAuto()
          clearTimeout(wheelTimer)
          clearTimeout(wheelIdleTimer)
          if (resizeRaf) cancelAnimationFrame(resizeRaf)
          finishDrag()
          observer.disconnect()
          itemClickHandlers.forEach((off) => off())
          stage.removeEventListener('pointerdown', onPointerDown)
          stage.removeEventListener('wheel', onWheel)
          stage.removeEventListener('keydown', onKeyDown)
          if (hasHoverPointer) {
            stage.removeEventListener('mouseenter', onMouseEnter)
            stage.removeEventListener('mouseleave', onMouseLeave)
          }
          stage.removeEventListener('focusin', onFocusIn)
          stage.removeEventListener('focusout', onFocusOut)
          document.removeEventListener('visibilitychange', onVisibilityChange)
          window.removeEventListener('resize', onResize)
          reducedMotionQuery.removeEventListener('change', onReducedMotionChange)
        },
      }
    })
    .filter(Boolean)

  return {
    refreshLayout() {
      controllers.forEach((c) => c.refreshLayout())
    },
    pauseAll() {
      controllers.forEach((c) => c.pauseAuto())
    },
    resumeAll() {
      controllers.forEach((c) => c.resumeAuto())
    },
    setLightboxOpen(open) {
      controllers.forEach((c) => c.setLightboxOpen(open))
    },
    destroy() {
      controllers.forEach((c) => c.destroy())
    },
  }
}

// ---------------------------------------------------------------------------
// Bootstrap
// ---------------------------------------------------------------------------
function initApp() {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (reducedMotion) {
    document.documentElement.classList.add('reduce-motion')
  }

  initStickyHeader({ alwaysVisible: true })
  initMenu()
  if (!reducedMotion) {
    initFadeUp()
    initBlurReveal()
  }
  initBackToTop()

  const lightbox = initLightbox()
  const coverflows = initCoverflows(lightbox)
  initFilter(() => coverflows.refreshLayout())

  if (lightbox && coverflows) {
    lightbox.onToggle((isOpen) => coverflows.setLightboxOpen(isOpen))
  }

  const cleanupGlass = !reducedMotion ? initAllGlassButtons() : null

  window.addEventListener('pagehide', (e) => {
    coverflows.pauseAll()
    if (e.persisted) return
    coverflows.destroy()
    lightbox.destroy()
    if (typeof cleanupGlass === 'function') cleanupGlass()
  })

  window.addEventListener('pageshow', (e) => {
    if (e.persisted) {
      coverflows.refreshLayout()
      coverflows.resumeAll()
    }
  })
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp)
} else {
  initApp()
}
