import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Word-By-Word Blur Reveal & Process Cards Rise Animation Module
 * Preserves full screen-reader heading text while animating decorative word spans,
 * and triggers process cards responsively without locking hover transforms.
 */
export function initWordBlur() {
  const headings = document.querySelectorAll('[data-anim="word-blur"]')

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
          span.style.opacity = '0'
          span.style.filter = 'blur(8px)'
          span.style.transform = 'translateY(14px)'
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

    gsap.to(wordSpans, {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      duration: 0.42,
      stagger: 0.045,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: heading,
        start: 'top 88%',
        toggleActions: 'play none none none',
      },
      onComplete: () => {
        wordSpans.forEach((span) => {
          span.style.filter = ''
          span.style.transform = ''
        })
      },
    })
  })

  // Process cards rise on their own grid/card scroll triggers
  const processGrid = document.querySelector('.process-grid')
  const processCards = Array.from(document.querySelectorAll('[data-anim="card-rise"]'))
  if (!processCards.length) return

  const mm = gsap.matchMedia()

  mm.add('(min-width: 641px)', () => {
    gsap.fromTo(
      processCards,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.65,
        stagger: 0.1,
        ease: 'power3.out',
        clearProps: 'transform',
        scrollTrigger: {
          trigger: processGrid || processCards[0],
          start: 'top 88%',
          toggleActions: 'play none none none',
        },
      },
    )
  })

  mm.add('(max-width: 640px)', () => {
    processCards.forEach((card) => {
      gsap.fromTo(
        card,
        { opacity: 0, y: 32 },
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
          ease: 'power3.out',
          clearProps: 'transform',
          scrollTrigger: {
            trigger: card,
            start: 'top 90%',
            toggleActions: 'play none none none',
          },
        },
      )
    })
  })
}
