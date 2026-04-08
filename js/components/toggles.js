/**
 * Toggle, checkbox and radio microinteractions
 */
(() => {
  const { $$, on } = UI;

  // ── Update toggle label text ──
  $$('.toggle--classic').forEach(toggle => {
    const input = toggle.querySelector('.toggle__input');
    const label = toggle.querySelector('.toggle__label');
    if (!input || !label) return;

    const update = () => {
      if (label.dataset.on || label.dataset.off) {
        label.textContent = input.checked
          ? (label.dataset.on || 'On')
          : (label.dataset.off || 'Off');
      }
    };

    on(input, 'change', update);
  });

  // ── Checkbox ripple on click ──
  $$('.checkbox').forEach(wrapper => {
    on(wrapper, 'click', (e) => {
      const box = wrapper.querySelector('.checkbox__box');
      if (!box) return;

      const ripple = document.createElement('span');
      ripple.style.cssText = `
        position: absolute;
        inset: -6px;
        border-radius: 50%;
        background: rgba(var(--color-primary-rgb), 0.15);
        transform: scale(0);
        animation: rippleAnim 400ms ease forwards;
        pointer-events: none;
      `;
      box.style.position = 'relative';
      box.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove(), { once: true });
    });
  });
})();
