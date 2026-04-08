/**
 * Card interactions — 3D tilt, expand/collapse
 */
(() => {
  const { $$, on, spring, clamp } = UI;

  // ── 3D Tilt Cards ──
  $$('[data-tilt]').forEach(card => {
    let raf = null;
    let targetX = 0, targetY = 0;
    let currentX = 0, currentY = 0;

    const lerp = () => {
      currentX = spring(currentX, targetX, 0.1);
      currentY = spring(currentY, targetY, 0.1);

      card.style.transform = `perspective(800px) rotateX(${currentX}deg) rotateY(${currentY}deg) scale(1.02)`;

      // Move glow
      const glow = card.querySelector('.card__glow');
      if (glow) {
        const pct = (v, max) => 50 + (v / max) * 30;
        glow.style.background = `radial-gradient(
          circle at ${pct(targetY, 15)}% ${pct(-targetX, 15)}%,
          rgba(var(--color-primary-rgb), 0.15) 0%,
          transparent 65%
        )`;
      }

      if (Math.abs(currentX - targetX) > 0.01 || Math.abs(currentY - targetY) > 0.01) {
        raf = requestAnimationFrame(lerp);
      }
    };

    const onMouseMove = (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const pctX = (x / rect.width)  - 0.5;   // -0.5 to 0.5
      const pctY = (y / rect.height) - 0.5;

      targetX = clamp(-pctY * 15, -15, 15);
      targetY = clamp(pctX * 15, -15, 15);

      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(lerp);
    };

    const onMouseLeave = () => {
      targetX = 0;
      targetY = 0;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(lerp);

      card.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
      setTimeout(() => { card.style.transition = ''; }, 500);
    };

    on(card, 'mousemove', onMouseMove);
    on(card, 'mouseleave', onMouseLeave);

    // Touch support
    on(card, 'touchmove', (e) => {
      const touch = e.touches[0];
      onMouseMove(touch);
    }, { passive: true });

    on(card, 'touchend', onMouseLeave);
  });

  // ── Expandable Cards ──
  $$('[data-expand-toggle]').forEach(header => {
    const cardId = header.dataset.expandToggle;
    const card = document.getElementById(cardId);
    if (!card) return;

    const btn = header.querySelector('.card__expand-btn');

    on(header, 'click', () => {
      const isExpanded = card.classList.toggle('is-expanded');
      if (btn) btn.setAttribute('aria-expanded', String(isExpanded));
    });
  });
})();
