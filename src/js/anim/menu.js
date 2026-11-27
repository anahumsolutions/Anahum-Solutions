/**
 * Floating Header Menu & Sticky Visibility Controller
 * Manages accessible open/close states, Esc key closure, focus return, and header visibility.
 */
export function initStickyHeader({ alwaysVisible = false } = {}) {
  const header = document.querySelector('.site-header')
  if (!header) return () => {}

  const hero = document.getElementById('hero')
  if (alwaysVisible || !hero || !('IntersectionObserver' in window)) {
    header.classList.add('is-scrolled')
    return () => {}
  }

  const updateFromEntry = (entry) => {
    const pastHero =
      !entry.isIntersecting || (entry.intersectionRatio <= 0.2 && entry.boundingClientRect.top < 0)
    header.classList.toggle('is-scrolled', pastHero)
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(updateFromEntry)
    },
    { threshold: [0, 0.2] },
  )

  observer.observe(hero)
  return () => observer.disconnect()
}

export function initMenu() {
  const toggleBtn = document.getElementById('menuToggle')
  const menu = document.getElementById('mainMenu')
  if (!toggleBtn || !menu) return

  function openMenu() {
    toggleBtn.setAttribute('aria-expanded', 'true')
    menu.setAttribute('aria-hidden', 'false')
    menu.classList.add('is-open')
    const firstLink = menu.querySelector('a, button')
    if (firstLink) firstLink.focus()
  }

  function closeMenu({ returnFocus = false } = {}) {
    toggleBtn.setAttribute('aria-expanded', 'false')
    menu.setAttribute('aria-hidden', 'true')
    menu.classList.remove('is-open')
    if (returnFocus) toggleBtn.focus()
  }

  toggleBtn.addEventListener('click', () => {
    const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true'
    if (isExpanded) {
      closeMenu({ returnFocus: false })
    } else {
      openMenu()
    }
  })

  // Close on Escape and return focus to toggle button
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && toggleBtn.getAttribute('aria-expanded') === 'true') {
      closeMenu({ returnFocus: true })
    }
  })

  // Close when clicking outside without stealing focus
  document.addEventListener('click', (e) => {
    if (
      toggleBtn.getAttribute('aria-expanded') === 'true' &&
      !menu.contains(e.target) &&
      !toggleBtn.contains(e.target)
    ) {
      closeMenu({ returnFocus: false })
    }
  })

  // Close menu when clicking navigation link without yanking focus back to header
  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      closeMenu({ returnFocus: false })
    })
  })
}
