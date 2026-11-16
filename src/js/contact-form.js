/**
 * Contact Form — Formspree integration
 */

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mqpqpvnk'

export function initContactForm() {
  const form = document.getElementById('contactForm')
  if (!form) return

  const btn = document.getElementById('cfSubmit')
  const status = document.getElementById('cfStatus')

  form.addEventListener('submit', async (e) => {
    e.preventDefault()

    // Silently ignore honeypot submissions
    if (form._gotcha && form._gotcha.value) return

    btn.disabled = true
    btn.textContent = 'Sending…'
    status.textContent = ''
    status.className = 'form-status'

    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      })

      if (res.ok) {
        status.textContent = 'Thanks, we will reply within 24 hours.'
        status.classList.add('form-status--success')
        form.reset()
      } else {
        throw new Error('server error')
      }
    } catch {
      status.textContent = 'Something went wrong. Please message us on WhatsApp.'
      status.classList.add('form-status--error')
    } finally {
      btn.disabled = false
      btn.textContent = 'Send message'
    }
  })
}
