/**
 * Input / Form interactions
 */
(() => {
  const { $, $$, on } = UI;

  // ── Password visibility toggle ──
  $$('.field__toggle-pass').forEach(btn => {
    const field = btn.closest('.field--password');
    const input = field?.querySelector('.field__input');
    const eyeEl   = btn.querySelector('.icon--eye');
    const eyeOff  = btn.querySelector('.icon--eye-off');
    if (!input) return;

    on(btn, 'click', () => {
      const isPassword = input.type === 'password';
      input.type = isPassword ? 'text' : 'password';
      if (eyeEl)  eyeEl.style.display  = isPassword ? 'none' : 'block';
      if (eyeOff) eyeOff.style.display = isPassword ? 'block' : 'none';
      btn.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
    });
  });

  // ── Password strength meter ──
  const passInput = $('#demo-pass');
  const strengthFill  = $('.strength-meter__fill');
  const strengthLabel = $('.strength-meter__label');

  if (passInput && strengthFill) {
    const getStrength = (val) => {
      let score = 0;
      if (val.length >= 8) score++;
      if (/[A-Z]/.test(val)) score++;
      if (/[0-9]/.test(val)) score++;
      if (/[^A-Za-z0-9]/.test(val)) score++;
      return score;
    };

    const levels = [
      { label: 'Weak',   color: '#ef4444', width: '25%' },
      { label: 'Fair',   color: '#f59e0b', width: '50%' },
      { label: 'Good',   color: '#06b6d4', width: '75%' },
      { label: 'Strong', color: '#10b981', width: '100%' },
    ];

    on(passInput, 'input', () => {
      const val = passInput.value;
      if (!val) {
        strengthFill.style.width = '0';
        if (strengthLabel) strengthLabel.textContent = 'Strength';
        return;
      }
      const score = getStrength(val);
      const level = levels[Math.min(score - 1, 3)];
      if (!level) {
        strengthFill.style.width = '0';
        if (strengthLabel) strengthLabel.textContent = 'Weak';
        return;
      }
      strengthFill.style.width = level.width;
      strengthFill.style.background = level.color;
      if (strengthLabel) strengthLabel.textContent = level.label;
    });
  }

  // ── Range slider dynamic fill ──
  const initRangeSlider = (input, outputEl) => {
    const update = () => {
      const val = input.value;
      const min = input.min || 0;
      const max = input.max || 100;
      const pct = ((val - min) / (max - min)) * 100;
      input.style.background = `linear-gradient(to right,
        var(--color-primary) 0%,
        var(--color-primary) ${pct}%,
        var(--color-surface-3) ${pct}%,
        var(--color-surface-3) 100%
      )`;
      if (outputEl) outputEl.textContent = val;
    };
    on(input, 'input', update);
    update();
  };

  const demoRange = $('#demo-range');
  const demoRangeVal = $('#demo-range-val');
  if (demoRange) initRangeSlider(demoRange, demoRangeVal);

  // ── Search field clear button ──
  const searchFieldInput = $('#demo-search-field');
  const clearBtn = searchFieldInput?.parentElement?.querySelector('.search-field__clear');

  if (searchFieldInput && clearBtn) {
    const toggleClear = () => {
      clearBtn.hidden = !searchFieldInput.value;
    };
    on(searchFieldInput, 'input', toggleClear);
    on(clearBtn, 'click', () => {
      searchFieldInput.value = '';
      toggleClear();
      searchFieldInput.focus();
    });
  }

  // Export initRangeSlider for control panel use
  window.UI.initRangeSlider = initRangeSlider;
})();
