/**
 * Services Interactive Tab & Crossfade Image Swap
 * Supports hover/click, WAI-ARIA vertical tab keyboard navigation,
 * visibility-aware idle auto-cycling, and reduced-motion static switching.
 */
export function initServicesTabs() {
  const section = document.querySelector('[data-section="services"]')
  const tablist = section ? section.querySelector('.services-list') : null
  const rows = Array.from(document.querySelectorAll('.service-row'))
  const images = Array.from(document.querySelectorAll('.service-display-image'))
  const glassPanel = document.getElementById('servicesGlassPanel')
  const glassContent = document.getElementById('glassContent')
  const glassTitle = document.getElementById('glassTitle')
  const glassDesc = document.getElementById('glassDesc')
  const glassChip1 = document.getElementById('glassChip1')
  const glassChip2 = document.getElementById('glassChip2')
  const glassLink = document.getElementById('glassLink')
  const glassLinkLabel = document.getElementById('glassLinkLabel')

  if (!rows.length || !images.length) return () => {}

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const canHover = window.matchMedia('(hover: hover)').matches

  let currentIndex = 0
  let autoTimer = null
  let isHovered = false
  let isFocused = false
  let isInView = !('IntersectionObserver' in window)

  function updatePanelContent(row) {
    const title = row.getAttribute('data-title')
    const desc = row.getAttribute('data-desc')
    const chip1 = row.getAttribute('data-chip1')
    const chip2 = row.getAttribute('data-chip2')
    const ctaHref = row.getAttribute('data-cta-href')
    const ctaLabel = row.getAttribute('data-cta-label')

    if (glassTitle && title) glassTitle.textContent = title
    if (glassDesc && desc) glassDesc.textContent = desc
    if (glassChip1 && chip1) glassChip1.textContent = chip1
    if (glassChip2 && chip2) glassChip2.textContent = chip2
    if (glassLink && ctaHref) glassLink.setAttribute('href', ctaHref)
    if (glassLinkLabel && ctaLabel) glassLinkLabel.textContent = ctaLabel

    if (!prefersReducedMotion && glassContent && typeof glassContent.animate === 'function') {
      glassContent.animate(
        [
          { opacity: 0.45, transform: 'translateY(4px)' },
          { opacity: 1, transform: 'translateY(0)' },
        ],
        { duration: 240, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' },
      )
    }
  }

  function activateTab(row, { focusTab = false } = {}) {
    const indexStr = row.getAttribute('data-service-index')
    const nextIndex = parseInt(indexStr, 10)
    if (Number.isNaN(nextIndex)) return

    if (focusTab) row.focus()
    if (nextIndex === currentIndex) return

    currentIndex = nextIndex

    rows.forEach((r) => {
      const active = r === row
      r.classList.toggle('is-active', active)
      r.setAttribute('aria-selected', active ? 'true' : 'false')
      r.setAttribute('tabindex', active ? '0' : '-1')
    })

    if (glassPanel && row.id) {
      glassPanel.setAttribute('aria-labelledby', row.id)
    }

    images.forEach((img) => {
      img.classList.toggle('is-active', img.getAttribute('data-index') === indexStr)
    })

    updatePanelContent(row)
  }

  function stopAutoCycle() {
    if (autoTimer !== null) {
      clearInterval(autoTimer)
      autoTimer = null
    }
  }

  function startAutoCycle() {
    if (prefersReducedMotion) return
    stopAutoCycle()
    autoTimer = setInterval(() => {
      if (isInView && !isHovered && !isFocused && document.visibilityState === 'visible') {
        const next = (currentIndex + 1) % rows.length
        activateTab(rows[next])
      }
    }, 4500)
  }

  const rowCleanups = []

  rows.forEach((row, idx) => {
    const onEnter = () => {
      if (!canHover) return
      isHovered = true
      activateTab(row)
    }

    const onLeave = () => {
      if (!canHover) return
      isHovered = false
    }

    const onClick = () => {
      activateTab(row)
      startAutoCycle()
    }

    const onKeyDown = (e) => {
      let targetIdx = null
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        targetIdx = (idx + 1) % rows.length
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        targetIdx = (idx - 1 + rows.length) % rows.length
      } else if (e.key === 'Home') {
        targetIdx = 0
      } else if (e.key === 'End') {
        targetIdx = rows.length - 1
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        activateTab(row)
        startAutoCycle()
        return
      }

      if (targetIdx !== null) {
        e.preventDefault()
        activateTab(rows[targetIdx], { focusTab: true })
        startAutoCycle()
      }
    }

    row.addEventListener('mouseenter', onEnter)
    row.addEventListener('mouseleave', onLeave)
    row.addEventListener('click', onClick)
    row.addEventListener('keydown', onKeyDown)

    rowCleanups.push(() => {
      row.removeEventListener('mouseenter', onEnter)
      row.removeEventListener('mouseleave', onLeave)
      row.removeEventListener('click', onClick)
      row.removeEventListener('keydown', onKeyDown)
    })
  })

  const onFocusIn = () => {
    isFocused = true
  }
  const onFocusOut = (e) => {
    if (tablist && !tablist.contains(e.relatedTarget)) {
      isFocused = false
    }
  }
  if (tablist) {
    tablist.addEventListener('focusin', onFocusIn)
    tablist.addEventListener('focusout', onFocusOut)
  }

  let observer = null
  if (section && 'IntersectionObserver' in window) {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isInView = entry.isIntersecting
        })
      },
      { threshold: 0.1 },
    )
    observer.observe(section)
  }

  startAutoCycle()

  return () => {
    stopAutoCycle()
    if (observer) observer.disconnect()
    if (tablist) {
      tablist.removeEventListener('focusin', onFocusIn)
      tablist.removeEventListener('focusout', onFocusOut)
    }
    rowCleanups.forEach((fn) => fn())
  }
}
