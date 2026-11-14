/**
 * Hero Video Playback
 * - Fades the video in over the poster once it is actually playing
 * - Pauses when the hero is off-screen (saves battery and CPU)
 * - Stays on the still poster for visitors who prefer reduced motion
 *   or have Data Saver turned on
 * - If autoplay is blocked (e.g. Low Power Mode), the poster simply stays
 */
export function initHeroVideo() {
  const video = document.getElementById('heroVideo')
  const hero = document.getElementById('hero')
  if (!video || !hero) return

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
  const saveData = navigator.connection && navigator.connection.saveData === true

  const stayStill = () => reducedMotion.matches || saveData

  const showPoster = () => {
    video.pause()
    video.classList.remove('is-playing')
  }

  // Fade in only when frames are really playing
  video.addEventListener('playing', () => {
    if (stayStill()) {
      showPoster()
      return
    }
    video.classList.add('is-playing')
  })

  if (stayStill()) {
    showPoster()
    video.removeAttribute('autoplay')
    video.preload = 'none'
  } else {
    const attempt = video.play()
    if (attempt && typeof attempt.catch === 'function') {
      attempt.catch(() => {
        // Autoplay blocked: keep the poster image visible
        video.classList.remove('is-playing')
      })
    }
  }

  // Pause off-screen, resume on return
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (stayStill()) return
          if (entry.isIntersecting) {
            const p = video.play()
            if (p && typeof p.catch === 'function') p.catch(() => {})
          } else {
            video.pause()
          }
        })
      },
      { threshold: 0.05 },
    )
    observer.observe(hero)
  }

  // React if the visitor changes the reduced-motion setting while on the page
  reducedMotion.addEventListener('change', () => {
    if (stayStill()) {
      showPoster()
    } else {
      const p = video.play()
      if (p && typeof p.catch === 'function') p.catch(() => {})
    }
  })
}
