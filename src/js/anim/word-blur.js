import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Word-By-Word Blur Reveal Animation Module
 * Splits heading words cleanly and reveals them with staggered blur-to-sharp animation (~1s total).
 * Runs unconditionally.
 */
export function initWordBlur() {
  const headings = document.querySelectorAll('[data-anim="word-blur"]')
  if (!headings.length) return

  headings.forEach((heading) => {
    const childNodes = Array.from(heading.childNodes)
    heading.innerHTML = ''
    const wordSpans = []

    childNodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const words = node.textContent.split(/(\s+)/)
        words.forEach((w) => {
          if (w.trim().length > 0) {
            const span = document.createElement('span')
            span.textContent = w
            span.style.display = 'inline-block'
            span.style.opacity = '0'
            span.style.filter = 'blur(10px)'
            span.style.transform = 'translateY(18px)'
            heading.appendChild(span)
            wordSpans.push(span)
          } else if (w.length > 0) {
            heading.appendChild(document.createTextNode(w))
          }
        })
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const words = node.textContent.split(/(\s+)/)
        words.forEach((w) => {
          if (w.trim().length > 0) {
            const span = document.createElement('span')
            span.className = node.className
            span.textContent = w
            span.style.display = 'inline-block'
            span.style.opacity = '0'
            span.style.filter = 'blur(10px)'
            span.style.transform = 'translateY(18px)'
            heading.appendChild(span)
            wordSpans.push(span)
          } else if (w.length > 0) {
            heading.appendChild(document.createTextNode(w))
          }
        })
      }
    })

    const processCards = document.querySelectorAll('[data-anim="card-rise"]')

    // Create timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: heading,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    })

    // 1. Staggered word blur reveal
    tl.to(wordSpans, {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      duration: 0.5,
      stagger: 0.08,
      ease: 'power2.out',
      onComplete: () => {
        wordSpans.forEach((span) => {
          span.style.filter = ''
          span.style.transform = ''
        })
      },
    })

    // 2. Process cards rise in afterwards
    if (processCards.length) {
      tl.fromTo(
        processCards,
        {
          opacity: 0,
          y: 60,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
        },
        '-=0.2',
      )
    }
  })
}
