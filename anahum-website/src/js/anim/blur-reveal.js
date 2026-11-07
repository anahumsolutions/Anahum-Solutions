import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Blur-To-Sharp Reveal Animation Module
 * Starts with cinematic 14px blur, transforms to crisp clarity on scroll.
 * Runs unconditionally.
 */
export function initBlurReveal() {
  const elements = document.querySelectorAll('[data-anim="blur-reveal"]');
  if (!elements.length) return;

  elements.forEach((el) => {
    const delay = parseFloat(el.getAttribute('data-delay')) || 0;

    gsap.fromTo(
      el,
      {
        opacity: 0,
        y: 50,
        filter: 'blur(14px)'
      },
      {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 0.9,
        delay: delay,
        ease: 'power3.out',
        onComplete: () => {
          el.style.filter = '';
        },
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      }
    );
  });
}
