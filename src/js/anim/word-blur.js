import { gsap } from 'gsap'

/**
 * Word-By-Word Blur Reveal & Process Cards Rise Animation Module
 * Preserves full screen-reader heading text while animating decorative word spans smoothly,
 * and triggers process cards responsively without locking hover transforms.
 */
export function initWordBlur() {
  const headings = Array.from(document.querySelectorAll('[data-anim="word-blur"]'))
  const hasIO = 'IntersectionObserver' in window

  headings.forEach((heading) => {
    const fullText = heading.textContent.replace(/\s+/g, ' ').trim()
    const childNodes = Array.from(heading.childNodes)
    heading.innerHTML = ''

    const srText = document.createElement('span')
    srText.className = 'sr-only'
    srText.textContent = fullText
    heading.appendChild(srText)

    const visualWrap = document.createElement('span')
    visualWrap.className = 'word-blur__visual'
    visualWrap.setAttribute('aria-hidden', 'true')
    heading.appendChild(visualWrap)

    const wordSpans = []

    const appendWords = (text, extraClass) => {
      const tokens = text.split(/(\s+)/)
      tokens.forEach((w) => {
        if (w.trim().length > 0) {
          const span = document.createElement('span')
          span.className = extraClass ? `word-blur__word ${extraClass}` : 'word-blur__word'
          span.textContent = w
          span.style.display = 'inline-block'
          visualWrap.appendChild(span)
          wordSpans.push(span)
        } else if (w.length > 0) {
          visualWrap.appendChild(document.createTextNode(' '))
        }
      })
    }

    childNodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        appendWords(node.textContent, '')
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        appendWords(node.textContent, node.className)
      }
    })

    if (!wordSpans.length || !hasIO) return

    const rect = heading.getBoundingClientRect()
    if (rect.height > 0 && rect.bottom < 0) return

    gsap.set(wordSpans, {
      opacity: 0,
      y: 14,
      filter: 'blur(8px)',
      willChange: 'transform, opacity, filter',
    })

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          observer.disconnect()
          gsap.to(wordSpans, {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 0.48,
            stagger: 0.04,
            ease: 'power2.out',
            clearProps: 'transform,filter,willChange',
          })
        }
      },
      { threshold: 0.05, rootMargin: '0px 0px -8% 0px' },
    )
    observer.observe(heading)
  })

  // Process cards rise smoothly on scroll
  const processGrid = document.querySelector('.process-grid')
  const processCards = Array.from(document.querySelectorAll('[data-anim="card-rise"]'))
  if (!processCards.length || !hasIO) return

  const isMobile = window.matchMedia('(max-width: 640px)').matches

  if (!isMobile && processGrid) {
    const rect = processGrid.getBoundingClientRect()
    if (rect.height > 0 && rect.bottom < 0) return

    gsap.set(processCards, { opacity: 0, y: 36, willChange: 'transform, opacity' })
    const gridObserver = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          gridObserver.disconnect()
          gsap.to(processCards, {
            opacity: 1,
            y: 0,
            duration: 0.65,
            stagger: 0.1,
            ease: 'power3.out',
            clearProps: 'transform,willChange',
          })
        }
      },
      { threshold: 0.05, rootMargin: '0px 0px -8% 0px' },
    )
    gridObserver.observe(processGrid)
  } else {
    const cardObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            cardObserver.unobserve(entry.target)
            gsap.to(entry.target, {
              opacity: 1,
              y: 0,
              duration: 0.55,
              ease: 'power3.out',
              clearProps: 'transform,willChange',
            })
          }
        })
      },
      { threshold: 0.05, rootMargin: '0px 0px -6% 0px' },
    )

    processCards.forEach((card) => {
      const rect = card.getBoundingClientRect()
      if (rect.height > 0 && rect.bottom < 0) return
      gsap.set(card, { opacity: 0, y: 30, willChange: 'transform, opacity' })
      cardObserver.observe(card)
    })
  }
}
