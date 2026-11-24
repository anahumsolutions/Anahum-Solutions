/**
 * Hero Nodes Drift
 * Pushes the 5 service-box cards gently away from the mouse cursor.
 * Movement is applied via --dx / --dy custom properties on each hero__node;
 * the CSS transition handles all smoothing — no GSAP, no spring maths here.
 */
export function initHeroNodesDrift() {
  const hero = document.getElementById('hero')
  if (!hero) return

  const nodes = Array.from(hero.querySelectorAll('.hero__node'))
  if (!nodes.length) return

  // Only run on mouse (hover: hover, pointer: fine) devices
  const mouseQuery = window.matchMedia('(hover: hover) and (pointer: fine)')
  if (!mouseQuery.matches) return

  const RADIUS = 170 // px: influence radius around card resting centre
  const MAX_PUSH = 12 // px: maximum drift distance

  // Per-node state: last applied drift so we can compute resting centre
  const drift = nodes.map(() => ({ dx: 0, dy: 0 }))

  let mouse = { x: -9999, y: -9999 }
  let rafPending = false
  let active = false // only true when wide screen

  // ── width gate ────────────────────────────────────────────────────────────
  const wideQuery = window.matchMedia('(min-width: 1101px)')

  function resetAll() {
    nodes.forEach((node, i) => {
      drift[i].dx = 0
      drift[i].dy = 0
      node.style.setProperty('--dx', '0px')
      node.style.setProperty('--dy', '0px')
    })
  }

  function onWidthChange() {
    active = wideQuery.matches
    if (!active) resetAll()
  }

  wideQuery.addEventListener('change', onWidthChange)
  active = wideQuery.matches

  // ── per-frame update ──────────────────────────────────────────────────────
  function update() {
    rafPending = false
    if (!active) return

    nodes.forEach((node, i) => {
      const card = node.querySelector('.hero__node-card')
      if (!card) return

      const rect = card.getBoundingClientRect()

      // Resting centre = current visual centre minus last applied drift
      const cx = rect.left + rect.width / 2 - drift[i].dx
      const cy = rect.top + rect.height / 2 - drift[i].dy

      const rawDx = mouse.x - cx
      const rawDy = mouse.y - cy
      const dist = Math.sqrt(rawDx * rawDx + rawDy * rawDy)

      let newDx = 0
      let newDy = 0

      if (dist > 0 && dist < RADIUS) {
        // Quadratic falloff: strongest at dist=0, zero at dist=RADIUS
        const t = 1 - dist / RADIUS
        const strength = MAX_PUSH * t * t
        // Push directly away from cursor
        newDx = -(rawDx / dist) * strength
        newDy = -(rawDy / dist) * strength
      }

      if (newDx !== drift[i].dx || newDy !== drift[i].dy) {
        drift[i].dx = newDx
        drift[i].dy = newDy
        node.style.setProperty('--dx', `${newDx.toFixed(3)}px`)
        node.style.setProperty('--dy', `${newDy.toFixed(3)}px`)
      }
    })
  }

  function scheduleUpdate() {
    if (!rafPending) {
      rafPending = true
      requestAnimationFrame(update)
    }
  }

  // ── pointer tracking ──────────────────────────────────────────────────────
  hero.addEventListener(
    'pointermove',
    (e) => {
      if (!active) return
      mouse.x = e.clientX
      mouse.y = e.clientY
      scheduleUpdate()
    },
    { passive: true },
  )

  hero.addEventListener(
    'pointerleave',
    () => {
      resetAll()
    },
    { passive: true },
  )

  // ── focus / visibility ────────────────────────────────────────────────────
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) resetAll()
  })

  window.addEventListener('blur', resetAll, { passive: true })
}
