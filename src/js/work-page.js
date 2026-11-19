import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { initMenu } from './anim/menu.js'
import { initFadeUp } from './anim/fade-up.js'
import { initBlurReveal } from './anim/blur-reveal.js'
import { initBackToTop } from './anim/back-to-top.js'

gsap.registerPlugin(ScrollTrigger)

// ---------------------------------------------------------------------------
// Filter bar
// ---------------------------------------------------------------------------
function initFilter() {
  const buttons = document.querySelectorAll('[data-filter]')
  const groups = document.querySelectorAll('.work-group[data-group]')
  if (!buttons.length) return

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter

      // Update aria-pressed
      buttons.forEach((b) => b.setAttribute('aria-pressed', 'false'))
      btn.setAttribute('aria-pressed', 'true')

      // Show / hide groups
      groups.forEach((group) => {
        if (filter === 'all' || group.dataset.group === filter) {
          group.removeAttribute('hidden')
        } else {
          group.setAttribute('hidden', '')
        }
      })

      // Let ScrollTrigger recalculate positions
      ScrollTrigger.refresh()
    })
  })
}

// ---------------------------------------------------------------------------
// Lightbox
// ---------------------------------------------------------------------------
function initLightbox() {
  const dialog = document.getElementById('lightbox')
  if (!dialog) return

  const img = dialog.querySelector('.lightbox__img')
  const closeBtn = dialog.querySelector('.lightbox__close')
  const prevBtn = dialog.querySelector('.lightbox__prev')
  const nextBtn = dialog.querySelector('.lightbox__next')

  let currentItems = []
  let currentIndex = 0

  function open(items, index) {
    currentItems = items
    currentIndex = index
    updateImage()
    dialog.showModal()
  }

  function close() {
    dialog.close()
  }

  function updateImage() {
    const item = currentItems[currentIndex]
    img.src = item.full
    img.alt = item.alt
    prevBtn.disabled = currentItems.length <= 1
    nextBtn.disabled = currentItems.length <= 1
  }

  function prev() {
    currentIndex = (currentIndex - 1 + currentItems.length) % currentItems.length
    updateImage()
  }

  function next() {
    currentIndex = (currentIndex + 1) % currentItems.length
    updateImage()
  }

  // Wire gallery buttons
  document.querySelectorAll('.work-gallery__item button').forEach((btn) => {
    btn.addEventListener('click', () => {
      const gallery = btn.closest('.work-gallery')
      const allItems = [...gallery.querySelectorAll('.work-gallery__item button')].map((b) => ({
        full: b.dataset.full,
        alt: b.querySelector('img').alt,
      }))
      const index = [...gallery.querySelectorAll('.work-gallery__item button')].indexOf(btn)
      open(allItems, index)
    })
  })

  // Close button
  closeBtn.addEventListener('click', close)

  // Click on backdrop (outside dialog content)
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) close()
  })

  // Prev / next buttons
  prevBtn.addEventListener('click', prev)
  nextBtn.addEventListener('click', next)

  // Keyboard
  dialog.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') prev()
    if (e.key === 'ArrowRight') next()
  })
}

// ---------------------------------------------------------------------------
// Bootstrap
// ---------------------------------------------------------------------------
function initApp() {
  // Respect prefers-reduced-motion: skip scroll animations when active
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.classList.add('reduce-motion')
    initMenu()
    initBackToTop()
    initFilter()
    initLightbox()
    return
  }

  initMenu()
  initFadeUp()
  initBlurReveal()
  initBackToTop()
  initFilter()
  initLightbox()

  setTimeout(() => ScrollTrigger.refresh(), 150)
  setTimeout(() => ScrollTrigger.refresh(), 800)
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp)
} else {
  initApp()
}

window.addEventListener('load', () => {
  ScrollTrigger.refresh()
})
