import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register plugins globally
gsap.registerPlugin(ScrollTrigger)

import { initHeroEntrance } from './anim/hero-entrance.js'
import { initHeroVideo } from './anim/hero-video.js'
import { initMenu } from './anim/menu.js'
import { initFadeUp } from './anim/fade-up.js'
import { initBlurReveal } from './anim/blur-reveal.js'
import { initWordBlur } from './anim/word-blur.js'
import { initStatCounter } from './anim/stat-counter.js'
import { initServicesTabs } from './anim/services-tabs.js'
import { initPanelScale } from './anim/panel-scale.js'
import { initPricingToggle } from './anim/pricing-toggle.js'
import { initOrbit } from './anim/orbit.js'
import { initBackToTop } from './anim/back-to-top.js'

/**
 * Application Bootstrap & Animation Registry
 * Starts animations unconditionally without blocking on font promises.
 */
function initApp() {
  // 1. Hero Load Entrance (fires immediately)
  initHeroEntrance()
  initHeroVideo()

  // 2. Interactive Components
  initMenu()
  initServicesTabs()
  initPricingToggle()
  initBackToTop()

  // 3. ScrollTrigger & Physics Modules
  initStatCounter()
  initFadeUp()
  initBlurReveal()
  initWordBlur()
  initPanelScale()
  initOrbit()

  // 4. Force trigger refreshes
  setTimeout(() => ScrollTrigger.refresh(), 150)
  setTimeout(() => ScrollTrigger.refresh(), 800)

  // If fonts resolve, refresh triggers without blocking initialization
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready
      .then(() => {
        ScrollTrigger.refresh()
      })
      .catch(() => {})
  }

  window.addEventListener('load', () => {
    ScrollTrigger.refresh()
  })
}

// Start immediately
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp)
} else {
  initApp()
}
