import { gsap } from 'gsap'

/**
 * Pricing Toggle Controller
 * Toggles Monthly vs Annual plans, updates aria-pressed, and tweens price values.
 */
export function initPricingToggle() {
  const btnMonthly = document.getElementById('btnMonthly')
  const btnYearly = document.getElementById('btnYearly')
  const priceElements = document.querySelectorAll('.price-val')
  const periodElements = document.querySelectorAll('.pricing-card__amount .period')

  if (!btnMonthly || !btnYearly || !priceElements.length) return

  function setMode(isYearly) {
    btnMonthly.setAttribute('aria-pressed', (!isYearly).toString())
    btnYearly.setAttribute('aria-pressed', isYearly.toString())

    btnMonthly.classList.toggle('is-active', !isYearly)
    btnYearly.classList.toggle('is-active', isYearly)

    periodElements.forEach((p) => {
      p.textContent = isYearly ? '/yr' : '/mo'
    })

    priceElements.forEach((el) => {
      const targetVal =
        parseFloat(isYearly ? el.getAttribute('data-yearly') : el.getAttribute('data-monthly')) || 0
      const currentVal = parseFloat(el.textContent) || 0

      const obj = { val: currentVal }
      gsap.to(obj, {
        val: targetVal,
        duration: 0.5,
        ease: 'power2.out',
        onUpdate: () => {
          el.textContent = Math.round(obj.val)
        },
      })
    })
  }

  btnMonthly.addEventListener('click', () => setMode(false))
  btnYearly.addEventListener('click', () => setMode(true))
}
