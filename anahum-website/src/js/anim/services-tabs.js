/**
 * Services Interactive Tab & Crossfade Image Swap
 * Triggers on hover/focus on desktop, click on touch.
 * Includes gentle auto-cycling when idle to showcase all capabilities.
 */
export function initServicesTabs() {
  const rows = document.querySelectorAll('.service-row');
  const images = document.querySelectorAll('.service-display-image');
  const glassTitle = document.getElementById('glassTitle');
  const glassDesc = document.getElementById('glassDesc');
  const glassChip1 = document.getElementById('glassChip1');
  const glassChip2 = document.getElementById('glassChip2');

  if (!rows.length || !images.length) return;

  let currentIndex = 0;
  let autoTimer = null;
  let isHovered = false;

  function activateTab(row) {
    const index = row.getAttribute('data-service-index');
    currentIndex = parseInt(index, 10);
    const title = row.getAttribute('data-title');
    const desc = row.getAttribute('data-desc');
    const chip1 = row.getAttribute('data-chip1');
    const chip2 = row.getAttribute('data-chip2');

    // Update active row classes and aria states
    rows.forEach((r) => {
      r.classList.remove('is-active');
      r.setAttribute('aria-selected', 'false');
    });
    row.classList.add('is-active');
    row.setAttribute('aria-selected', 'true');

    // Crossfade images with subtle scale
    images.forEach((img) => {
      if (img.getAttribute('data-index') === index) {
        img.classList.add('is-active');
      } else {
        img.classList.remove('is-active');
      }
    });

    // Update glass overlay content with smooth fade
    if (glassTitle && title) glassTitle.textContent = title;
    if (glassDesc && desc) glassDesc.textContent = desc;
    if (glassChip1 && chip1) glassChip1.textContent = chip1;
    if (glassChip2 && chip2) glassChip2.textContent = chip2;
  }

  rows.forEach((row) => {
    row.addEventListener('mouseenter', () => {
      isHovered = true;
      activateTab(row);
    });
    row.addEventListener('mouseleave', () => {
      isHovered = false;
    });
    row.addEventListener('focus', () => {
      isHovered = true;
      activateTab(row);
    });
    row.addEventListener('blur', () => {
      isHovered = false;
    });
    row.addEventListener('click', () => {
      activateTab(row);
    });
  });

  // Auto-cycle through tabs every 4.5s when idle
  function startAutoCycle() {
    autoTimer = setInterval(() => {
      if (!isHovered && document.visibilityState === 'visible') {
        currentIndex = (currentIndex + 1) % rows.length;
        activateTab(rows[currentIndex]);
      }
    }, 4500);
  }

  startAutoCycle();
}
