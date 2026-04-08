/**
 * Toast notifications system
 */
(() => {
  const { $, el, on } = UI;

  const region = $('#toast-region');
  const DURATION = 4000;

  const ICONS = {
    success: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22,4 12,14.01 9,11.01"/></svg>`,
    error:   `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`,
    info:    `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
    warning: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
  };

  const MESSAGES = {
    success: { title: 'Success!', msg: 'Your changes have been saved successfully.' },
    error:   { title: 'Error!',   msg: 'Something went wrong. Please try again.' },
    info:    { title: 'Info',     msg: 'New features are available in this release.' },
    warning: { title: 'Warning',  msg: 'This action cannot be undone.' },
  };

  const showToast = (type = 'info', customTitle, customMsg) => {
    if (!region) return;

    const data = MESSAGES[type] || MESSAGES.info;
    const title = customTitle || data.title;
    const msg   = customMsg   || data.msg;

    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.setAttribute('role', 'alert');
    toast.innerHTML = `
      <div class="toast__icon">${ICONS[type] || ICONS.info}</div>
      <div class="toast__body">
        <div class="toast__title">${title}</div>
        <div class="toast__msg">${msg}</div>
      </div>
      <button class="toast__close" aria-label="Dismiss notification">×</button>
      <span class="toast__progress" style="animation-duration:${DURATION}ms"></span>
    `;

    region.appendChild(toast);

    // Limit to 5 toasts
    const toasts = region.querySelectorAll('.toast:not(.is-removing)');
    if (toasts.length > 5) {
      removeToast(toasts[0]);
    }

    const closeBtn = toast.querySelector('.toast__close');
    on(closeBtn, 'click', () => removeToast(toast));
    on(toast, 'click', () => removeToast(toast));

    // Auto remove
    const timer = setTimeout(() => removeToast(toast), DURATION);
    toast._timer = timer;
  };

  const removeToast = (toast) => {
    if (!toast || toast.classList.contains('is-removing')) return;
    clearTimeout(toast._timer);
    toast.classList.add('is-removing');
    toast.addEventListener('animationend', () => toast.remove(), { once: true });
  };

  // Bind demo buttons
  on(document.getElementById('show-toast-success'), 'click', () => showToast('success'));
  on(document.getElementById('show-toast-error'),   'click', () => showToast('error'));
  on(document.getElementById('show-toast-info'),    'click', () => showToast('info'));

  // Export for global use
  window.UI.showToast = showToast;
})();
