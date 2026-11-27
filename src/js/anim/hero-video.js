/**
 * Hero Video Playback
 * - Lets hero poster & critical text load first, then starts video after window load
 * - Fades the video in over the poster once it is actually playing
 * - Pauses when the hero is off-screen (saves battery and CPU)
 * - Stays on the still poster for visitors who prefer reduced motion or Save-Data
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
    video.removeAttribute('autoplay')
    video.preload = 'none'
  }

  const startPlayback = () => {
    if (stayStill()) {
      showPoster()
      return
    }
    video.preload = 'auto'
    const attempt = video.play()
    if (attempt && typeof attempt.catch === 'function') {
      attempt.catch(() => {
        video.classList.remove('is-playing')
      })
    }
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
  } else if (document.readyState === 'complete') {
    startPlayback()
  } else {
    window.addEventListener('load', startPlayback, { once: true })
  }

  // Pause off-screen, resume on return
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (stayStill()) return
          if (entry.isIntersecting) {
            if (document.readyState === 'complete') {
              startPlayback()
            }
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
      startPlayback()
    }
  })
}
