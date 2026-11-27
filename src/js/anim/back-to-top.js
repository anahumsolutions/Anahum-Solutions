/**
 * Back To Top Controller
 * Toggles visibility after 300px scroll (rAF-throttled) and handles smooth scrolling to top.
 */
export function initBackToTop() {
  const btn = document.getElementById('backToTop')
  if (!btn) return

  let rafPending = false
  let visible = false

  function update() {
    rafPending = false
    const shouldShow = window.scrollY > 300
    if (shouldShow !== visible) {
      visible = shouldShow
      btn.classList.toggle('is-visible', visible)
    }
  }

  window.addEventListener(
    'scroll',
    () => {
      if (!rafPending) {
        rafPending = true
        requestAnimationFrame(update)
      }
    },
    { passive: true },
  )

  update()

  btn.addEventListener('click', () => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({
      top: 0,
      behavior: reduce ? 'auto' : 'smooth',
    })
  })
}
