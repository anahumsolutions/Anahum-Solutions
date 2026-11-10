/**
 * Back To Top Controller
 * Toggles visibility after 300px scroll and handles smooth scrolling to top.
 */
export function initBackToTop() {
  const btn = document.getElementById('backToTop')
  if (!btn) return

  window.addEventListener(
    'scroll',
    () => {
      if (window.scrollY > 300) {
        btn.classList.add('is-visible')
      } else {
        btn.classList.remove('is-visible')
      }
    },
    { passive: true },
  )

  btn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  })
}
