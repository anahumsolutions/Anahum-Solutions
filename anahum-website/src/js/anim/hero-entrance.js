import { gsap } from 'gsap';

/**
 * Hero Entrance & Scene Animation Module
 * Implements Section 10 of the Hero Guide:
 * - Headline blur-to-sharp reveal
 * - Nav and CTA fade-in
 * - Vein paths draw-in via stroke-dashoffset
 * - Connector lines draw-in
 * - Junction dots gentle pulse
 * - Floating silhouette physics
 * - Fixed header handoff (appears after 80% scroll past hero)
 * Runs unconditionally without blocking.
 */
export function initHeroEntrance() {
  const hero = document.getElementById('hero');
  if (!hero) return;

  const header = document.querySelector('.site-header');
  const navPills = hero.querySelectorAll('.hero__nav-pill, .hero__logo');
  const titleLines = hero.querySelectorAll('.hero__title .l1, .hero__title .l2');
  const subtitle = hero.querySelector('.hero__subtitle');
  const buttons = hero.querySelectorAll('.hero__btn');
  const nodes = hero.querySelectorAll('.hero__node');
  const veinPaths = hero.querySelectorAll('.vein-path, .vein-path-core');
  const connectorLines = hero.querySelectorAll('.connector-line');
  const junctionDots = hero.querySelectorAll('.junction-dot, .terminal-dots circle');
  const figure = hero.querySelector('.hero__figure');

  // Master timeline for hero reveal
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  // 1. Initial setups for vein paths (stroke-dashoffset draw)
  veinPaths.forEach((path) => {
    try {
      const length = path.getTotalLength() || 400;
      gsap.set(path, {
        strokeDasharray: length,
        strokeDashoffset: length,
        opacity: 1
      });
    } catch {
      // Fallback
      gsap.set(path, { opacity: 0 });
    }
  });

  // Setup connector lines
  connectorLines.forEach((line) => {
    try {
      const length = line.getTotalLength() || 100;
      gsap.set(line, {
        strokeDasharray: length,
        strokeDashoffset: length,
        opacity: 0.85
      });
    } catch {
      gsap.set(line, { opacity: 0 });
    }
  });

  // 2. Headline blur-to-sharp reveal (0.9s, stagger 0.12s)
  if (titleLines.length) {
    tl.fromTo(
      titleLines,
      { y: 35, opacity: 0, filter: 'blur(12px)' },
      {
        y: 0,
        opacity: 1,
        filter: 'blur(0px)',
        duration: 0.9,
        stagger: 0.12,
        onComplete: () => {
          titleLines.forEach((el) => (el.style.filter = ''));
        }
      },
      0.1
    );
  }

  // 3. Subtitle & Buttons fade in after headline
  if (subtitle) {
    tl.fromTo(
      subtitle,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5 },
      '-=0.4'
    );
  }

  if (buttons.length) {
    tl.fromTo(
      buttons,
      { y: 15, opacity: 0, scale: 0.96 },
      { y: 0, opacity: 1, scale: 1, duration: 0.5, stagger: 0.1 },
      '-=0.3'
    );
  }

  // 4. Nav pills fade in
  if (navPills.length) {
    tl.fromTo(
      navPills,
      { y: -15, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, stagger: 0.08 },
      0.2
    );
  }

  // 5. Veins draw-in with stroke-dashoffset (1.6s, staggered)
  if (veinPaths.length) {
    tl.to(
      veinPaths,
      {
        strokeDashoffset: 0,
        opacity: (i, target) => (target.classList.contains('vein-path') ? 0.35 : 0.85),
        duration: 1.6,
        stagger: 0.08,
        ease: 'power2.inOut'
      },
      0.4
    );
  }

  // 6. Nodes & Connectors draw in after veins begin
  if (nodes.length) {
    tl.fromTo(
      nodes,
      { y: 20, opacity: 0, scale: 0.94 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.6,
        stagger: 0.12,
        ease: 'back.out(1.2)'
      },
      0.9
    );
  }

  if (connectorLines.length) {
    tl.to(
      connectorLines,
      {
        strokeDashoffset: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power2.out'
      },
      1.1
    );
  }

  // 7. Idle Loops: Floating figure & Junction dots pulse
  let idleAnimationActive = true;

  // Floating figure (+/- 6u over 5s)
  let figureTween = null;
  if (figure) {
    figureTween = gsap.to(figure, {
      y: '-=12',
      duration: 2.5,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut'
    });
  }

  // Junction dots pulse (opacity 0.6 to 1, 2.4s)
  let dotsTween = null;
  if (junctionDots.length) {
    dotsTween = gsap.to(junctionDots, {
      opacity: 0.5,
      duration: 1.2,
      stagger: {
        each: 0.15,
        repeat: -1,
        yoyo: true
      },
      ease: 'sine.inOut'
    });
  }

  // Pause idle loops when hero is off-screen using IntersectionObserver
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!idleAnimationActive) {
              if (figureTween) figureTween.play();
              if (dotsTween) dotsTween.play();
              idleAnimationActive = true;
            }
          } else {
            if (idleAnimationActive) {
              if (figureTween) figureTween.pause();
              if (dotsTween) dotsTween.pause();
              idleAnimationActive = false;
            }
          }
        });
      },
      { threshold: 0.05 }
    );
    observer.observe(hero);
  }

  // 8. Fixed Header Handoff (appears after user scrolls past 80% of hero)
  if (header) {
    const updateHeaderVisibility = () => {
      const heroHeight = hero.offsetHeight || window.innerHeight;
      const scrollPos = window.scrollY || window.pageYOffset;
      if (scrollPos > heroHeight * 0.8) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
    };

    window.addEventListener('scroll', updateHeaderVisibility, { passive: true });
    updateHeaderVisibility();
  }
}
