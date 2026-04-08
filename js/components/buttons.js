/**
 * Button microinteractions — ripple, loading states
 */
(() => {
  const { $$, on } = UI;

  // ── Ripple Effect ──
  const createRipple = (btn, e) => {
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top  - size / 2;

    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
    `;

    btn.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove(), { once: true });
  };

  $$('[data-ripple]').forEach(btn => {
    on(btn, 'click', (e) => createRipple(btn, e));
  });

  // ── Loading Button ──
  const loadingBtn = document.getElementById('btn-loading-demo');
  if (loadingBtn) {
    on(loadingBtn, 'click', () => {
      if (loadingBtn.classList.contains('is-loading')) return;

      loadingBtn.classList.add('is-loading');
      loadingBtn.setAttribute('aria-busy', 'true');
      loadingBtn.disabled = true;

      setTimeout(() => {
        loadingBtn.classList.remove('is-loading');
        loadingBtn.setAttribute('aria-busy', 'false');
        loadingBtn.disabled = false;

        // Show checkmark momentarily
        const label = loadingBtn.querySelector('.btn__label');
        if (label) label.textContent = '✓ Done!';
        setTimeout(() => {
          if (label) label.textContent = 'Click to Load';
        }, 1500);
      }, 2200);
    });
  }

  // ── Hero random button — scroll to random section ──
  const heroRandom = document.getElementById('hero-random-btn');
  if (heroRandom) {
    on(heroRandom, 'click', () => {
      const sections = document.querySelectorAll('.section[id]');
      const pick = sections[Math.floor(Math.random() * sections.length)];
      if (pick) pick.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }
})();
