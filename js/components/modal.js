/**
 * Component Detail Modal
 */
(() => {
  const { $, $$, on } = UI;

  const modal      = $('#component-modal');
  const backdrop   = $('#modal-backdrop');
  const closeBtn   = $('#modal-close');
  const titleEl    = $('#modal-title');
  const previewEl  = $('#modal-preview');
  const statesEl   = $('#modal-states');
  const codeEl     = $('#modal-code');
  const copyBtn    = $('#code-block-copy');
  const modalCopyBtn = $('#modal-copy-btn');
  const htmlTabBtn = document.querySelector('[data-code-tab="html"]');
  const cssTabBtn  = document.querySelector('[data-code-tab="css"]');
  const jsTabBtn   = document.querySelector('[data-code-tab="js"]');

  if (!modal) return;

  let currentData = null;
  let currentTab  = 'html';

  const switchTab = (tab) => {
    currentTab = tab;
    [htmlTabBtn, cssTabBtn, jsTabBtn].forEach(btn => {
      if (!btn) return;
      const isActive = btn.dataset.codeTab === tab;
      btn.classList.toggle('is-active', isActive);
      btn.setAttribute('aria-selected', isActive);
    });
    codeEl.textContent = (tab === 'html' ? currentData?.code : currentData?.[tab]) || '';
  };

  if (htmlTabBtn) on(htmlTabBtn, 'click', () => switchTab('html'));
  if (cssTabBtn)  on(cssTabBtn,  'click', () => switchTab('css'));
  if (jsTabBtn)   on(jsTabBtn,   'click', () => switchTab('js'));

  // ── Component data ──
  const components = {
    'btn-primary': {
      title: 'Primary Button',
      desc:  'Main call-to-action. Uses ripple effect and hover glow transition.',
      preview: `
        <button class="btn btn--primary" data-ripple>Primary Action</button>
        <button class="btn btn--primary btn--lg" data-ripple>Large</button>
        <button class="btn btn--primary btn--sm" data-ripple>Small</button>
      `,
      code: `<button class="btn btn--primary" data-ripple>Primary Action</button>`,
      css: `.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  border: 1px solid transparent;
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  font-weight: 600;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: background 150ms, box-shadow 150ms, transform 150ms;
}

.btn--primary {
  background: var(--color-primary);
  color: #fff;
}
.btn--primary:hover {
  background: var(--color-primary-light);
  box-shadow: 0 0 0 4px rgba(var(--color-primary-rgb), 0.2);
  transform: translateY(-1px);
}

/* Ripple */
.ripple {
  position: absolute;
  border-radius: 50%;
  background: rgba(255,255,255,0.35);
  transform: scale(0);
  animation: ripple 600ms ease-out;
  pointer-events: none;
}
@keyframes ripple {
  to { transform: scale(1); opacity: 0; }
}`,
      js: `document.querySelectorAll('[data-ripple]').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top  - size / 2;
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.style.cssText =
      \`width:\${size}px;height:\${size}px;left:\${x}px;top:\${y}px;\`;
    btn.appendChild(ripple);
    ripple.addEventListener('animationend',
      () => ripple.remove(), { once: true });
  });
});`,
    },
    'btn-ghost': {
      title: 'Ghost Button',
      desc: 'Secondary action button with transparent background.',
      preview: `
        <button class="btn btn--ghost">Ghost</button>
        <button class="btn btn--ghost btn--lg">Large Ghost</button>
        <button class="btn btn--ghost btn--sm">Small</button>
      `,
      code: `<button class="btn btn--ghost">Ghost Button</button>`,
      css: `.btn--ghost {
  background: transparent;
  border-color: var(--color-border);
  color: var(--color-text-1);
}
.btn--ghost:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
  background: rgba(var(--color-primary-rgb), 0.06);
}`,
    },
    'btn-loading': {
      title: 'Loading State Button',
      desc: 'Button with spinning loader for async actions.',
      preview: `
        <button class="btn btn--primary is-loading" aria-busy="true" disabled>
          <span class="btn__label">Loading…</span>
          <span class="btn__spinner"></span>
        </button>
        <button class="btn btn--primary" id="modal-load-btn" data-ripple>
          <span class="btn__label">Click to Load</span>
          <span class="btn__spinner"></span>
        </button>
      `,
      code: `<button class="btn btn--primary" id="submit-btn">
  <span class="btn__label">Submit</span>
  <span class="btn__spinner" aria-hidden="true"></span>
</button>`,
      css: `.btn__spinner {
  display: none;
  width: 1em; height: 1em;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 600ms linear infinite;
}
.btn.is-loading .btn__label  { opacity: 0.4; }
.btn.is-loading .btn__spinner { display: block; }

@keyframes spin { to { transform: rotate(360deg); } }`,
      js: `const btn = document.getElementById('submit-btn');
btn.addEventListener('click', async () => {
  btn.classList.add('is-loading');
  btn.setAttribute('aria-busy', 'true');
  btn.disabled = true;

  await fetch('/api/submit', { method: 'POST' });

  btn.classList.remove('is-loading');
  btn.removeAttribute('aria-busy');
  btn.disabled = false;
});`,
    },
    'btn-icon': {
      title: 'Icon Buttons',
      desc: 'Compact square buttons containing only an icon.',
      preview: `
        <button class="btn btn--icon btn--primary" aria-label="Add" data-ripple>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        </button>
        <button class="btn btn--icon btn--ghost" aria-label="Settings" data-ripple>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>
        </button>
        <button class="btn btn--icon btn--danger" aria-label="Delete" data-ripple>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3,6 5,6 21,6"/><path d="M19 6l-1 14H6L5 6"/></svg>
        </button>
      `,
      code: `<button class="btn btn--icon btn--primary" aria-label="Add item">
  <svg><!-- icon --></svg>
</button>`,
      css: `.btn--icon {
  padding: 0;
  width: 2.25rem;
  height: 2.25rem;
  justify-content: center;
}
.btn--icon.btn--sm { width: 1.75rem; height: 1.75rem; }
.btn--icon.btn--lg { width: 2.75rem; height: 2.75rem; }`,
    },
    'btn-gradient': {
      title: 'Gradient Button',
      desc: 'Animated gradient background with on-hover glow.',
      preview: `
        <button class="btn btn--gradient" data-ripple>Gradient Glow</button>
        <button class="btn btn--gradient btn--lg" data-ripple>Large Gradient</button>
      `,
      code: `<button class="btn btn--gradient">Gradient Glow</button>`,
      css: `.btn--gradient {
  background: linear-gradient(135deg,
    var(--color-primary), hsl(270,80%,60%));
  color: #fff;
  border: none;
}
.btn--gradient:hover {
  filter: brightness(1.15);
  box-shadow: 0 4px 20px rgba(var(--color-primary-rgb), 0.45);
  transform: translateY(-2px);
}`,
    },
    'btn-group': {
      title: 'Button Group',
      desc: 'Segmented control with sliding active pill indicator.',
      preview: `
        <div class="btn-group" role="group">
          <button class="btn-group__btn is-active">Day</button>
          <button class="btn-group__btn">Week</button>
          <button class="btn-group__btn">Month</button>
        </div>
      `,
      code: `<div class="btn-group" role="group" aria-label="View options">
  <button class="btn-group__btn is-active">Day</button>
  <button class="btn-group__btn">Week</button>
  <button class="btn-group__btn">Month</button>
</div>`,
      css: `.btn-group {
  position: relative;
  display: inline-flex;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 3px; gap: 0;
}
.btn-group__btn {
  position: relative; z-index: 1;
  padding: 0.375rem 0.875rem;
  font-size: var(--font-size-sm);
  border: none; background: none;
  cursor: pointer; border-radius: var(--radius-sm);
  color: var(--color-text-2);
  transition: color 150ms;
}
.btn-group__btn.is-active { color: var(--color-text-1); }
.btn-group__pill {
  position: absolute;
  top: 3px; height: calc(100% - 6px);
  background: var(--color-surface-2);
  border-radius: var(--radius-sm);
  transition: left 250ms var(--ease-spring),
              width 250ms var(--ease-spring);
  pointer-events: none;
}`,
      js: `const group = document.querySelector('.btn-group');
const btns  = [...group.querySelectorAll('.btn-group__btn')];
const pill  = document.createElement('span');
pill.className = 'btn-group__pill';
group.appendChild(pill);

const movePill = (btn) => {
  pill.style.left  = btn.offsetLeft + 'px';
  pill.style.width = btn.offsetWidth + 'px';
};

btns.forEach(btn => btn.addEventListener('click', () => {
  btns.forEach(b => b.classList.remove('is-active'));
  btn.classList.add('is-active');
  movePill(btn);
}));

requestAnimationFrame(() => {
  movePill(btns.find(b => b.classList.contains('is-active')) || btns[0]);
});`,
    },
    'toggle-classic': {
      title: 'Classic Toggle',
      desc: 'Elastic spring animation on the thumb.',
      preview: `
        <label class="toggle toggle--classic">
          <input class="toggle__input" type="checkbox" role="switch" checked />
          <span class="toggle__track"><span class="toggle__thumb"></span></span>
          <span class="toggle__label">Enabled</span>
        </label>
        <label class="toggle toggle--classic">
          <input class="toggle__input" type="checkbox" role="switch" />
          <span class="toggle__track"><span class="toggle__thumb"></span></span>
          <span class="toggle__label">Disabled</span>
        </label>
      `,
      code: `<label class="toggle toggle--classic">
  <input class="toggle__input" type="checkbox" role="switch" />
  <span class="toggle__track">
    <span class="toggle__thumb"></span>
  </span>
  <span class="toggle__label">Label</span>
</label>`,
      css: `.toggle__track {
  position: relative;
  width: 2.75rem; height: 1.5rem;
  border-radius: 9999px;
  background: var(--color-surface-3);
  transition: background 150ms;
}
.toggle__input:checked ~ .toggle__track {
  background: var(--color-primary);
}
.toggle__thumb {
  position: absolute;
  top: 3px; left: 3px;
  width: 1.125rem; height: 1.125rem;
  border-radius: 50%;
  background: #fff;
  transition: transform 300ms cubic-bezier(0.34,1.56,0.64,1),
              width 150ms;
}
.toggle__input:checked ~ .toggle__track .toggle__thumb {
  transform: translateX(1.25rem);
}
/* Squish on press */
.toggle__input:active ~ .toggle__track .toggle__thumb {
  width: 1.4rem;
}`,
    },
    'loader-ring': {
      title: 'Ring Spinner',
      desc: 'CSS-only spinning ring loader.',
      preview: `
        <div class="loader loader--ring" style="width:24px;height:24px;border-width:2px" role="status"><span class="sr-only">Loading</span></div>
        <div class="loader loader--ring" role="status"><span class="sr-only">Loading</span></div>
        <div class="loader loader--ring" style="width:56px;height:56px;border-width:4px" role="status"><span class="sr-only">Loading</span></div>
      `,
      code: `<div class="loader loader--ring" role="status">
  <span class="sr-only">Loading…</span>
</div>`,
      css: `.loader--ring {
  width: 2rem; height: 2rem;
  border-radius: 50%;
  border: 3px solid var(--color-border);
  border-top-color: var(--color-primary);
  animation: spin 700ms linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }`,
    },
    'loader-dots': {
      title: 'Bouncing Dots',
      desc: 'Staggered bounce animation. Great for chat typing indicators.',
      preview: `
        <div class="loader loader--dots" role="status">
          <span class="loader__dot"></span>
          <span class="loader__dot"></span>
          <span class="loader__dot"></span>
          <span class="sr-only">Loading</span>
        </div>
      `,
      code: `<div class="loader loader--dots" role="status">
  <span class="loader__dot"></span>
  <span class="loader__dot"></span>
  <span class="loader__dot"></span>
  <span class="sr-only">Loading…</span>
</div>`,
      css: `.loader--dots {
  display: flex; gap: 5px; align-items: center;
}
.loader__dot {
  width: 8px; height: 8px;
  border-radius: 50%;
  background: var(--color-primary);
  animation: bounce 1.2s ease-in-out infinite;
}
.loader__dot:nth-child(2) { animation-delay: 0.2s; }
.loader__dot:nth-child(3) { animation-delay: 0.4s; }
@keyframes bounce {
  0%, 80%, 100% { transform: translateY(0); }
  40%           { transform: translateY(-10px); }
}`,
    },
    'card-tilt': {
      title: '3D Tilt Card',
      preview: `
        <div class="card card--tilt" data-tilt style="max-width:220px">
          <div class="card__glow"></div>
          <div class="card__body">
            <div class="card__avatar"><span style="font-size:1.2rem">✦</span></div>
            <h4 class="card__title">Tilt Card</h4>
            <p class="card__text">Hover to see the 3D effect.</p>
          </div>
        </div>
      `,
      code: `<div class="card card--tilt" data-tilt>
  <div class="card__glow" aria-hidden="true"></div>
  <div class="card__body">
    <!-- card content -->
  </div>
</div>`,
      css: `.card--tilt {
  transform-style: preserve-3d;
  transition: box-shadow 300ms;
  will-change: transform;
}
.card__glow {
  position: absolute; inset: 0;
  border-radius: inherit;
  background: radial-gradient(
    circle at calc(var(--mouse-x, 50%) * 1%)
              calc(var(--mouse-y, 50%) * 1%),
    rgba(var(--color-primary-rgb), 0.18), transparent 60%
  );
  pointer-events: none;
  opacity: 0; transition: opacity 300ms;
}
.card--tilt:hover .card__glow { opacity: 1; }`,
      js: `document.querySelectorAll('[data-tilt]').forEach(card => {
  let rx = 0, ry = 0, rafId;

  const loop = () => {
    card.style.transform =
      \`perspective(800px) rotateX(\${rx}deg) rotateY(\${ry}deg) scale(1.04)\`;
    rafId = requestAnimationFrame(loop);
  };

  card.addEventListener('mouseenter', loop);
  card.addEventListener('mousemove', (e) => {
    const { left, top, width, height } = card.getBoundingClientRect();
    const mx = (e.clientX - left) / width  - 0.5;
    const my = (e.clientY - top)  / height - 0.5;
    // spring interpolation (stiffness 0.12)
    rx += (-my * 15 - rx) * 0.12;
    ry += ( mx * 15 - ry) * 0.12;
    card.style.setProperty('--mouse-x', (mx + 0.5) * 100);
    card.style.setProperty('--mouse-y', (my + 0.5) * 100);
  });
  card.addEventListener('mouseleave', () => {
    cancelAnimationFrame(rafId);
    card.style.transition = 'transform 0.5s ease';
    card.style.transform  =
      'perspective(800px) rotateX(0) rotateY(0) scale(1)';
    setTimeout(() => { card.style.transition = ''; }, 500);
    rx = ry = 0;
  });
});`,
    },
    'toast': {
      title: 'Toast Notifications',
      preview: `
        <div style="display:flex;flex-direction:column;gap:10px;width:100%">
          <button class="btn btn--primary btn--sm" onclick="UI.showToast('success')">Show Success</button>
          <button class="btn btn--ghost btn--sm" onclick="UI.showToast('error')">Show Error</button>
          <button class="btn btn--ghost btn--sm" onclick="UI.showToast('info')">Show Info</button>
          <button class="btn btn--ghost btn--sm" onclick="UI.showToast('warning')">Show Warning</button>
        </div>
      `,
      code: `// Show a toast notification
UI.showToast('success', 'Saved!', 'Your changes were saved.');
UI.showToast('error',   'Failed', 'Please try again.');
UI.showToast('info',    'Update', 'New version available.');`,
      css: `.toast {
  display: flex; gap: 0.75rem; align-items: flex-start;
  padding: 0.875rem 1rem;
  background: var(--color-surface-2);
  border: 1px solid var(--color-border);
  border-left: 4px solid var(--toast-color, var(--color-primary));
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  animation: toast-in 300ms var(--ease-out);
}
.toast.is-leaving {
  animation: toast-out 250ms var(--ease-in) forwards;
}
@keyframes toast-in {
  from { opacity: 0; transform: translateX(120%); }
}
@keyframes toast-out {
  to { opacity: 0; transform: translateX(120%);
       max-height: 0; margin: 0; padding: 0; }
}`,
      js: `function showToast(type, title, message) {
  const colors = {
    success: '#22c55e', error: '#ef4444',
    info: '#6366f1', warning: '#f59e0b'
  };
  const toast = document.createElement('div');
  toast.className = \`toast toast--\${type}\`;
  toast.style.setProperty('--toast-color', colors[type]);
  toast.innerHTML = \`<strong>\${title}</strong><p>\${message}</p>\`;

  document.getElementById('toast-region').prepend(toast);

  const timer = setTimeout(() => removeToast(toast), 4000);
  toast.addEventListener('click', () => {
    clearTimeout(timer); removeToast(toast);
  });
}

function removeToast(toast) {
  toast.classList.add('is-leaving');
  toast.addEventListener('animationend',
    () => toast.remove(), { once: true });
}`,
    },
    'badge': {
      title: 'Badges',
      preview: `
        <div style="display:flex;flex-wrap:wrap;gap:8px">
          <span class="badge badge--primary">Primary</span>
          <span class="badge badge--success">Success</span>
          <span class="badge badge--warning">Warning</span>
          <span class="badge badge--danger">Error</span>
          <span class="badge badge--outline">Outline</span>
          <span class="badge badge--dot badge--success">Live</span>
          <span class="badge badge--dot badge--danger">Offline</span>
        </div>
      `,
      code: `<span class="badge badge--primary">Primary</span>
<span class="badge badge--success">Success</span>
<span class="badge badge--dot badge--success">Live</span>`,
      css: `.badge {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 2px 10px; border-radius: 9999px;
  font-size: var(--font-size-xs);
  font-weight: 600;
}
.badge--primary { background: rgba(var(--color-primary-rgb),.15);
                  color: var(--color-primary-light); }
.badge--success { background: rgba(34,197,94,.15);  color: #4ade80; }
.badge--warning { background: rgba(245,158,11,.15); color: #fbbf24; }
.badge--danger  { background: rgba(239,68,68,.15);  color: #f87171; }

/* Live dot */
.badge--dot::before {
  content: '';
  width: 6px; height: 6px;
  border-radius: 50%; background: currentColor;
  animation: badge-pulse 2s ease-in-out infinite;
}
@keyframes badge-pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50%       { opacity: 0.5; transform: scale(0.8); }
}`,
    },

    'toggle-icon': {
      title: 'Icon Toggle',
      desc: 'Toggle with embedded sun/moon icons inside the thumb.',
      preview: `
        <label class="toggle toggle--icon" aria-label="Theme toggle">
          <input class="toggle__input" type="checkbox" role="switch" />
          <span class="toggle__track"><span class="toggle__thumb">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="5"/><line x1="12" y1="2" x2="12" y2="4" stroke="currentColor" stroke-width="2"/><line x1="12" y1="20" x2="12" y2="22" stroke="currentColor" stroke-width="2"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke="currentColor" stroke-width="2"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke="currentColor" stroke-width="2"/><line x1="2" y1="12" x2="4" y2="12" stroke="currentColor" stroke-width="2"/><line x1="20" y1="12" x2="22" y2="12" stroke="currentColor" stroke-width="2"/></svg>
          </span></span>
        </label>
      `,
      code: `<label class="toggle toggle--icon" aria-label="Theme toggle">
  <input class="toggle__input" type="checkbox" role="switch" />
  <span class="toggle__track">
    <span class="toggle__thumb">
      <!-- icon inside thumb -->
    </span>
  </span>
</label>`,
      css: `.toggle--icon .toggle__track {
  width: 3.25rem; height: 1.75rem;
  background: var(--color-surface-3);
  border-radius: 9999px;
  padding: 3px;
  transition: background 200ms;
}
.toggle--icon .toggle__input:checked ~ .toggle__track {
  background: var(--color-primary);
}
.toggle--icon .toggle__thumb {
  display: flex; align-items: center; justify-content: center;
  width: 1.375rem; height: 1.375rem;
  border-radius: 50%; background: #fff;
  transition: transform 300ms cubic-bezier(0.34,1.56,0.64,1);
  color: #f59e0b;
}
.toggle--icon .toggle__input:checked ~ .toggle__track .toggle__thumb {
  transform: translateX(1.5rem);
  color: #6366f1;
}`,
      js: `const toggle = document.querySelector('.toggle--icon .toggle__input');
toggle.addEventListener('change', () => {
  document.documentElement.setAttribute(
    'data-theme', toggle.checked ? 'dark' : 'light'
  );
});`,
    },

    'checkbox-custom': {
      title: 'Custom Checkbox',
      desc: 'SVG checkmark drawn on with stroke-dashoffset animation.',
      preview: `
        <label class="checkbox">
          <input class="checkbox__input" type="checkbox" checked />
          <span class="checkbox__box"><svg class="checkbox__check" viewBox="0 0 12 10" fill="none"><polyline points="1,5 4,9 11,1" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
          <span class="checkbox__label">Accept terms</span>
        </label>
        <label class="checkbox">
          <input class="checkbox__input" type="checkbox" />
          <span class="checkbox__box"><svg class="checkbox__check" viewBox="0 0 12 10" fill="none"><polyline points="1,5 4,9 11,1" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
          <span class="checkbox__label">Subscribe to newsletter</span>
        </label>
      `,
      code: `<label class="checkbox">
  <input class="checkbox__input" type="checkbox" />
  <span class="checkbox__box">
    <svg class="checkbox__check" viewBox="0 0 12 10" fill="none">
      <polyline points="1,5 4,9 11,1"
        stroke="currentColor" stroke-width="2"
        stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  </span>
  <span class="checkbox__label">Remember me</span>
</label>`,
      css: `.checkbox {
  display: inline-flex; align-items: center;
  gap: 0.5rem; cursor: pointer; user-select: none;
}
.checkbox__input { position: absolute; opacity: 0; width: 0; height: 0; }
.checkbox__box {
  flex-shrink: 0;
  width: 1.125rem; height: 1.125rem;
  border: 2px solid var(--color-border);
  border-radius: var(--radius-sm);
  display: flex; align-items: center; justify-content: center;
  transition: background 150ms, border-color 150ms;
}
.checkbox__input:checked ~ .checkbox__box {
  background: var(--color-primary);
  border-color: var(--color-primary);
}
.checkbox__check {
  width: 10px; height: 8px;
  stroke-dasharray: 16;
  stroke-dashoffset: 16;
  transition: stroke-dashoffset 200ms ease;
}
.checkbox__input:checked ~ .checkbox__box .checkbox__check {
  stroke-dashoffset: 0;
}`,
    },

    'radio-custom': {
      title: 'Custom Radio',
      desc: 'Radio button with animated inner dot scale.',
      preview: `
        <div style="display:flex;flex-direction:column;gap:8px">
          <label class="radio"><input class="radio__input" type="radio" name="demo" checked /><span class="radio__dot"></span><span class="radio__label">Option Alpha</span></label>
          <label class="radio"><input class="radio__input" type="radio" name="demo" /><span class="radio__dot"></span><span class="radio__label">Option Beta</span></label>
          <label class="radio"><input class="radio__input" type="radio" name="demo" /><span class="radio__dot"></span><span class="radio__label">Option Gamma</span></label>
        </div>
      `,
      code: `<label class="radio">
  <input class="radio__input" type="radio" name="group" />
  <span class="radio__dot"></span>
  <span class="radio__label">Option Alpha</span>
</label>`,
      css: `.radio {
  display: inline-flex; align-items: center;
  gap: 0.5rem; cursor: pointer;
}
.radio__input { position: absolute; opacity: 0; width: 0; height: 0; }
.radio__dot {
  flex-shrink: 0;
  width: 1.125rem; height: 1.125rem;
  border-radius: 50%;
  border: 2px solid var(--color-border);
  display: flex; align-items: center; justify-content: center;
  transition: border-color 150ms;
}
.radio__dot::after {
  content: '';
  width: 6px; height: 6px;
  border-radius: 50%;
  background: var(--color-primary);
  transform: scale(0);
  transition: transform 200ms cubic-bezier(0.34,1.56,0.64,1);
}
.radio__input:checked ~ .radio__dot {
  border-color: var(--color-primary);
}
.radio__input:checked ~ .radio__dot::after {
  transform: scale(1);
}`,
    },

    'loader-wave': {
      title: 'Wave Bars',
      desc: 'Five bars with staggered height animation.',
      preview: `
        <div class="loader loader--wave" role="status">
          <span class="loader__bar"></span><span class="loader__bar"></span>
          <span class="loader__bar"></span><span class="loader__bar"></span>
          <span class="loader__bar"></span>
          <span class="sr-only">Loading</span>
        </div>
      `,
      code: `<div class="loader loader--wave" role="status">
  <span class="loader__bar"></span>
  <span class="loader__bar"></span>
  <span class="loader__bar"></span>
  <span class="loader__bar"></span>
  <span class="loader__bar"></span>
  <span class="sr-only">Loading…</span>
</div>`,
      css: `.loader--wave {
  display: flex; align-items: flex-end; gap: 3px; height: 24px;
}
.loader__bar {
  width: 4px; border-radius: 2px;
  background: var(--color-primary);
  animation: wave 1s ease-in-out infinite;
}
.loader__bar:nth-child(1) { animation-delay: 0s;    }
.loader__bar:nth-child(2) { animation-delay: 0.1s;  }
.loader__bar:nth-child(3) { animation-delay: 0.2s;  }
.loader__bar:nth-child(4) { animation-delay: 0.3s;  }
.loader__bar:nth-child(5) { animation-delay: 0.4s;  }
@keyframes wave {
  0%, 100% { height: 6px;  }
  50%       { height: 22px; }
}`,
    },

    'loader-pulse': {
      title: 'Pulse Loader',
      desc: 'Single circle with pulsing scale and opacity.',
      preview: `
        <div class="loader loader--pulse" role="status">
          <span class="sr-only">Loading</span>
        </div>
      `,
      code: `<div class="loader loader--pulse" role="status">
  <span class="sr-only">Loading…</span>
</div>`,
      css: `.loader--pulse {
  width: 2rem; height: 2rem;
  border-radius: 50%;
  background: var(--color-primary);
  animation: pulse-scale 1.2s ease-in-out infinite;
}
@keyframes pulse-scale {
  0%, 100% { transform: scale(1);    opacity: 1;   }
  50%       { transform: scale(1.5); opacity: 0.4; }
}`,
    },

    'loader-progress': {
      title: 'Progress Bar',
      desc: 'Horizontal progress bar with shimmer animation.',
      preview: `
        <div class="progress-bar" role="progressbar" aria-valuenow="65" aria-valuemin="0" aria-valuemax="100" style="width:100%">
          <div class="progress-bar__track"><div class="progress-bar__fill" style="width:65%"><span class="progress-bar__shimmer"></span></div></div>
          <span class="progress-bar__label">65%</span>
        </div>
      `,
      code: `<div class="progress-bar" role="progressbar"
     aria-valuenow="65" aria-valuemin="0" aria-valuemax="100">
  <div class="progress-bar__track">
    <div class="progress-bar__fill" style="width:65%">
      <span class="progress-bar__shimmer"></span>
    </div>
  </div>
  <span class="progress-bar__label">65%</span>
</div>`,
      css: `.progress-bar__track {
  height: 8px; border-radius: 9999px;
  background: var(--color-surface-3); overflow: hidden;
}
.progress-bar__fill {
  height: 100%; border-radius: 9999px;
  background: var(--color-primary);
  position: relative; overflow: hidden;
  transition: width 600ms var(--ease-out);
}
.progress-bar__shimmer {
  position: absolute; inset: 0;
  background: linear-gradient(
    90deg, transparent 0%, rgba(255,255,255,0.35) 50%, transparent 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.8s linear infinite;
}
@keyframes shimmer { to { background-position: -200% 0; } }`,
      js: `const fill = document.querySelector('.progress-bar__fill');
const label = document.querySelector('.progress-bar__label');
const bar   = document.querySelector('.progress-bar');

function setProgress(val) {
  const clamped = Math.min(100, Math.max(0, val));
  fill.style.width = clamped + '%';
  label.textContent = clamped + '%';
  bar.setAttribute('aria-valuenow', clamped);
}

setProgress(65);`,
    },

    'card-glass': {
      title: 'Glass Card',
      desc: 'Frosted glass effect using backdrop-filter blur.',
      preview: `
        <div style="background:linear-gradient(135deg,#6366f1,#8b5cf6);padding:24px;border-radius:12px;width:100%">
          <div class="card card--glass">
            <div class="card__body">
              <h4 class="card__title">Glass Card</h4>
              <p class="card__text">Frosted glass morphism effect.</p>
            </div>
          </div>
        </div>
      `,
      code: `<div class="card card--glass">
  <div class="card__body">
    <h4 class="card__title">Glass Card</h4>
    <p class="card__text">Content here.</p>
  </div>
</div>`,
      css: `.card--glass {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: var(--radius-lg);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}
/* Works best over a colorful or blurred background */
.card--glass .card__title { color: #fff; }
.card--glass .card__text  { color: rgba(255,255,255,0.7); }`,
    },

    'card-expand': {
      title: 'Expandable Card',
      desc: 'Expand/collapse content with max-height transition.',
      preview: `
        <div class="card card--expand" id="modal-expand-card" style="width:100%">
          <div class="card__body">
            <div class="card__expand-header" data-expand-toggle="modal-expand-card">
              <h4 class="card__title">Expandable</h4>
              <button class="card__expand-btn" aria-expanded="false">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6,9 12,15 18,9"/></svg>
              </button>
            </div>
            <p class="card__text">Always visible content.</p>
            <div class="card__expandable"><div class="card__expanded-content">Hidden content revealed on click. Add more details, links, or actions here.</div></div>
          </div>
        </div>
      `,
      code: `<div class="card card--expand" id="my-card">
  <div class="card__body">
    <div class="card__expand-header" data-expand-toggle="my-card">
      <h4 class="card__title">Expandable</h4>
      <button class="card__expand-btn" aria-expanded="false">
        <!-- chevron icon -->
      </button>
    </div>
    <p class="card__text">Always visible content.</p>
    <div class="card__expandable">
      <div class="card__expanded-content">
        Hidden content revealed on click.
      </div>
    </div>
  </div>
</div>`,
      css: `.card__expandable {
  max-height: 0;
  overflow: hidden;
  transition: max-height 400ms var(--ease-out);
}
.card--expand.is-expanded .card__expandable {
  max-height: 400px;
}
.card__expand-btn svg {
  transition: transform 300ms var(--ease-out);
}
.card--expand.is-expanded .card__expand-btn svg {
  transform: rotate(180deg);
}`,
      js: `document.addEventListener('click', (e) => {
  const header = e.target.closest('[data-expand-toggle]');
  if (!header) return;
  const card = document.getElementById(header.dataset.expandToggle);
  const btn  = card.querySelector('.card__expand-btn');
  const isExpanded = card.classList.toggle('is-expanded');
  btn.setAttribute('aria-expanded', isExpanded);
});`,
    },

    'card-stats': {
      title: 'Stats Card',
      desc: 'Metric card with trend badge and animated counter.',
      preview: `
        <div class="card card--stats" style="width:100%">
          <div class="card__body">
            <div class="card__header-row">
              <span class="card__label">Total Revenue</span>
              <span class="tag tag--success">+12.5%</span>
            </div>
            <div class="card__metric">$84,250</div>
          </div>
        </div>
      `,
      code: `<div class="card card--stats">
  <div class="card__body">
    <div class="card__header-row">
      <span class="card__label">Total Revenue</span>
      <span class="tag tag--success">+12.5%</span>
    </div>
    <div class="card__metric">$84,250</div>
  </div>
</div>`,
      css: `.card--stats { cursor: default; }
.card__header-row {
  display: flex; align-items: center;
  justify-content: space-between; margin-bottom: 0.5rem;
}
.card__label {
  font-size: var(--font-size-sm);
  color: var(--color-text-3);
}
.card__metric {
  font-size: 2rem; font-weight: 700;
  color: var(--color-text-1);
  letter-spacing: -0.03em;
}
.tag--success {
  padding: 2px 8px; border-radius: 9999px;
  font-size: var(--font-size-xs); font-weight: 600;
  background: rgba(34,197,94,.15); color: #4ade80;
}`,
      js: `// Animate counter on intersection
const metric = document.querySelector('.card__metric');
const observer = new IntersectionObserver(([entry]) => {
  if (!entry.isIntersecting) return;
  observer.disconnect();
  let start = 0, end = 84250, duration = 1200;
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    metric.textContent = '$' + Math.floor(
      progress * end
    ).toLocaleString();
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}, { threshold: 0.5 });
observer.observe(metric);`,
    },

    'input-float': {
      title: 'Floating Label Input',
      desc: 'Label floats above the field on focus or when filled.',
      preview: `
        <div style="display:flex;flex-direction:column;gap:16px;width:100%">
          <div class="field field--float">
            <input class="field__input" type="text" id="m-name" placeholder=" " />
            <label class="field__label" for="m-name">Full Name</label>
            <span class="field__bar"></span>
          </div>
          <div class="field field--float">
            <input class="field__input" type="email" id="m-email" placeholder=" " />
            <label class="field__label" for="m-email">Email Address</label>
            <span class="field__bar"></span>
          </div>
        </div>
      `,
      code: `<div class="field field--float">
  <input class="field__input" type="text"
         id="name" placeholder=" " />
  <label class="field__label" for="name">Full Name</label>
  <span class="field__bar"></span>
</div>`,
      css: `.field--float { position: relative; }
.field__input {
  width: 100%; padding: 1.25rem 0 0.5rem;
  background: none; border: none;
  border-bottom: 1px solid var(--color-border);
  color: var(--color-text-1); font-size: var(--font-size-base);
  outline: none;
}
.field__label {
  position: absolute; top: 1rem; left: 0;
  font-size: var(--font-size-base);
  color: var(--color-text-3);
  pointer-events: none;
  transition: top 200ms, font-size 200ms, color 200ms;
}
.field__input:focus ~ .field__label,
.field__input:not(:placeholder-shown) ~ .field__label {
  top: 0; font-size: var(--font-size-xs);
  color: var(--color-primary);
}
.field__bar {
  position: absolute; bottom: 0; left: 0;
  width: 0; height: 2px;
  background: var(--color-primary);
  transition: width 300ms var(--ease-out);
}
.field__input:focus ~ .field__bar { width: 100%; }`,
    },

    'input-validate': {
      title: 'Validation States',
      desc: 'Input fields with success and error visual feedback.',
      preview: `
        <div style="display:flex;flex-direction:column;gap:16px;width:100%">
          <div class="field field--float is-success">
            <input class="field__input" type="email" id="m-ok" value="user@example.com" placeholder=" " />
            <label class="field__label" for="m-ok">Email</label>
            <span class="field__bar"></span>
            <span class="field__icon field__icon--check">✓</span>
          </div>
          <div class="field field--float is-error">
            <input class="field__input" type="email" id="m-err" value="not-an-email" placeholder=" " />
            <label class="field__label" for="m-err">Email</label>
            <span class="field__bar"></span>
            <span class="field__msg">Enter a valid email address</span>
          </div>
        </div>
      `,
      code: `<!-- Success state -->
<div class="field field--float is-success">
  <input class="field__input" type="email"
         id="email" placeholder=" " />
  <label class="field__label" for="email">Email</label>
  <span class="field__bar"></span>
  <span class="field__icon field__icon--check">✓</span>
</div>

<!-- Error state -->
<div class="field field--float is-error">
  <input class="field__input" type="email"
         id="email2" placeholder=" " />
  <label class="field__label" for="email2">Email</label>
  <span class="field__bar"></span>
  <span class="field__msg">Enter a valid email address</span>
</div>`,
      css: `.field.is-success .field__bar { width: 100%; background: #22c55e; }
.field.is-success .field__label { color: #22c55e; }
.field.is-success .field__icon--check {
  position: absolute; right: 0; top: 1rem;
  color: #22c55e; font-weight: 700;
}
.field.is-error .field__bar { width: 100%; background: #ef4444; }
.field.is-error .field__label { color: #ef4444; }
.field.is-error .field__input { color: #ef4444; }
.field__msg {
  font-size: var(--font-size-xs);
  color: #ef4444; margin-top: 4px;
  animation: shake 300ms ease;
}
@keyframes shake {
  0%,100% { transform: translateX(0); }
  25%      { transform: translateX(-4px); }
  75%      { transform: translateX(4px); }
}`,
      js: `const input = document.querySelector('#email');
const field = input.closest('.field');

input.addEventListener('blur', () => {
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value);
  field.classList.toggle('is-success', valid);
  field.classList.toggle('is-error',   !valid);
});`,
    },

    'input-password': {
      title: 'Password Field',
      desc: 'Password input with show/hide toggle and strength meter.',
      preview: `
        <div style="display:flex;flex-direction:column;gap:16px;width:100%">
          <div class="field field--float field--password">
            <input class="field__input" type="password" id="m-pass" placeholder=" " value="MyP@ss1" />
            <label class="field__label" for="m-pass">Password</label>
            <span class="field__bar"></span>
            <button class="field__toggle-pass" type="button" aria-label="Toggle password">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            </button>
          </div>
          <div class="strength-meter" id="m-str"><div class="strength-meter__track"><div class="strength-meter__fill" style="width:75%;background:#22c55e"></div></div><span class="strength-meter__label" style="color:#22c55e">Strong</span></div>
        </div>
      `,
      code: `<div class="field field--float field--password">
  <input class="field__input" type="password"
         id="password" placeholder=" " />
  <label class="field__label" for="password">Password</label>
  <span class="field__bar"></span>
  <button class="field__toggle-pass" type="button"
          aria-label="Toggle password visibility">
    <!-- eye icon -->
  </button>
</div>
<div class="strength-meter">
  <div class="strength-meter__track">
    <div class="strength-meter__fill"></div>
  </div>
  <span class="strength-meter__label"></span>
</div>`,
      css: `.field--password { padding-right: 2.5rem; }
.field__toggle-pass {
  position: absolute; right: 0; top: 50%;
  transform: translateY(-50%);
  background: none; border: none; cursor: pointer;
  color: var(--color-text-3);
  transition: color 150ms;
}
.field__toggle-pass:hover { color: var(--color-text-1); }

.strength-meter__track {
  height: 4px; border-radius: 9999px;
  background: var(--color-surface-3); overflow: hidden;
}
.strength-meter__fill {
  height: 100%; border-radius: 9999px;
  transition: width 300ms ease, background 300ms ease;
}`,
      js: `const input = document.getElementById('password');
const fill  = document.querySelector('.strength-meter__fill');
const label = document.querySelector('.strength-meter__label');
const toggle = document.querySelector('.field__toggle-pass');

toggle.addEventListener('click', () => {
  const isPass = input.type === 'password';
  input.type = isPass ? 'text' : 'password';
});

input.addEventListener('input', () => {
  const v = input.value;
  let score = 0;
  if (v.length >= 8)    score++;
  if (/[A-Z]/.test(v)) score++;
  if (/[0-9]/.test(v)) score++;
  if (/[^A-Za-z0-9]/.test(v)) score++;
  const levels = [
    { w:'15%', c:'#ef4444', t:'Weak' },
    { w:'35%', c:'#f97316', t:'Fair' },
    { w:'60%', c:'#eab308', t:'Good' },
    { w:'100%',c:'#22c55e', t:'Strong' },
  ];
  const l = levels[Math.max(0, score - 1)] || levels[0];
  fill.style.width      = v ? l.w : '0';
  fill.style.background = l.c;
  label.textContent     = v ? l.t : '';
  label.style.color     = l.c;
});`,
    },

    'input-search': {
      title: 'Search Field',
      desc: 'Search input with animated clear button.',
      preview: `
        <div class="search-field" style="width:100%">
          <span class="search-field__icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></span>
          <input class="search-field__input" type="search" placeholder="Search components…" id="m-srch" />
          <button class="search-field__clear" type="button" aria-label="Clear" hidden>✕</button>
        </div>
      `,
      code: `<div class="search-field">
  <span class="search-field__icon"><!-- search svg --></span>
  <input class="search-field__input" type="search"
         placeholder="Search…" id="search" />
  <button class="search-field__clear" type="button"
          aria-label="Clear" hidden>✕</button>
</div>`,
      css: `.search-field {
  position: relative; display: flex; align-items: center;
}
.search-field__icon {
  position: absolute; left: 0.75rem;
  color: var(--color-text-3); pointer-events: none;
}
.search-field__input {
  width: 100%; padding: 0.625rem 2.5rem;
  background: var(--color-surface-2);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text-1); outline: none;
  transition: border-color 150ms, box-shadow 150ms;
}
.search-field__input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(var(--color-primary-rgb), 0.15);
}
.search-field__clear {
  position: absolute; right: 0.75rem;
  background: none; border: none; cursor: pointer;
  color: var(--color-text-3); opacity: 0;
  transition: opacity 150ms;
}
.search-field__clear:not([hidden]) { opacity: 1; }`,
      js: `const input = document.getElementById('search');
const clear = document.querySelector('.search-field__clear');

input.addEventListener('input', () => {
  clear.hidden = !input.value;
});
clear.addEventListener('click', () => {
  input.value = '';
  clear.hidden = true;
  input.focus();
});`,
    },

    'input-range': {
      title: 'Range Slider',
      desc: 'Range input with dynamic color fill and live value output.',
      preview: `
        <div class="range-field" style="width:100%">
          <div class="range-field__header">
            <label class="range-field__label" for="m-vol">Volume</label>
            <output class="range-field__value" id="m-vol-out">75</output>
          </div>
          <input class="range-field__input" type="range" id="m-vol" min="0" max="100" value="75"
            style="--range-fill:75%" />
        </div>
      `,
      code: `<div class="range-field">
  <div class="range-field__header">
    <label class="range-field__label" for="volume">Volume</label>
    <output class="range-field__value" id="volume-val">75</output>
  </div>
  <input class="range-field__input" type="range"
         id="volume" min="0" max="100" value="75" />
</div>`,
      css: `.range-field__input {
  -webkit-appearance: none; appearance: none;
  width: 100%; height: 4px;
  border-radius: 9999px; outline: none;
  background: linear-gradient(
    to right,
    var(--color-primary) var(--range-fill, 0%),
    var(--color-surface-3) var(--range-fill, 0%)
  );
}
.range-field__input::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 18px; height: 18px; border-radius: 50%;
  background: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(var(--color-primary-rgb), 0.25);
  cursor: pointer;
  transition: transform 150ms;
}
.range-field__input::-webkit-slider-thumb:hover {
  transform: scale(1.2);
}`,
      js: `const slider = document.getElementById('volume');
const output = document.getElementById('volume-val');

slider.addEventListener('input', () => {
  const pct = ((slider.value - slider.min)
    / (slider.max - slider.min)) * 100;
  slider.style.setProperty('--range-fill', pct + '%');
  output.textContent = slider.value;
});`,
    },

    'nav-tabs': {
      title: 'Animated Tabs',
      desc: 'Tab bar with a sliding active indicator.',
      preview: `
        <div class="tabs" role="tablist">
          <button class="tabs__tab is-active" role="tab" aria-selected="true">Overview</button>
          <button class="tabs__tab" role="tab" aria-selected="false">Analytics</button>
          <button class="tabs__tab" role="tab" aria-selected="false">Settings</button>
          <span class="tabs__indicator"></span>
        </div>
      `,
      code: `<div class="tabs" role="tablist">
  <button class="tabs__tab is-active"
          role="tab" aria-selected="true">Overview</button>
  <button class="tabs__tab"
          role="tab" aria-selected="false">Analytics</button>
  <button class="tabs__tab"
          role="tab" aria-selected="false">Settings</button>
  <span class="tabs__indicator"></span>
</div>`,
      css: `.tabs {
  position: relative; display: inline-flex;
  border-bottom: 1px solid var(--color-border);
}
.tabs__tab {
  padding: 0.625rem 1.25rem;
  background: none; border: none; cursor: pointer;
  font-size: var(--font-size-sm); font-weight: 500;
  color: var(--color-text-3);
  transition: color 150ms;
}
.tabs__tab.is-active { color: var(--color-text-1); }
.tabs__indicator {
  position: absolute; bottom: -1px; height: 2px;
  background: var(--color-primary);
  border-radius: 9999px;
  transition: left 250ms var(--ease-spring),
              width 250ms var(--ease-spring);
}`,
      js: `const tabs = document.querySelectorAll('.tabs__tab');
const indicator = document.querySelector('.tabs__indicator');

const moveIndicator = (tab) => {
  indicator.style.left  = tab.offsetLeft + 'px';
  indicator.style.width = tab.offsetWidth + 'px';
};

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => {
      t.classList.remove('is-active');
      t.setAttribute('aria-selected', 'false');
    });
    tab.classList.add('is-active');
    tab.setAttribute('aria-selected', 'true');
    moveIndicator(tab);
  });
});

requestAnimationFrame(() =>
  moveIndicator(document.querySelector('.tabs__tab.is-active'))
);`,
    },

    'nav-breadcrumb': {
      title: 'Breadcrumb',
      desc: 'Navigation breadcrumb trail with separator.',
      preview: `
        <nav class="breadcrumb" aria-label="Breadcrumb">
          <ol class="breadcrumb__list">
            <li class="breadcrumb__item"><a class="breadcrumb__link" href="#">Home</a></li>
            <li class="breadcrumb__item"><a class="breadcrumb__link" href="#">Components</a></li>
            <li class="breadcrumb__item breadcrumb__item--active" aria-current="page">Breadcrumb</li>
          </ol>
        </nav>
      `,
      code: `<nav class="breadcrumb" aria-label="Breadcrumb">
  <ol class="breadcrumb__list">
    <li class="breadcrumb__item">
      <a class="breadcrumb__link" href="/">Home</a>
    </li>
    <li class="breadcrumb__item">
      <a class="breadcrumb__link" href="/components">Components</a>
    </li>
    <li class="breadcrumb__item breadcrumb__item--active"
        aria-current="page">Breadcrumb</li>
  </ol>
</nav>`,
      css: `.breadcrumb__list {
  display: flex; flex-wrap: wrap; align-items: center;
  gap: 0.25rem; list-style: none; padding: 0; margin: 0;
}
.breadcrumb__item {
  display: flex; align-items: center; gap: 0.25rem;
}
.breadcrumb__item + .breadcrumb__item::before {
  content: '/';
  color: var(--color-text-3);
  font-size: var(--font-size-sm);
}
.breadcrumb__link {
  font-size: var(--font-size-sm);
  color: var(--color-text-3); text-decoration: none;
  transition: color 150ms;
}
.breadcrumb__link:hover { color: var(--color-primary); }
.breadcrumb__item--active {
  font-size: var(--font-size-sm);
  color: var(--color-text-1);
}`,
    },

    'nav-pagination': {
      title: 'Pagination',
      desc: 'Page navigation with active state and prev/next controls.',
      preview: `
        <nav class="pagination" aria-label="Pagination">
          <button class="pagination__btn" aria-label="Previous">‹</button>
          <button class="pagination__page">1</button>
          <button class="pagination__page is-active" aria-current="page">2</button>
          <button class="pagination__page">3</button>
          <span class="pagination__ellipsis">…</span>
          <button class="pagination__page">8</button>
          <button class="pagination__btn" aria-label="Next">›</button>
        </nav>
      `,
      code: `<nav class="pagination" aria-label="Pagination">
  <button class="pagination__btn" aria-label="Previous">‹</button>
  <button class="pagination__page">1</button>
  <button class="pagination__page is-active" aria-current="page">2</button>
  <button class="pagination__page">3</button>
  <span class="pagination__ellipsis">…</span>
  <button class="pagination__page">8</button>
  <button class="pagination__btn" aria-label="Next">›</button>
</nav>`,
      css: `.pagination {
  display: flex; align-items: center; gap: 0.25rem;
}
.pagination__page,
.pagination__btn {
  min-width: 2rem; height: 2rem; padding: 0 0.5rem;
  background: none; border: 1px solid transparent;
  border-radius: var(--radius-sm);
  font-size: var(--font-size-sm); cursor: pointer;
  color: var(--color-text-2);
  transition: background 150ms, color 150ms, border-color 150ms;
}
.pagination__page:hover, .pagination__btn:hover {
  background: var(--color-surface-2);
  color: var(--color-text-1);
}
.pagination__page.is-active {
  background: var(--color-primary);
  color: #fff; border-color: var(--color-primary);
}`,
      js: `const pages = document.querySelectorAll('.pagination__page');
pages.forEach(page => {
  page.addEventListener('click', () => {
    pages.forEach(p => {
      p.classList.remove('is-active');
      p.removeAttribute('aria-current');
    });
    page.classList.add('is-active');
    page.setAttribute('aria-current', 'page');
  });
});`,
    },

    'nav-dropdown': {
      title: 'Dropdown Menu',
      desc: 'Click-triggered dropdown with scale+fade entrance.',
      preview: `
        <div class="dropdown" style="position:relative">
          <button class="btn btn--ghost btn--sm dropdown__trigger" id="m-drop-btn">
            Options
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6,9 12,15 18,9"/></svg>
          </button>
          <ul class="dropdown__menu" id="m-drop-menu" role="menu" hidden>
            <li role="menuitem" class="dropdown__item">Edit</li>
            <li role="menuitem" class="dropdown__item">Duplicate</li>
            <li role="separator" class="dropdown__divider"></li>
            <li role="menuitem" class="dropdown__item dropdown__item--danger">Delete</li>
          </ul>
        </div>
      `,
      code: `<div class="dropdown">
  <button class="btn btn--ghost dropdown__trigger"
          id="my-dropdown-btn">
    Options
    <svg><!-- chevron --></svg>
  </button>
  <ul class="dropdown__menu" id="my-dropdown-menu"
      role="menu" hidden>
    <li class="dropdown__item" role="menuitem">Edit</li>
    <li class="dropdown__item" role="menuitem">Duplicate</li>
    <li class="dropdown__divider" role="separator"></li>
    <li class="dropdown__item dropdown__item--danger"
        role="menuitem">Delete</li>
  </ul>
</div>`,
      css: `.dropdown { position: relative; }
.dropdown__menu {
  position: absolute; top: calc(100% + 6px); left: 0;
  min-width: 180px; padding: 4px;
  background: var(--color-surface-2);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  transform-origin: top left;
  animation: dropdown-in 150ms var(--ease-out);
}
.dropdown__menu[hidden] { display: none; }
@keyframes dropdown-in {
  from { opacity: 0; transform: scale(0.95) translateY(-4px); }
}
.dropdown__item {
  padding: 0.5rem 0.75rem; border-radius: var(--radius-sm);
  font-size: var(--font-size-sm); cursor: pointer;
  color: var(--color-text-1); list-style: none;
  transition: background 100ms;
}
.dropdown__item:hover { background: var(--color-surface-3); }
.dropdown__item--danger { color: #ef4444; }
.dropdown__divider {
  height: 1px; background: var(--color-border); margin: 4px 0;
}`,
      js: `const btn  = document.getElementById('my-dropdown-btn');
const menu = document.getElementById('my-dropdown-menu');

btn.addEventListener('click', (e) => {
  e.stopPropagation();
  menu.hidden = !menu.hidden;
});

document.addEventListener('click', () => {
  menu.hidden = true;
});`,
    },

    'alert-banner': {
      title: 'Alert Banners',
      desc: 'Contextual alert messages with dismiss animation.',
      preview: `
        <div style="display:flex;flex-direction:column;gap:8px;width:100%">
          <div class="alert alert--success"><span class="alert__icon">✓</span><span>Changes saved successfully.</span></div>
          <div class="alert alert--warning"><span class="alert__icon">⚠</span><span>Your session expires in 5 minutes.</span></div>
          <div class="alert alert--danger"><span class="alert__icon">✕</span><span>Failed to submit the form.</span></div>
        </div>
      `,
      code: `<div class="alert alert--success">
  <span class="alert__icon">✓</span>
  <span>Changes saved successfully.</span>
  <button class="alert__close" aria-label="Dismiss">✕</button>
</div>`,
      css: `.alert {
  display: flex; align-items: center; gap: 0.625rem;
  padding: 0.75rem 1rem; border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  border-left: 4px solid currentColor;
}
.alert--success {
  background: rgba(34,197,94,.1); color: #4ade80;
}
.alert--warning {
  background: rgba(245,158,11,.1); color: #fbbf24;
}
.alert--danger {
  background: rgba(239,68,68,.1);  color: #f87171;
}
.alert__close {
  margin-left: auto; background: none; border: none;
  cursor: pointer; color: currentColor; opacity: 0.6;
  transition: opacity 150ms;
}
.alert__close:hover { opacity: 1; }
.alert.is-closing {
  animation: alert-out 250ms ease forwards;
}
@keyframes alert-out {
  to { opacity: 0; transform: translateX(8px);
       max-height: 0; padding: 0; margin: 0; }
}`,
      js: `document.querySelectorAll('.alert__close').forEach(btn => {
  btn.addEventListener('click', () => {
    const alert = btn.closest('.alert');
    alert.classList.add('is-closing');
    alert.addEventListener('animationend',
      () => alert.remove(), { once: true });
  });
});`,
    },

    'tooltip': {
      title: 'Tooltips',
      desc: 'CSS-only tooltips via data attribute, no JS required.',
      preview: `
        <div style="display:flex;gap:16px;flex-wrap:wrap;justify-content:center;padding:32px 0">
          <span class="tooltip-wrap" data-tip="Top tooltip" data-tooltip-pos="top">
            <button class="btn btn--ghost btn--sm">Top</button>
          </span>
          <span class="tooltip-wrap" data-tip="Bottom tooltip" data-tooltip-pos="bottom">
            <button class="btn btn--ghost btn--sm">Bottom</button>
          </span>
          <span class="tooltip-wrap" data-tip="Copy to clipboard">
            <button class="btn btn--ghost btn--sm">Default</button>
          </span>
        </div>
      `,
      code: `<span class="tooltip-wrap" data-tip="Helpful hint"
      data-tooltip-pos="top">
  <button class="btn btn--ghost btn--sm">Hover me</button>
</span>`,
      css: `.tooltip-wrap {
  position: relative; display: inline-flex;
}
.tooltip-wrap::after {
  content: attr(data-tip);
  position: absolute; bottom: calc(100% + 8px); left: 50%;
  transform: translateX(-50%) scale(0.85);
  padding: 5px 10px; border-radius: var(--radius-sm);
  background: var(--color-surface-3);
  border: 1px solid var(--color-border);
  color: var(--color-text-1);
  font-size: var(--font-size-xs); white-space: nowrap;
  pointer-events: none; opacity: 0;
  transition: opacity 150ms, transform 150ms;
  z-index: var(--z-tooltip);
}
.tooltip-wrap:hover::after {
  opacity: 1; transform: translateX(-50%) scale(1);
}
[data-tooltip-pos="bottom"]::after {
  bottom: auto; top: calc(100% + 8px);
  transform: translateX(-50%) scale(0.85);
}
[data-tooltip-pos="bottom"]:hover::after {
  transform: translateX(-50%) scale(1);
}`,
    },
  };

  const openModal = (componentId) => {
    const data = components[componentId];
    if (!data || !modal) return;

    currentData = data;

    titleEl.textContent = data.title || componentId;
    previewEl.innerHTML = data.preview || '';
    statesEl.innerHTML  = data.desc ? `<p style="font-size:var(--font-size-sm);color:var(--color-text-2)">${data.desc}</p>` : '';

    // Show/hide CSS and JS tabs depending on what data is available
    if (cssTabBtn) cssTabBtn.hidden = !data.css;
    if (jsTabBtn)  jsTabBtn.hidden  = !data.js;

    // Always start on the HTML tab
    switchTab('html');

    modal.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';

    // Re-init any buttons/ripples/tilts in preview
    requestAnimationFrame(() => {
      previewEl.querySelectorAll('[data-ripple]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const rect = btn.getBoundingClientRect();
          const size = Math.max(rect.width, rect.height) * 2;
          const x = e.clientX - rect.left - size / 2;
          const y = e.clientY - rect.top  - size / 2;
          const ripple = document.createElement('span');
          ripple.className = 'ripple';
          ripple.style.cssText = `width:${size}px;height:${size}px;left:${x}px;top:${y}px;`;
          btn.appendChild(ripple);
          ripple.addEventListener('animationend', () => ripple.remove(), { once: true });
        });
      });

      // Re-init tilt in modal
      previewEl.querySelectorAll('[data-tilt]').forEach(card => {
        card.addEventListener('mousemove', (e) => {
          const rect = card.getBoundingClientRect();
          const x = ((e.clientX - rect.left) / rect.width)  - 0.5;
          const y = ((e.clientY - rect.top)  / rect.height) - 0.5;
          card.style.transform = `perspective(600px) rotateX(${-y*12}deg) rotateY(${x*12}deg) scale(1.04)`;
        });
        card.addEventListener('mouseleave', () => {
          card.style.transform = 'perspective(600px) rotateX(0deg) rotateY(0deg) scale(1)';
          card.style.transition = 'transform 0.5s ease';
          setTimeout(() => { card.style.transition = ''; }, 500);
        });
      });

      // Re-init btn groups in modal
      previewEl.querySelectorAll('.btn-group').forEach(groupEl => {
        const btns = [...groupEl.querySelectorAll('.btn-group__btn')];
        const existing = groupEl.querySelector('.btn-group__pill');
        if (!existing) {
          const pill = document.createElement('span');
          pill.className = 'btn-group__pill';
          groupEl.appendChild(pill);
          const updatePill = (activeBtn) => {
            pill.style.left  = `${activeBtn.offsetLeft}px`;
            pill.style.width = `${activeBtn.offsetWidth}px`;
          };
          const active = btns.find(b => b.classList.contains('is-active')) || btns[0];
          if (active) requestAnimationFrame(() => updatePill(active));
          btns.forEach(btn => {
            btn.addEventListener('click', () => {
              btns.forEach(b => b.classList.remove('is-active'));
              btn.classList.add('is-active');
              updatePill(btn);
            });
          });
        }
      });
    });

    // Focus trap
    modal.querySelector('[tabindex="-1"]')?.focus() || closeBtn?.focus();
  };

  const closeModal = () => {
    if (!modal) return;
    modal.classList.add('is-closing');
    modal.addEventListener('animationend', () => {
      modal.setAttribute('hidden', '');
      modal.classList.remove('is-closing');
      document.body.style.overflow = '';
    }, { once: true });
  };

  // Open via data-modal
  on(document, 'click', (e) => {
    const btn = e.target.closest('[data-modal]');
    if (btn) openModal(btn.dataset.modal);
  });

  on(closeBtn, 'click', closeModal);
  on(backdrop, 'click', closeModal);

  on(document, 'keydown', (e) => {
    if (e.key === 'Escape' && !modal.hasAttribute('hidden')) {
      closeModal();
    }
  });

  // Code copy in modal (shared between header button and code-block button)
  const doCopy = (btn) => {
    const code = codeEl?.textContent;
    if (!code) return;
    navigator.clipboard?.writeText(code).then(() => {
      const orig = btn.innerHTML;
      btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20,6 9,17 4,12"/></svg> Copied!`;
      setTimeout(() => { btn.innerHTML = orig; }, 2000);
      UI.showToast?.('success', 'Copied!', `${currentTab.toUpperCase()} snippet copied.`);
    });
  };

  on(copyBtn,      'click', () => doCopy(copyBtn));
  on(modalCopyBtn, 'click', (e) => { e.stopPropagation(); doCopy(modalCopyBtn); });
})();
