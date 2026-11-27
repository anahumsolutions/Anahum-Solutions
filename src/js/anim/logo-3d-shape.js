/**
 * logo-3d-shape.js
 *
 * Exports the arch outline builder and shared extrusion settings.
 * Reproduces the EXACT same silhouette as the demo's createRoundedArchShape,
 * but builds it as a pure polygon (no arc/curve commands) so the outline is
 * evenly spaced and perfectly left-right symmetric. This eliminates the
 * near-duplicate points that cause bevel notches at the apex.
 *
 * Strategy
 * --------
 * 1. Compute all geometry constants from the demo's formulas verbatim.
 * 2. Build the RIGHT half of the outline: apex top-centre → down outer right
 *    leg → right foot cap → up inner right leg → inner corner bottom-centre.
 * 3. Mirror every right-half point (negate x) and append in reverse order,
 *    skipping the two centre-line points that are already in the right half.
 * 4. Remove any consecutive points closer than 1e-6.
 *
 * Spacing rules
 * - Straight legs: a point at least every 0.05 units.
 * - Curved parts (apex arc, foot caps, inner quadratic): a point at least
 *   every 3 degrees, evenly spaced along the curve.
 */

// Note: THREE is passed in by logo-3d.js so this module never pulls three into the main bundle.

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Add evenly spaced arc points from angleStart to angleEnd (in radians),
 *  centred at (cx, cy) with radius rad, into pts[].
 *  includeStart / includeEnd control whether the endpoint angles are added.
 *  At least every 3 degrees (Math.PI/60) of turn. */
function arcPoints(cx, cy, rad, angleStart, angleEnd, clockwise, includeStart, includeEnd) {
  const pts = []
  const totalAngle = clockwise
    ? (angleStart - angleEnd + 2 * Math.PI) % (2 * Math.PI) || 2 * Math.PI
    : (angleEnd - angleStart + 2 * Math.PI) % (2 * Math.PI) || 2 * Math.PI

  const step = Math.PI / 60 // 3 degrees
  const nSegs = Math.max(1, Math.ceil(totalAngle / step))

  const start = includeStart ? 0 : 1
  const end = includeEnd ? nSegs : nSegs - 1

  for (let i = start; i <= end; i++) {
    const t = i / nSegs
    const angle = clockwise ? angleStart - totalAngle * t : angleStart + totalAngle * t
    pts.push({ x: cx + rad * Math.cos(angle), y: cy + rad * Math.sin(angle) })
  }
  return pts
}

/** Add evenly spaced points along a quadratic Bezier from P0 through Pc to P1,
 *  into pts[]. At least every 3 degrees of curvature, estimated by sampling. */
function quadBezierPoints(p0, pc, p1, includeStart, includeEnd) {
  // Estimate arc length by sampling 64 segments
  const N_SAMPLE = 64
  let arcLen = 0
  let prev = p0
  for (let i = 1; i <= N_SAMPLE; i++) {
    const t = i / N_SAMPLE
    const mt = 1 - t
    const x = mt * mt * p0.x + 2 * mt * t * pc.x + t * t * p1.x
    const y = mt * mt * p0.y + 2 * mt * t * pc.y + t * t * p1.y
    arcLen += Math.hypot(x - prev.x, y - prev.y)
    prev = { x, y }
  }

  // Estimate average curvature to get degree step
  // Use at least ceil(arcLen / 0.05) segments for spacing, and at least
  // enough for 3-degree angular resolution (use a generous 60 segments min).
  const nSegs = Math.max(60, Math.ceil(arcLen / 0.05))

  const pts = []
  const start = includeStart ? 0 : 1
  const end = includeEnd ? nSegs : nSegs - 1

  for (let i = start; i <= end; i++) {
    const t = i / nSegs
    const mt = 1 - t
    pts.push({
      x: mt * mt * p0.x + 2 * mt * t * pc.x + t * t * p1.x,
      y: mt * mt * p0.y + 2 * mt * t * pc.y + t * t * p1.y,
    })
  }
  return pts
}

/** Add evenly spaced points along a straight segment from (x0,y0) to (x1,y1).
 *  At least every 0.05 units. includeStart / includeEnd control endpoints. */
function segPoints(x0, y0, x1, y1, includeStart, includeEnd) {
  const dist = Math.hypot(x1 - x0, y1 - y0)
  if (dist < 1e-10) return []
  const nSegs = Math.max(1, Math.ceil(dist / 0.05))
  const pts = []
  const start = includeStart ? 0 : 1
  const end = includeEnd ? nSegs : nSegs - 1
  for (let i = start; i <= end; i++) {
    const t = i / nSegs
    pts.push({ x: x0 + (x1 - x0) * t, y: y0 + (y1 - y0) * t })
  }
  return pts
}

/** Remove consecutive duplicate points (closer than 1e-6). */
function dedup(pts) {
  const out = []
  for (let i = 0; i < pts.length; i++) {
    if (i === 0) {
      out.push(pts[i])
      continue
    }
    const prev = out[out.length - 1]
    if (Math.hypot(pts[i].x - prev.x, pts[i].y - prev.y) > 1e-6) {
      out.push(pts[i])
    }
  }
  return out
}

// ---------------------------------------------------------------------------
// Main exported function
// ---------------------------------------------------------------------------

/**
 * Build an arch outline as a THREE.Shape using only straight segments.
 * Reproduces the demo's silhouette exactly.
 *
 * @param {typeof import('three')} THREE
 * @param {number} halfWidth  Horizontal distance from centre to each foot centre
 * @param {number} baseY      Y of both foot centres
 * @param {number} peakY      Y of the apex centre
 * @param {number} thickness  Stroke thickness (before bevel)
 * @returns {import('three').Shape}
 */
export function createArchShape(THREE, halfWidth, baseY, peakY, thickness) {
  const r = thickness * 0.5
  const h = peakY - baseY
  const len = Math.hypot(halfWidth, h)

  // --- Demo's formulas verbatim ---
  const uRx = halfWidth / len
  const uRy = -h / len // unit vector along right leg (pointing DOWN-right from apex)

  const nLOutX = -h / len
  const nLOutY = halfWidth / len
  const nROutX = h / len
  const nROutY = halfWidth / len

  const angleLOut = Math.atan2(nLOutY, nLOutX)
  const angleROut = Math.atan2(nROutY, nROutX)
  const angleRIn = angleROut - Math.PI
  const angleLIn = angleLOut - Math.PI

  const innerApexY = peakY - (r * len) / halfWidth

  const filletDist = Math.min(r * 0.55, len * 0.14)
  // inner right fillet point (uRx = halfWidth/len, uRy = -h/len)
  const innerRightFilletX = filletDist * uRx
  const innerRightFilletY = innerApexY + filletDist * uRy // = innerApexY - filletDist*h/len
  // inner left fillet point
  const innerLeftFilletX = -filletDist * uRx // = -innerRightFilletX
  const innerLeftFilletY = innerRightFilletY // same Y (symmetric)

  // -------------------------------------------------------------------------
  // Build RIGHT half: top-centre of apex arc → … → bottom-centre of inner corner
  // -------------------------------------------------------------------------
  const right = []

  // The apex arc is centred at (0, peakY), radius r, swept CW from angleLOut to angleROut.
  // "Top centre" = the topmost point of the arc, which is at angle PI/2 (straight up).
  // The arc goes CW (decreasing angle in math convention) from angleLOut to angleROut.
  // angleLOut is in Q2 (negative x, positive y), angleROut is in Q1 (positive x, positive y).
  // CW from angleLOut to angleROut passes through PI/2 (top).
  // We start exactly at the top (angle = PI/2) and go CW to angleROut.

  const apexTopAngle = Math.PI / 2 // 0, peakY + r  — top of apex arc

  // 1. Right half of outer apex arc: CW from PI/2 to angleROut
  //    (this is the right quarter of the arc from top to right tangent)
  right.push(...arcPoints(0, peakY, r, apexTopAngle, angleROut, true, true, true))
  if (right.length > 0) {
    right[0].x = 0
    right[0].y = peakY + r
  }

  // 2. Outer right leg: from apex arc end to foot outer tangent
  //    Arc ends at (r*cos(angleROut), peakY + r*sin(angleROut)) = (r*nROutX, peakY + r*nROutY)
  //    Leg ends at (halfWidth + r*nROutX, baseY + r*nROutY)
  {
    const x0 = r * Math.cos(angleROut)
    const y0 = peakY + r * Math.sin(angleROut)
    const x1 = halfWidth + r * nROutX
    const y1 = baseY + r * nROutY
    right.push(...segPoints(x0, y0, x1, y1, false, true))
  }

  // 3. Right foot cap: CW from angleROut to angleRIn (a semicircle)
  right.push(...arcPoints(halfWidth, baseY, r, angleROut, angleRIn, true, false, true))

  // 4. Inner right leg: from foot inner tangent up to inner right fillet point
  //    Foot arc ends at (halfWidth + r*cos(angleRIn), baseY + r*sin(angleRIn))
  {
    const x0 = halfWidth + r * Math.cos(angleRIn)
    const y0 = baseY + r * Math.sin(angleRIn)
    const x1 = innerRightFilletX
    const y1 = innerRightFilletY
    right.push(...segPoints(x0, y0, x1, y1, false, true))
  }

  // 5. Right half of inner quadratic corner: from innerRightFillet to (0, innerApexY)
  //    quadratic: P0=innerRightFillet, Pc=(0,innerApexY), P1=innerLeftFillet
  //    Right half = P0 to midpoint (t=0.5)
  {
    const p0 = { x: innerRightFilletX, y: innerRightFilletY }
    const pc = { x: 0, y: innerApexY }
    const p1 = { x: innerLeftFilletX, y: innerLeftFilletY }
    // t=0.5 gives the midpoint of the quadratic (which lies on x=0 by symmetry)
    const midX = 0.25 * p0.x + 0.5 * pc.x + 0.25 * p1.x // = 0 (symmetric)
    const midY = 0.25 * p0.y + 0.5 * pc.y + 0.25 * p1.y

    // Sample from t=0 (p0) to t=0.5 (mid), includeStart=false (already added), includeEnd=true
    // We need a sub-sampler for t in [0, 0.5]
    const nSegs = Math.max(30, Math.ceil((Math.hypot(p0.x - midX, p0.y - midY) / 0.025) * 2))
    for (let i = 1; i <= nSegs; i++) {
      const t = (i / nSegs) * 0.5
      const mt = 1 - t
      right.push({
        x: i === nSegs ? 0 : mt * mt * p0.x + 2 * mt * t * pc.x + t * t * p1.x,
        y: mt * mt * p0.y + 2 * mt * t * pc.y + t * t * p1.y,
      })
    }
  }

  // -------------------------------------------------------------------------
  // Build LEFT half by mirroring right half in reverse, skipping the two
  // centre-line points (x=0) that are already at the ends.
  // right[0]  = top of apex arc  (x=0, y=peakY+r)  — skip mirror (would be duplicate)
  // right[last] = midpoint of inner corner (x≈0)    — skip mirror
  // -------------------------------------------------------------------------
  const left = []
  for (let i = right.length - 2; i >= 1; i--) {
    left.push({ x: -right[i].x, y: right[i].y })
  }

  // -------------------------------------------------------------------------
  // Combine: right half + left half
  // -------------------------------------------------------------------------
  const all = dedup([...right, ...left])

  // Build shape
  const shape = new THREE.Shape()
  shape.moveTo(all[0].x, all[0].y)
  for (let i = 1; i < all.length; i++) {
    shape.lineTo(all[i].x, all[i].y)
  }
  shape.closePath()

  return shape
}

// ---------------------------------------------------------------------------
// Shared extrusion settings — restored exactly to demo values
// ---------------------------------------------------------------------------
export const extrudeDepth = 0.38

export const extrudeSettings = {
  depth: extrudeDepth,
  bevelEnabled: true,
  bevelThickness: 0.095,
  bevelSize: 0.075,
  bevelSegments: 10,
  curveSegments: 36,
}
