/**
 * Main — initialization, theme toggle, copy-to-clipboard
 */
(() => {
  const { $, $$, on } = UI;
  const { appStore } = UI;

  // ── Theme Toggle ──
  const themeToggle = $('#theme-toggle');
  const html = document.documentElement;

  on(themeToggle, 'click', () => {
    const isDark = html.getAttribute('data-theme') === 'dark';
    const newTheme = isDark ? 'light' : 'dark';
    html.setAttribute('data-theme', newTheme);
    appStore.set({ theme: newTheme });
    UI.showToast?.('info', `${newTheme === 'dark' ? '🌙' : '☀️'} Theme`, `Switched to ${newTheme} mode`);
  });

  // ── Copy to clipboard (component code) ──
  const CODE_SNIPPETS = {
    'btn-primary': `<button class="btn btn--primary" data-ripple>
  Primary Action
</button>`,
    'btn-ghost': `<button class="btn btn--ghost" data-ripple>
  Ghost Button
</button>`,
    'btn-loading': `<button class="btn btn--primary" id="my-btn">
  <span class="btn__label">Submit</span>
  <span class="btn__spinner" aria-hidden="true"></span>
</button>

<script>
  const btn = document.getElementById('my-btn');
  btn.addEventListener('click', async () => {
    btn.classList.add('is-loading');
    btn.disabled = true;
    await doSomethingAsync();
    btn.classList.remove('is-loading');
    btn.disabled = false;
  });
<\/script>`,
    'btn-icon': `<button class="btn btn--icon btn--primary" aria-label="Add" data-ripple>
  <svg width="18" height="18" viewBox="0 0 24 24"
       fill="none" stroke="currentColor" stroke-width="2.5">
    <line x1="12" y1="5" x2="12" y2="19"/>
    <line x1="5"  y1="12" x2="19" y2="12"/>
  </svg>
</button>`,
    'btn-gradient': `<button class="btn btn--gradient" data-ripple>
  Gradient Glow
</button>`,
    'btn-group': `<div class="btn-group" role="group" aria-label="View options">
  <button class="btn-group__btn is-active">Day</button>
  <button class="btn-group__btn">Week</button>
  <button class="btn-group__btn">Month</button>
</div>`,
    'toggle-classic': `<label class="toggle toggle--classic">
  <input class="toggle__input" type="checkbox" role="switch" />
  <span class="toggle__track">
    <span class="toggle__thumb"></span>
  </span>
  <span class="toggle__label">Enabled</span>
</label>`,
    'toggle-icon': `<label class="toggle toggle--icon" aria-label="Theme toggle">
  <input class="toggle__input" type="checkbox" role="switch" />
  <span class="toggle__track">
    <span class="toggle__thumb">
      <!-- sun/moon icons -->
    </span>
  </span>
</label>`,
    'checkbox-custom': `<label class="checkbox">
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
    'radio-custom': `<label class="radio">
  <input class="radio__input" type="radio" name="group" />
  <span class="radio__dot"></span>
  <span class="radio__label">Option Alpha</span>
</label>`,
    'loader-ring': `<div class="loader loader--ring" role="status">
  <span class="sr-only">Loading…</span>
</div>`,
    'loader-dots': `<div class="loader loader--dots" role="status">
  <span class="loader__dot"></span>
  <span class="loader__dot"></span>
  <span class="loader__dot"></span>
  <span class="sr-only">Loading…</span>
</div>`,
    'loader-wave': `<div class="loader loader--wave" role="status">
  <span class="loader__bar"></span>
  <span class="loader__bar"></span>
  <span class="loader__bar"></span>
  <span class="loader__bar"></span>
  <span class="loader__bar"></span>
  <span class="sr-only">Loading…</span>
</div>`,
    'loader-pulse': `<div class="loader loader--pulse" role="status">
  <span class="sr-only">Loading…</span>
</div>`,
    'loader-progress': `<div class="progress-bar" role="progressbar"
     aria-valuenow="65" aria-valuemin="0" aria-valuemax="100">
  <div class="progress-bar__track">
    <div class="progress-bar__fill" style="width:65%">
      <span class="progress-bar__shimmer"></span>
    </div>
  </div>
  <span class="progress-bar__label">65%</span>
</div>`,
    'card-tilt': `<div class="card card--tilt" data-tilt>
  <div class="card__glow" aria-hidden="true"></div>
  <div class="card__body">
    <h4 class="card__title">Card Title</h4>
    <p class="card__text">Card description goes here.</p>
  </div>
</div>`,
    'card-glass': `<div class="card card--glass">
  <div class="card__body">
    <h4 class="card__title">Glass Card</h4>
    <p class="card__text">Frosted glass effect.</p>
  </div>
</div>`,
    'card-expand': `<div class="card card--expand" id="my-card">
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
    'card-stats': `<div class="card card--stats">
  <div class="card__body">
    <div class="card__header-row">
      <span class="card__label">Total Revenue</span>
      <span class="tag tag--success">+12.5%</span>
    </div>
    <div class="card__metric">$84,250</div>
  </div>
</div>`,
    'input-float': `<div class="field field--float">
  <input class="field__input" type="text"
         id="name" placeholder=" " />
  <label class="field__label" for="name">Full Name</label>
  <span class="field__bar"></span>
</div>`,
    'input-validate': `<div class="field field--float is-success">
  <input class="field__input" type="email"
         id="email" value="user@example.com" placeholder=" " />
  <label class="field__label" for="email">Email</label>
  <span class="field__bar"></span>
  <span class="field__icon field__icon--check">✓</span>
</div>`,
    'input-password': `<div class="field field--float field--password">
  <input class="field__input" type="password"
         id="password" placeholder=" " />
  <label class="field__label" for="password">Password</label>
  <span class="field__bar"></span>
  <button class="field__toggle-pass" type="button"
          aria-label="Toggle password visibility">
    <!-- eye icon -->
  </button>
</div>`,
    'input-search': `<div class="search-field">
  <span class="search-field__icon"><!-- search icon --></span>
  <input class="search-field__input" type="search"
         placeholder="Search…" />
  <button class="search-field__clear" type="button"
          aria-label="Clear" hidden>×</button>
</div>`,
    'input-range': `<div class="range-field">
  <div class="range-field__header">
    <label class="range-field__label"
           for="volume">Volume</label>
    <output class="range-field__value"
            id="volume-val">75</output>
  </div>
  <input class="range-field__input" type="range"
         id="volume" min="0" max="100" value="75" />
</div>`,
    'nav-tabs': `<div class="tabs" role="tablist">
  <button class="tabs__tab is-active"
          role="tab" aria-selected="true">Overview</button>
  <button class="tabs__tab"
          role="tab" aria-selected="false">Analytics</button>
  <button class="tabs__tab"
          role="tab" aria-selected="false">Settings</button>
  <span class="tabs__indicator" aria-hidden="true"></span>
</div>`,
    'nav-breadcrumb': `<nav aria-label="Breadcrumb">
  <ol class="breadcrumb">
    <li class="breadcrumb__item">
      <a class="breadcrumb__link" href="/">Home</a>
    </li>
    <li class="breadcrumb__item">
      <a class="breadcrumb__link" href="/components">Components</a>
    </li>
    <li class="breadcrumb__item breadcrumb__item--current"
        aria-current="page">Current</li>
  </ol>
</nav>`,
    'nav-pagination': `<nav class="pagination" aria-label="Pagination">
  <button class="pagination__btn pagination__btn--prev"
          aria-label="Previous">‹</button>
  <button class="pagination__page">1</button>
  <button class="pagination__page is-active"
          aria-current="page">2</button>
  <button class="pagination__page">3</button>
  <button class="pagination__btn pagination__btn--next"
          aria-label="Next">›</button>
</nav>`,
    'nav-dropdown': `<div class="dropdown">
  <button class="dropdown__trigger btn btn--ghost">
    Options ▾
  </button>
  <ul class="dropdown__menu" role="menu">
    <li class="dropdown__item" role="menuitem">Edit</li>
    <li class="dropdown__item" role="menuitem">Duplicate</li>
    <li class="dropdown__divider" role="separator"></li>
    <li class="dropdown__item dropdown__item--danger"
        role="menuitem">Delete</li>
  </ul>
</div>`,
    'toast': `// JavaScript
UI.showToast('success', 'Saved!', 'Changes saved successfully.');
UI.showToast('error',   'Error',  'Something went wrong.');
UI.showToast('info',    'Info',   'New features available.');`,
    'alert-banner': `<div class="alert alert--info" role="alert">
  <svg class="alert__icon"><!-- info icon --></svg>
  <span>Your changes have been saved automatically.</span>
  <button class="alert__close" aria-label="Dismiss">×</button>
</div>`,
    'badge': `<span class="badge badge--primary">Primary</span>
<span class="badge badge--success">Success</span>
<span class="badge badge--warning">Warning</span>
<span class="badge badge--danger">Error</span>
<span class="badge badge--dot badge--success">Live</span>`,
    'tooltip': `<span class="tooltip-wrap"
      data-tooltip="Tooltip text"
      data-tooltip-pos="top">
  <button class="btn btn--ghost btn--sm">Hover me</button>
</span>`,
  };

  // ── Copy button handler ──
  on(document, 'click', async (e) => {
    const copyBtn = e.target.closest('[data-copy]');
    if (!copyBtn) return;

    const id   = copyBtn.dataset.copy;
    const code = CODE_SNIPPETS[id];
    if (!code) return;

    try {
      await navigator.clipboard.writeText(code);
      copyBtn.classList.add('is-copied');
      const originalText = copyBtn.textContent;
      copyBtn.textContent = '✓ Copied!';
      setTimeout(() => {
        copyBtn.textContent = originalText;
        copyBtn.classList.remove('is-copied');
      }, 2000);

      UI.showToast?.('success', 'Copied!', 'Code snippet copied to clipboard.');
    } catch {
      UI.showToast?.('error', 'Copy Failed', 'Please copy the code manually.');
    }
  });

  // ── Intersection observer for counter animation in hero stats ──
  const heroStats = $$('.hero__stat strong');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.textContent, 10);
      if (!isNaN(target) && target > 0) {
        UI.animateCounter(el, 0, target, 800);
      }
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.5 });

  heroStats.forEach(stat => counterObserver.observe(stat));

  // ── Keyboard navigation: arrow keys between component cards ──
  let focusedCardIdx = -1;
  const getAllVisibleCards = () => $$('.component-card:not([data-hidden])');

  on(document, 'keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      const allCards = getAllVisibleCards();
      if (!allCards.length) return;
      focusedCardIdx = Math.min(focusedCardIdx + 1, allCards.length - 1);
      const card = allCards[focusedCardIdx];
      const viewBtn = card?.querySelector('.cc-btn--view');
      viewBtn?.focus();
      card?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });

  // ── Log info ──
  console.log(`%c UI Lab %c Microinteractions Playground `, 
    'background:#6366f1;color:white;padding:4px 8px;border-radius:4px 0 0 4px;font-weight:bold',
    'background:#1e1e30;color:#94a3b8;padding:4px 8px;border-radius:0 4px 4px 0'
  );
  console.log('32 components · 7 sections · 0 dependencies');
  console.log('Use UI.showToast(), UI.appStore.set(), UI.appStore.get()');
})();
