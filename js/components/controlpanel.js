/**
 * Control Panel — live design token editing
 */
(() => {
  const { $, $$, on } = UI;

  const panel     = $('#control-panel');
  const overlay   = $('#control-panel-overlay');
  const openBtn   = $('#settings-toggle');
  const closeBtn  = $('#control-panel-close');
  if (!panel) return;

  const openPanel = () => {
    panel.removeAttribute('hidden');
    overlay.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
  };

  const closePanel = () => {
    panel.classList.add('is-closing');
    panel.addEventListener('animationend', () => {
      panel.setAttribute('hidden', '');
      panel.classList.remove('is-closing');
      overlay.setAttribute('hidden', '');
      document.body.style.overflow = '';
    }, { once: true });
  };

  on(openBtn,  'click', openPanel);
  on(closeBtn, 'click', closePanel);
  on(overlay,  'click', closePanel);
  on(document, 'keydown', (e) => {
    if (e.key === 'Escape' && !panel.hasAttribute('hidden')) closePanel();
  });

  const { appStore, hexToRgb, initRangeSlider } = UI;
  const state = appStore.get();

  // ── Color swatches ──
  const swatches = $$('.cp-swatch');
  swatches.forEach(swatch => {
    on(swatch, 'click', () => {
      swatches.forEach(s => s.classList.remove('is-active'));
      swatch.classList.add('is-active');

      const color = swatch.dataset.color;
      const rgb = hexToRgb(color);

      document.documentElement.style.setProperty('--color-primary', color);

      if (rgb) {
        document.documentElement.style.setProperty('--color-primary-rgb', rgb);
        // Light shade
        const lighterColor = lightenHex(color, 20);
        document.documentElement.style.setProperty('--color-primary-light', lighterColor);
        // Dark shade
        const darkerColor = darkenHex(color, 20);
        document.documentElement.style.setProperty('--color-primary-dark', darkerColor);
      }

      appStore.set({ primaryColor: color });
      UI.showToast?.('success', 'Theme Updated', `Primary color changed to ${color}`);
    });
  });

  // Mark current active swatch
  const activateSwatchFor = (color) => {
    swatches.forEach(s => {
      s.classList.toggle('is-active', s.dataset.color === color);
    });
  };
  activateSwatchFor(state.primaryColor);

  // ── Border radius ──
  const radiusInput = $('#cp-border-radius');
  const radiusOutput = $('#cp-border-radius-val');
  if (radiusInput) {
    radiusInput.value = state.borderRadius;
    if (radiusOutput) radiusOutput.textContent = `${state.borderRadius}px`;
    if (UI.initRangeSlider) UI.initRangeSlider(radiusInput, radiusOutput);

    on(radiusInput, 'input', () => {
      const val = radiusInput.value;
      document.documentElement.style.setProperty('--radius', `${val}px`);
      document.documentElement.style.setProperty('--radius-sm', `${Math.max(0, val - 2)}px`);
      document.documentElement.style.setProperty('--radius-md', `${+val + 4}px`);
      document.documentElement.style.setProperty('--radius-lg', `${+val + 8}px`);
      document.documentElement.style.setProperty('--radius-xl', `${+val + 16}px`);
      if (radiusOutput) radiusOutput.textContent = `${val}px`;
      appStore.set({ borderRadius: +val });
    });
  }

  // ── Animation speed ──
  const speedInput  = $('#cp-anim-speed');
  const speedOutput = $('#cp-anim-speed-val');
  if (speedInput) {
    speedInput.value = state.animSpeed;
    if (speedOutput) speedOutput.textContent = `${state.animSpeed / 100}x`;
    if (UI.initRangeSlider) UI.initRangeSlider(speedInput, {
      textContent: '',
      set: v => {}
    });

    on(speedInput, 'input', () => {
      const val = speedInput.value;
      const multiplier = val / 100;
      const dur = (base) => `${Math.round(base / multiplier)}ms`;

      document.documentElement.style.setProperty('--duration-fast',    dur(150));
      document.documentElement.style.setProperty('--duration-normal',  dur(250));
      document.documentElement.style.setProperty('--duration-slow',    dur(400));
      document.documentElement.style.setProperty('--duration-slower',  dur(600));
      document.documentElement.style.setProperty('--duration-slowest', dur(800));

      if (speedOutput) speedOutput.textContent = `${multiplier}x`;
      appStore.set({ animSpeed: +val });
    });
  }

  // ── Font size ──
  const fontInput  = $('#cp-font-size');
  const fontOutput = $('#cp-font-size-val');
  if (fontInput) {
    fontInput.value = state.fontSize;
    if (fontOutput) fontOutput.textContent = `${state.fontSize}px`;
    if (UI.initRangeSlider) UI.initRangeSlider(fontInput, fontOutput);

    on(fontInput, 'input', () => {
      const val = fontInput.value;
      document.documentElement.style.setProperty('--font-size-base', `${val}px`);
      document.documentElement.style.fontSize = `${val}px`;
      if (fontOutput) fontOutput.textContent = `${val}px`;
      appStore.set({ fontSize: +val });
    });
  }

  // ── Reduce motion ──
  const motionInput = $('#cp-reduce-motion');
  if (motionInput) {
    motionInput.checked = state.reduceMotion;
    on(motionInput, 'change', () => {
      const reduce = motionInput.checked;
      if (reduce) {
        document.documentElement.setAttribute('data-reduce-motion', '');
      } else {
        document.documentElement.removeAttribute('data-reduce-motion');
      }
      appStore.set({ reduceMotion: reduce });
    });
  }

  // ── Reset ──
  const resetBtn = $('#cp-reset');
  on(resetBtn, 'click', () => {
    localStorage.removeItem('ui-lab-prefs');
    location.reload();
  });

  // ── Helpers: lighten/darken hex ──
  function hexToHsl(hex) {
    let r = parseInt(hex.slice(1,3), 16) / 255;
    let g = parseInt(hex.slice(3,5), 16) / 255;
    let b = parseInt(hex.slice(5,7), 16) / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    if (max === min) { h = s = 0; }
    else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }
    return [h * 360, s * 100, l * 100];
  }

  function hslToHex(h, s, l) {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  }

  function lightenHex(hex, amount) {
    const [h, s, l] = hexToHsl(hex);
    return hslToHex(h, s, Math.min(100, l + amount));
  }

  function darkenHex(hex, amount) {
    const [h, s, l] = hexToHsl(hex);
    return hslToHex(h, s, Math.max(0, l - amount));
  }
})();
