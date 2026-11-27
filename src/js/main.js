import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register plugins globally
gsap.registerPlugin(ScrollTrigger)

import { initHeroEntrance } from './anim/hero-entrance.js'
import { initHeroVideo } from './anim/hero-video.js'
import { initMenu, initStickyHeader } from './anim/menu.js'
import { initFadeUp } from './anim/fade-up.js'
import { initBlurReveal } from './anim/blur-reveal.js'
import { initWordBlur } from './anim/word-blur.js'
import { initLogo3D } from './anim/logo-3d.js'
import { initHeroNodesDrift } from './anim/hero-nodes-drift.js'
import { initBackToTop } from './anim/back-to-top.js'
import { initContactForm } from './contact-form.js'
import { initSelectedWorks } from './anim/selected-works.js'
import { initServicesTabs } from './anim/services-tabs.js'
import { initAllGlassButtons } from './anim/glass-button.js'

/**
 * Application Bootstrap & Animation Registry
 * Starts animations unconditionally without blocking on font promises.
 */
function initApp() {
  initStickyHeader()
  initHeroVideo()
  initMenu()
  initServicesTabs()
  initBackToTop()
  initContactForm()

  // Respect prefers-reduced-motion: skip motion animations while keeping all core behavior
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.classList.add('reduce-motion')
    document.documentElement.classList.remove('hero-anim-ready')
    initSelectedWorks()
    return
  }

  // 1. Hero Load Entrance (fires immediately)
  initHeroEntrance()

  // 2. Scroll Reveals & Interactive Modules
  initFadeUp()
  initBlurReveal()
  initWordBlur()
  initLogo3D()
  initHeroNodesDrift()
  initSelectedWorks()
  initAllGlassButtons()

  // 3. Single debounced ScrollTrigger refresh after fonts & load settle
  let refreshTimer = 0
  const scheduleRefresh = () => {
    clearTimeout(refreshTimer)
    refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 80)
  }

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(scheduleRefresh).catch(() => {})
  }
  window.addEventListener('load', scheduleRefresh, { once: true })
}

// Start immediately
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp)
} else {
  initApp()
}
