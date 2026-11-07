import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Features Orbit Module
 * Features concentric ring rotation, satellite card orbital floating, and scroll-driven scrub rotation.
 * Runs unconditionally.
 */
export function initOrbit() {
  const container = document.querySelector('[data-anim="orbit-timeline"]');
  const satellites = document.querySelectorAll('.satellite-card');
  const ringsSvg = document.querySelector('.orbit-rings');
  if (!container || !satellites.length) return;

  // 1. Entrance reveal on scroll
  gsap.fromTo(
    satellites,
    {
      opacity: 0,
      scale: 0.7,
      y: 30
    },
    {
      opacity: 1,
      scale: 1,
      y: 0,
      duration: 0.9,
      stagger: 0.12,
      ease: 'back.out(1.4)',
      scrollTrigger: {
        trigger: container,
        start: 'top 85%',
        toggleActions: 'play none none none'
      }
    }
  );

  // 2. Scroll-driven rotational drift using ScrollTrigger scrub
  gsap.to(satellites, {
    x: (i) => (i % 2 === 0 ? 25 : -25),
    y: (i) => (i % 3 === 0 ? 20 : -20),
    ease: 'none',
    scrollTrigger: {
      trigger: container,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1.5
    }
  });

  // 3. Continuous gentle floating physics for organic AI feel
  satellites.forEach((card, i) => {
    const yAmp = (i % 2 === 0 ? 10 : -10);
    const xAmp = (i % 3 === 0 ? 8 : -8);

    gsap.to(card, {
      y: `+=${yAmp}`,
      x: `+=${xAmp}`,
      duration: 3.2 + (i * 0.3),
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: i * 0.25
    });
  });

  // 4. Subtle continuous rotation of dotted rings
  if (ringsSvg) {
    gsap.to(ringsSvg, {
      rotation: 360,
      duration: 100,
      repeat: -1,
      ease: 'none',
      transformOrigin: '50% 50%'
    });
  }
}
