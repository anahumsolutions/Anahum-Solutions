import { initMenu } from './anim/menu.js'
import { initAllGlassButtons } from './anim/glass-button.js'

function initApp() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.classList.add('reduce-motion')
    initMenu()
    return
  }

  initMenu()
  initAllGlassButtons()
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp)
} else {
  initApp()
}
