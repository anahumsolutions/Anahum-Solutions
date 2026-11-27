import { gsap } from 'gsap'

/**
 * Generates a soft procedural radial contact shadow texture on an offscreen canvas.
 */
function createContactShadowTexture(THREE) {
  const size = 256
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')

  const grad = ctx.createRadialGradient(
    size / 2,
    size / 2,
    size * 0.05,
    size / 2,
    size / 2,
    size * 0.48,
  )
  grad.addColorStop(0, 'rgba(36, 14, 7, 0.24)')
  grad.addColorStop(0.45, 'rgba(36, 14, 7, 0.11)')
  grad.addColorStop(0.78, 'rgba(36, 14, 7, 0.025)')
  grad.addColorStop(1, 'rgba(36, 14, 7, 0)')

  ctx.fillStyle = grad
  ctx.fillRect(0, 0, size, size)

  const tex = new THREE.CanvasTexture(canvas)
  tex.needsUpdate = true
  return tex
}

/**
 * Interactive 3D Logo (What We Do section)
 * - Lazy-loads three.js only when container is near the viewport
 * - Entrance: staggered depth-and-scale animation via ScrollTrigger
 * - Idle: sphere floats on a gentle sine wave
 * - Hover (mouse only): sculpture tilts toward cursor, sphere dodges
 * - Drag to spin: 360 deg horizontal, +/-35 deg vertical, springs back on release
 * - Click pulse: subtle sphere flash + kickback wave through arches
 */
export function initLogo3D() {
  const container = document.querySelector('[data-logo-3d]')
  if (!container) return

  const stage = container.querySelector('.logo-3d__stage')
  if (!stage) return

  // Respect prefers-reduced-motion -- CSS already shows the fallback; just bail.
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  const hasMouse = window.matchMedia('(hover: hover) and (pointer: fine)').matches

  // Lazy-load three only when container is within ~400px of viewport
  let loaded = false
  let loadObserver = null

  function loadAndInit() {
    if (loaded) return
    loaded = true
    if (loadObserver) {
      loadObserver.disconnect()
      loadObserver = null
    }

    Promise.all([
      import('three'),
      import('three/addons/environments/RoomEnvironment.js'),
      import('./logo-3d-shape.js'),
    ])
      .then(([THREE_MOD, ROOM_MOD, SHAPE_MOD]) => {
        const THREE = THREE_MOD
        const RoomEnvironment = ROOM_MOD.RoomEnvironment
        buildScene(THREE, RoomEnvironment, SHAPE_MOD)
      })
      .catch(() => {
        // Dynamic import failed -- show fallback
        container.classList.add('is-fallback')
      })
  }

  if ('IntersectionObserver' in window) {
    loadObserver = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          loadAndInit()
        }
      },
      { rootMargin: '400px 0px' },
    )
    loadObserver.observe(container)
  } else {
    loadAndInit()
  }

  function buildScene(THREE, RoomEnvironment, { createArchShape, extrudeSettings, extrudeDepth }) {
    // -----------------------------------------------------------------
    // Renderer -- transparent canvas mounted into the stage element
    // -----------------------------------------------------------------
    let renderer
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      })
    } catch (_) {
      // WebGL unavailable -- show fallback
      container.classList.add('is-fallback')
      return
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.setClearAlpha(0)
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.12
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.domElement.style.display = 'block'
    renderer.domElement.style.width = '100%'
    renderer.domElement.style.height = '100%'
    stage.appendChild(renderer.domElement)

    // Handle WebGL context loss -- stop loop, remove canvas and show fallback
    renderer.domElement.addEventListener('webglcontextlost', () => {
      stopLoop()
      renderer.domElement.remove()
      container.classList.remove('is-ready')
      container.classList.add('is-fallback')
    })

    // -----------------------------------------------------------------
    // Scene & Camera
    // -----------------------------------------------------------------
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 50)
    camera.position.set(0, 0.05, 8.2)

    // Studio HDRI reflections via RoomEnvironment
    const pmremGenerator = new THREE.PMREMGenerator(renderer)
    const roomEnv = new RoomEnvironment()
    const envRT = pmremGenerator.fromScene(roomEnv, 0.04)
    scene.environment = envRT.texture
    roomEnv.dispose()
    pmremGenerator.dispose()

    // -----------------------------------------------------------------
    // Lighting rig
    // -----------------------------------------------------------------
    const hemiLight = new THREE.HemisphereLight(0xfff8f0, 0x4a2518, 0.95)
    scene.add(hemiLight)

    const keyLight = new THREE.DirectionalLight(0xfff4e6, 2.25)
    keyLight.position.set(-4.2, 5.2, 6.0)
    keyLight.castShadow = true
    keyLight.shadow.mapSize.set(1024, 1024)
    keyLight.shadow.camera.near = 1
    keyLight.shadow.camera.far = 18
    keyLight.shadow.camera.left = -3.5
    keyLight.shadow.camera.right = 3.5
    keyLight.shadow.camera.top = 3.5
    keyLight.shadow.camera.bottom = -3.5
    keyLight.shadow.bias = -0.0005
    keyLight.shadow.radius = 4
    scene.add(keyLight)

    const rimLight = new THREE.DirectionalLight(0xffe2c8, 1.45)
    rimLight.position.set(4.5, 2.8, -4.2)
    scene.add(rimLight)

    // Cursor-following soft specular highlight
    const cursorLight = new THREE.PointLight(0xffe6d0, 1.35, 11, 1.4)
    cursorLight.position.set(0, 0.5, 3.0)
    scene.add(cursorLight)

    // -----------------------------------------------------------------
    // Geometry & Materials -- Brushed Bronze
    // -----------------------------------------------------------------
    const logoGroup = new THREE.Group()
    scene.add(logoGroup)

    const archMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0x3d2114),
      roughness: 0.32,
      metalness: 0.7,
      envMapIntensity: 1.35,
    })

    const sphereMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xf24405,
      emissive: 0xd93800,
      emissiveIntensity: 0.36,
      roughness: 0.18,
      metalness: 0.1,
      clearcoat: 1.0,
      clearcoatRoughness: 0.12,
      envMapIntensity: 1.1,
    })

    const outerShape = createArchShape(THREE, 1.62, -1.42, 1.68, 0.28)
    const outerGeo = new THREE.ExtrudeGeometry(outerShape, extrudeSettings)
    outerGeo.translate(0, 0, -extrudeDepth / 2)
    outerGeo.computeVertexNormals()
    const outerArch = new THREE.Mesh(outerGeo, archMaterial)
    outerArch.castShadow = true
    outerArch.receiveShadow = true
    logoGroup.add(outerArch)

    const innerShape = createArchShape(THREE, 0.84, -1.42, 0.19, 0.25)
    const innerGeo = new THREE.ExtrudeGeometry(innerShape, extrudeSettings)
    innerGeo.translate(0, 0, -extrudeDepth / 2)
    innerGeo.computeVertexNormals()
    const innerArch = new THREE.Mesh(innerGeo, archMaterial)
    innerArch.castShadow = true
    innerArch.receiveShadow = true
    logoGroup.add(innerArch)

    // Sphere group: sphere mesh + warm glow point light
    const sphereGroup = new THREE.Group()
    logoGroup.add(sphereGroup)

    const sphereGeo = new THREE.SphereGeometry(0.34, 64, 64)
    const sphereMesh = new THREE.Mesh(sphereGeo, sphereMaterial)
    sphereMesh.castShadow = true
    sphereMesh.receiveShadow = true
    sphereGroup.add(sphereMesh)

    const sphereGlowLight = new THREE.PointLight(0xff5511, 2.7, 4.8, 2)
    sphereGlowLight.position.set(0, 0, 0.12)
    sphereGroup.add(sphereGlowLight)

    // Contact shadow plane
    const shadowTex = createContactShadowTexture(THREE)
    const shadowPlaneGeo = new THREE.PlaneGeometry(4.4, 1.35)
    const shadowPlaneMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      opacity: 0.72,
      depthWrite: false,
    })
    const contactShadow = new THREE.Mesh(shadowPlaneGeo, shadowPlaneMat)
    contactShadow.rotation.x = -Math.PI / 2
    contactShadow.position.set(0, -1.86, 0)
    scene.add(contactShadow)

    // -----------------------------------------------------------------
    // Base resting positions
    // -----------------------------------------------------------------
    const BASE_POS = {
      outerZ: -0.15,
      innerZ: 0.08,
      sphereX: 0,
      sphereY: -1.14,
      sphereZ: 0.34,
    }

    // -----------------------------------------------------------------
    // Composable animation state layers
    // -----------------------------------------------------------------
    const entranceState = {
      outerZ: 0,
      innerZ: 0,
      sphereZ: 0,
      outerScale: 1,
      innerScale: 1,
      sphereScale: 1,
      rotY: 0,
      rotX: 0,
    }

    const hoverState = {
      tiltX: 0,
      tiltY: 0,
      outerX: 0,
      outerY: 0,
      innerX: 0,
      innerY: 0,
      sphereX: 0,
      sphereY: 0,
      lightX: 0,
      lightY: 0.5,
    }

    const dragState = { rotX: 0, rotY: 0 }

    const pulseState = {
      outerZ: 0,
      innerZ: 0,
      sphereZ: 0,
      scaleX: 1,
      scaleY: 1,
      scaleZ: 1,
    }

    const appState = {
      isDragging: false,
      pointerDownX: 0,
      pointerDownY: 0,
      lastPointerX: 0,
      lastPointerY: 0,
      dragDistance: 0,
      pointerDownTime: 0,
    }

    // -----------------------------------------------------------------
    // GSAP quickTo for silky cursor response
    // -----------------------------------------------------------------
    const qtTiltX = gsap.quickTo(hoverState, 'tiltX', { duration: 0.75, ease: 'power3.out' })
    const qtTiltY = gsap.quickTo(hoverState, 'tiltY', { duration: 0.75, ease: 'power3.out' })
    const qtOuterX = gsap.quickTo(hoverState, 'outerX', { duration: 0.85, ease: 'power3.out' })
    const qtOuterY = gsap.quickTo(hoverState, 'outerY', { duration: 0.85, ease: 'power3.out' })
    const qtInnerX = gsap.quickTo(hoverState, 'innerX', { duration: 0.7, ease: 'power3.out' })
    const qtInnerY = gsap.quickTo(hoverState, 'innerY', { duration: 0.7, ease: 'power3.out' })
    const qtSphereX = gsap.quickTo(hoverState, 'sphereX', { duration: 0.52, ease: 'power3.out' })
    const qtSphereY = gsap.quickTo(hoverState, 'sphereY', { duration: 0.52, ease: 'power3.out' })
    const qtLightX = gsap.quickTo(hoverState, 'lightX', { duration: 0.4, ease: 'power2.out' })
    const qtLightY = gsap.quickTo(hoverState, 'lightY', { duration: 0.4, ease: 'power2.out' })

    // -----------------------------------------------------------------
    // Entrance animation (once, on scroll)
    // -----------------------------------------------------------------
    function playEntrance() {
      // Set hidden starting state
      entranceState.outerZ = -2.2
      entranceState.innerZ = -0.9
      entranceState.sphereZ = 2.4
      entranceState.outerScale = 0.72
      entranceState.innerScale = 0.65
      entranceState.sphereScale = 0.01
      entranceState.rotY = -0.62
      entranceState.rotX = 0.22

      // Show canvas, fade in stage
      container.classList.add('is-ready')

      const tl = gsap.timeline({ defaults: { ease: 'back.out(1.4)' } })

      tl.to(entranceState, { rotY: 0, rotX: 0, duration: 1.35, ease: 'power3.out' }, 0)
        .to(entranceState, { outerZ: 0, outerScale: 1, duration: 1.0 }, 0.05)
        .to(entranceState, { innerZ: 0, innerScale: 1, duration: 1.0 }, 0.17)
        .to(
          entranceState,
          { sphereZ: 0, sphereScale: 1, duration: 0.95, ease: 'back.out(1.4)' },
          0.29,
        )

      return tl
    }

    let entrancePlayed = false
    let entranceObserver = null
    if ('IntersectionObserver' in window) {
      entranceObserver = new IntersectionObserver(
        (entries) => {
          if (!entrancePlayed && entries.some((entry) => entry.isIntersecting)) {
            entrancePlayed = true
            entranceObserver.disconnect()
            entranceObserver = null
            playEntrance()
          }
        },
        { rootMargin: '0px 0px -25% 0px' },
      )
      entranceObserver.observe(container)
    } else {
      playEntrance()
    }

    // -----------------------------------------------------------------
    // Click pulse -- subtle sphere flash + depth kickback through arches
    // -----------------------------------------------------------------
    let pulseTl = null
    function triggerClickPulse() {
      if (pulseTl) pulseTl.kill()
      pulseTl = gsap.timeline()

      // Sphere flashes brighter
      pulseTl
        .to(sphereMaterial, { emissiveIntensity: 1.6, duration: 0.4, ease: 'power2.out' }, 0)
        .to(sphereGlowLight, { intensity: 6.5, duration: 0.4, ease: 'power2.out' }, 0)
        .to(sphereMaterial, { emissiveIntensity: 0.36, duration: 0.6, ease: 'power2.out' }, 0.4)
        .to(sphereGlowLight, { intensity: 2.7, duration: 0.6, ease: 'power2.out' }, 0.4)
        // Kickback: outer arch first, then inner arch ~0.08s later
        .to(pulseState, { outerZ: -0.22, duration: 0.14, ease: 'power2.out' }, 0.06)
        .to(pulseState, { outerZ: 0, duration: 0.6, ease: 'power2.out' }, 0.2)
        .to(pulseState, { innerZ: -0.18, duration: 0.14, ease: 'power2.out' }, 0.14)
        .to(pulseState, { innerZ: 0, duration: 0.6, ease: 'power2.out' }, 0.28)
    }

    // -----------------------------------------------------------------
    // Hover / cursor parallax (mouse only)
    // -----------------------------------------------------------------
    function handleCursorParallax(clientX, clientY, rect = container.getBoundingClientRect()) {
      if (!rect.width || !rect.height) return
      const nx = THREE.MathUtils.clamp(((clientX - rect.left) / rect.width) * 2 - 1, -1.25, 1.25)
      const ny = THREE.MathUtils.clamp(-(((clientY - rect.top) / rect.height) * 2 - 1), -1.25, 1.25)

      qtLightX(nx * 2.8)
      qtLightY(ny * 2.2)

      if (appState.isDragging) return

      qtTiltY(nx * 0.14) // ~8 deg max
      qtTiltX(-ny * 0.1)
      qtOuterX(nx * 0.025)
      qtOuterY(ny * 0.02)
      qtInnerX(nx * 0.065)
      qtInnerY(ny * 0.05)

      // Sphere dodge: repel from cursor inside inner arch cavity
      const sphereNormY = -0.34
      const dx = nx - 0
      const dy = ny - sphereNormY
      const dist = Math.hypot(dx, dy)
      const repelRadius = 0.85

      if (dist < repelRadius && dist > 0.001) {
        const strength = (1 - dist / repelRadius) * 0.19
        const pushX = (-dx / dist) * strength
        const pushY = (-dy / dist) * strength
        qtSphereX(THREE.MathUtils.clamp(pushX, -0.155, 0.155))
        qtSphereY(THREE.MathUtils.clamp(pushY, -0.13, 0.18))
      } else {
        qtSphereX(0)
        qtSphereY(0)
      }
    }

    function resetHoverParallax() {
      qtTiltX(0)
      qtTiltY(0)
      qtOuterX(0)
      qtOuterY(0)
      qtInnerX(0)
      qtInnerY(0)
      qtSphereX(0)
      qtSphereY(0)
      qtLightX(0)
      qtLightY(0.5)
    }

    let isVisible = false
    let containerRect = null
    let rectRaf = 0

    function invalidateRect() {
      containerRect = null
    }

    function onWindowPointerMove(e) {
      if (appState.isDragging) {
        const dx = e.clientX - appState.lastPointerX
        const dy = e.clientY - appState.lastPointerY
        appState.dragDistance += Math.hypot(dx, dy)
        appState.lastPointerX = e.clientX
        appState.lastPointerY = e.clientY

        dragState.rotY += dx * 0.0115
        dragState.rotX = THREE.MathUtils.clamp(dragState.rotX + dy * 0.0095, -0.61, 0.61)
        return
      }
      if (!isVisible || document.hidden) return
      if (!containerRect) {
        containerRect = container.getBoundingClientRect()
      }
      handleCursorParallax(e.clientX, e.clientY, containerRect)
    }

    if (hasMouse) {
      window.addEventListener('pointermove', onWindowPointerMove, { passive: true })
      window.addEventListener('scroll', invalidateRect, { passive: true })
      document.addEventListener('pointerleave', resetHoverParallax)
    }

    // -----------------------------------------------------------------
    // Drag to spin -- pointer capture on the stage
    // -----------------------------------------------------------------
    stage.addEventListener('pointerdown', (e) => {
      if (e.button !== 0 && e.pointerType === 'mouse') return

      gsap.killTweensOf(dragState)

      appState.isDragging = true
      appState.pointerDownX = e.clientX
      appState.pointerDownY = e.clientY
      appState.lastPointerX = e.clientX
      appState.lastPointerY = e.clientY
      appState.dragDistance = 0
      appState.pointerDownTime = Date.now()

      stage.classList.add('is-dragging')
      try {
        stage.setPointerCapture(e.pointerId)
      } catch (_) {}
    })

    function handlePointerRelease(e) {
      if (!appState.isDragging) return
      appState.isDragging = false
      stage.classList.remove('is-dragging')

      try {
        stage.releasePointerCapture(e.pointerId)
      } catch (_) {}

      const elapsed = Date.now() - appState.pointerDownTime
      if (appState.dragDistance < 6 && elapsed < 300) {
        triggerClickPulse()
      } else {
        // Spring back to front along shortest path
        const twoPi = Math.PI * 2
        dragState.rotY = ((dragState.rotY % twoPi) + twoPi) % twoPi
        if (dragState.rotY > Math.PI) dragState.rotY -= twoPi

        gsap.to(dragState, {
          rotX: 0,
          rotY: 0,
          duration: 1.2,
          ease: 'power3.out',
        })
      }
    }

    // Touch: only horizontal drag rotates; vertical touch scrolls the page
    stage.addEventListener('pointermove', (e) => {
      if (!appState.isDragging) return
      if (e.pointerType === 'touch') {
        // Only update horizontal for touch; skip vertical so pan-y works
        const dx = e.clientX - appState.lastPointerX
        appState.dragDistance += Math.abs(dx)
        dragState.rotY += dx * 0.0115
      } else {
        const dx = e.clientX - appState.lastPointerX
        const dy = e.clientY - appState.lastPointerY
        appState.dragDistance += Math.hypot(dx, dy)
        dragState.rotY += dx * 0.0115
        dragState.rotX = THREE.MathUtils.clamp(dragState.rotX + dy * 0.0095, -0.61, 0.61)
      }
      appState.lastPointerX = e.clientX
      appState.lastPointerY = e.clientY
    })

    stage.addEventListener('pointerup', handlePointerRelease)
    stage.addEventListener('pointercancel', handlePointerRelease)

    // -----------------------------------------------------------------
    // Resize observer
    // -----------------------------------------------------------------
    function updateViewportSize() {
      containerRect = null
      const width = Math.max(container.clientWidth, 1)
      const height = Math.max(container.clientHeight, 1)

      camera.aspect = width / height

      const baseZ = 7.7
      const aspectFactor = width / height < 0.95 ? 0.95 / (width / height) : 1
      camera.position.z = THREE.MathUtils.clamp(baseZ * Math.sqrt(aspectFactor), 7.5, 10.6)

      camera.updateProjectionMatrix()
      renderer.setSize(width, height, false)
    }

    const resizeObserver = new ResizeObserver(updateViewportSize)
    resizeObserver.observe(container)
    updateViewportSize()

    // -----------------------------------------------------------------
    // Render loop -- strictly stopped when off-screen or tab hidden
    // -----------------------------------------------------------------
    let rafId = null
    let lastTime = null
    let elapsed = 0

    function startLoop() {
      if (rafId !== null || !isVisible || document.hidden) return
      lastTime = performance.now()
      rafId = requestAnimationFrame(animate)
    }

    function stopLoop() {
      if (rafId !== null) {
        cancelAnimationFrame(rafId)
        rafId = null
      }
      lastTime = null
    }

    function animate(now) {
      rafId = null
      if (!isVisible || document.hidden) return

      if (lastTime !== null) {
        elapsed += Math.min((now - lastTime) / 1000, 0.1)
      }
      lastTime = now

      // Idle sphere float: ~3.5s cycle, small amplitude
      const sphereIdleY = Math.sin(elapsed * 1.8) * 0.045
      const innerIdleZ = Math.sin(elapsed * 1.8 + Math.PI) * 0.025
      const idleTiltX = Math.sin(elapsed * 0.72) * 0.022
      const idleTiltY = Math.cos(elapsed * 0.58) * 0.028

      // Compose logo group rotation
      logoGroup.rotation.x = entranceState.rotX + hoverState.tiltX + dragState.rotX + idleTiltX
      logoGroup.rotation.y = entranceState.rotY + hoverState.tiltY + dragState.rotY + idleTiltY

      // Outer arch
      outerArch.position.set(
        hoverState.outerX,
        hoverState.outerY,
        BASE_POS.outerZ + entranceState.outerZ + pulseState.outerZ,
      )
      outerArch.scale.setScalar(entranceState.outerScale)

      // Inner arch
      innerArch.position.set(
        hoverState.innerX,
        hoverState.innerY,
        BASE_POS.innerZ + entranceState.innerZ + pulseState.innerZ + innerIdleZ,
      )
      innerArch.scale.setScalar(entranceState.innerScale)

      // Sphere group
      sphereGroup.position.set(
        BASE_POS.sphereX + hoverState.sphereX,
        BASE_POS.sphereY + hoverState.sphereY + sphereIdleY,
        BASE_POS.sphereZ + entranceState.sphereZ + pulseState.sphereZ,
      )
      sphereMesh.scale.set(
        entranceState.sphereScale * pulseState.scaleX,
        entranceState.sphereScale * pulseState.scaleY,
        entranceState.sphereScale * pulseState.scaleZ,
      )

      // Cursor light
      cursorLight.position.set(hoverState.lightX, hoverState.lightY, 2.85)

      // Contact shadow breathing
      const shadowScaleX = 1 + Math.sin(elapsed * 1.8) * 0.018
      contactShadow.scale.set(shadowScaleX, 1, 1)

      renderer.render(scene, camera)
      rafId = requestAnimationFrame(animate)
    }

    // IntersectionObserver: stop render loop when container is off-screen
    const io = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0].isIntersecting
        containerRect = null
        if (isVisible && !document.hidden) startLoop()
        else stopLoop()
      },
      { rootMargin: '100px' },
    )
    io.observe(container)

    function onVisibilityChange() {
      if (!document.hidden && isVisible) startLoop()
      else stopLoop()
    }

    document.addEventListener('visibilitychange', onVisibilityChange)

    // -----------------------------------------------------------------
    // bfcache-safe lifecycle & cleanup
    // -----------------------------------------------------------------
    window.addEventListener('pagehide', (e) => {
      stopLoop()
      if (e.persisted) return
      if (rectRaf) cancelAnimationFrame(rectRaf)
      if (entranceObserver) entranceObserver.disconnect()
      resizeObserver.disconnect()
      io.disconnect()
      document.removeEventListener('visibilitychange', onVisibilityChange)
      if (hasMouse) {
        window.removeEventListener('pointermove', onWindowPointerMove)
        window.removeEventListener('scroll', invalidateRect)
        document.removeEventListener('pointerleave', resetHoverParallax)
      }
      outerGeo.dispose()
      innerGeo.dispose()
      sphereGeo.dispose()
      shadowPlaneGeo.dispose()
      archMaterial.dispose()
      sphereMaterial.dispose()
      shadowPlaneMat.dispose()
      shadowTex.dispose()
      envRT.dispose()
      renderer.dispose()
    })

    window.addEventListener('pageshow', (e) => {
      if (e.persisted && isVisible && !document.hidden) {
        startLoop()
      }
    })
  }
}
