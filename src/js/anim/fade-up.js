import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Fade-Up & Stagger Animation Module
 * Triggers distinct scroll reveals unconditionally.
 */
export function initFadeUp() {
  const elements = document.querySelectorAll('#mainContent [data-anim="fade-up"]:not(.hero-section *)');
  if (!elements.length) return;

  elements.forEach((el) => {
    const delay = parseFloat(el.getAttribute('data-delay')) || 0;

    gsap.fromTo(
      el,
      {
        opacity: 0,
        y: 45
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay: delay,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: 'play none none none'
        }
      }
    );
  });
}
