import { initMenu } from './anim/menu.js'

function initApp() {
  initMenu()
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp)
} else {
  initApp()
}
