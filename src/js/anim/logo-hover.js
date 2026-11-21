import { gsap } from 'gsap'

/**
 * Logo stage interactions (What We Do section)
 * 1. Magnetic pull and tilt toward the cursor, with an elastic return (mouse only)
 * 2. Glow spotlight that follows the cursor (mouse only)
 * 3. Click / tap ripple rings from the icon (all devices)
 * The shine sweep is pure CSS (see .logo-stage__shine).
 */
export function initLogoHover() {
  const stage = document.querySelector('[data-logo-hover]')
  if (!stage) return

  const magnet = stage.querySelector('.logo-stage__magnet')
  const tilt = stage.querySelector('.logo-stage__tilt')
  const ripples = stage.querySelector('.logo-stage__ripples')
  if (!magnet || !tilt) return

  const hasMouse = window.matchMedia('(hover: hover) and (pointer: fine)').matches

  if (hasMouse) {
    stage.addEventListener('pointermove', (event) => {
      const box = stage.getBoundingClientRect()
      const px = (event.clientX - box.left) / box.width - 0.5
      const py = (event.clientY - box.top) / box.height - 0.5

      gsap.to(magnet, {
        x: px * 70,
        y: py * 50,
        duration: 0.9,
        ease: 'power3.out',
        overwrite: 'auto',
      })
      gsap.to(tilt, {
        rotationY: px * 24,
        rotationX: -py * 24,
        duration: 0.9,
        ease: 'power3.out',
        overwrite: 'auto',
      })

      stage.style.setProperty('--mx', `${(px + 0.5) * 100}%`)
      stage.style.setProperty('--my', `${(py + 0.5) * 100}%`)
    })

    stage.addEventListener('pointerleave', () => {
      const back = { duration: 1.4, ease: 'elastic.out(1, 0.4)', overwrite: 'auto' }
      gsap.to(magnet, { x: 0, y: 0, ...back })
      gsap.to(tilt, { rotationX: 0, rotationY: 0, ...back })
      stage.style.setProperty('--mx', '50%')
      stage.style.setProperty('--my', '50%')
    })
  }

  if (ripples) {
    stage.addEventListener('click', () => {
      if (ripples.children.length > 6) return
      for (let i = 0; i < 2; i += 1) {
        const ring = document.createElement('span')
        ring.className = 'logo-stage__ring'
        ripples.appendChild(ring)
        gsap.set(ring, { xPercent: -50, yPercent: -50 })
        gsap.fromTo(
          ring,
          { scale: 0.35, opacity: 0.85 },
          {
            scale: 2.6,
            opacity: 0,
            duration: 1.4,
            delay: i * 0.22,
            ease: 'power2.out',
            immediateRender: false,
            onComplete: () => ring.remove(),
          },
        )
      }
    })
  }
}
