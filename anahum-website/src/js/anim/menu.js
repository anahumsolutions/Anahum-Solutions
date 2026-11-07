/**
 * Floating Header Menu Controller
 * Manages accessible open/close states, Esc key closure, focus return, and keyboard navigation.
 */
export function initMenu() {
  const toggleBtn = document.getElementById('menuToggle');
  const menu = document.getElementById('mainMenu');
  if (!toggleBtn || !menu) return;

  const iconBars = toggleBtn.querySelector('.menu-icon-bars');
  const iconClose = toggleBtn.querySelector('.menu-icon-close');

  function openMenu() {
    toggleBtn.setAttribute('aria-expanded', 'true');
    menu.setAttribute('aria-hidden', 'false');
    menu.classList.add('is-open');
    if (iconBars && iconClose) {
      iconBars.style.display = 'none';
      iconClose.style.display = 'block';
    }
    // Focus first link in menu
    const firstLink = menu.querySelector('a, button');
    if (firstLink) firstLink.focus();
  }

  function closeMenu() {
    toggleBtn.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-hidden', 'true');
    menu.classList.remove('is-open');
    if (iconBars && iconClose) {
      iconBars.style.display = 'block';
      iconClose.style.display = 'none';
    }
    toggleBtn.focus();
  }

  toggleBtn.addEventListener('click', () => {
    const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
    if (isExpanded) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && toggleBtn.getAttribute('aria-expanded') === 'true') {
      closeMenu();
    }
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (
      toggleBtn.getAttribute('aria-expanded') === 'true' &&
      !menu.contains(e.target) &&
      !toggleBtn.contains(e.target)
    ) {
      closeMenu();
    }
  });

  // Close menu when clicking navigation link
  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });
}
