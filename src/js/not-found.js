import { initMenu, initStickyHeader } from './anim/menu.js'
import { initAllGlassButtons } from './anim/glass-button.js'

function initApp() {
  initStickyHeader({ alwaysVisible: true })
  initMenu()

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.classList.add('reduce-motion')
    return
  }

  initAllGlassButtons()
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp)
} else {
  initApp()
}
