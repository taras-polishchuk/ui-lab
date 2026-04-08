/**
 * Navigation — Sidebar, topbar, active section highlighting
 */
(() => {
  const { $, $$, on, toggleClass, debounce } = UI;

  // ── Sidebar scroll spy ──
  const sections = $$('.section[data-section]');
  const sidebarLinks = $$('.sidebar__link[data-section]');

  const highlightActive = () => {
    const scrollY = window.scrollY + 120;

    let current = sections[0];
    sections.forEach(sec => {
      if (sec.offsetTop <= scrollY) current = sec;
    });

    sidebarLinks.forEach(link => {
      const isActive = link.dataset.section === current?.dataset.section;
      link.classList.toggle('is-active', isActive);
    });
  };

  window.addEventListener('scroll', debounce(highlightActive, 50), { passive: true });

  // ── Sidebar smooth scroll links ──
  sidebarLinks.forEach(link => {
    on(link, 'click', (e) => {
      e.preventDefault();
      const target = $(link.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Close mobile sidebar
        const sidebar = $('#sidebar');
        const mobileToggle = $('#mobile-nav-toggle');
        if (sidebar?.classList.contains('is-open')) {
          sidebar.classList.remove('is-open');
          mobileToggle?.setAttribute('aria-expanded', 'false');
        }
      }
    });
  });

  // ── Mobile nav toggle ──
  const mobileToggle = $('#mobile-nav-toggle');
  const sidebar = $('#sidebar');

  on(mobileToggle, 'click', () => {
    const isOpen = sidebar.classList.toggle('is-open');
    mobileToggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Close sidebar on outside click
  on(document, 'click', (e) => {
    if (
      sidebar?.classList.contains('is-open') &&
      !sidebar.contains(e.target) &&
      !mobileToggle?.contains(e.target)
    ) {
      sidebar.classList.remove('is-open');
      mobileToggle?.setAttribute('aria-expanded', 'false');
    }
  });

  // ── Scroll-based section reveal ──
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -60px 0px' });

  sections.forEach(sec => revealObserver.observe(sec));

  // ── Tab bar indicator ──
  const initTabs = (tabsEl) => {
    const tabs = $$('.tabs__tab', tabsEl);
    const indicator = $('.tabs__indicator', tabsEl);
    if (!indicator) return;

    const updateIndicator = (activeTab) => {
      const tabRect = activeTab.getBoundingClientRect();
      const parentRect = tabsEl.getBoundingClientRect();
      indicator.style.left  = `${tabRect.left - parentRect.left}px`;
      indicator.style.width = `${tabRect.width}px`;
    };

    const activeTab = tabs.find(t => t.classList.contains('is-active')) || tabs[0];
    if (activeTab) updateIndicator(activeTab);

    tabs.forEach(tab => {
      on(tab, 'click', () => {
        tabs.forEach(t => {
          t.classList.remove('is-active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('is-active');
        tab.setAttribute('aria-selected', 'true');
        updateIndicator(tab);
      });
    });
  };

  $$('.tabs').forEach(initTabs);

  // ── Button group sliding pill ──
  const initBtnGroup = (groupEl) => {
    const btns = $$('.btn-group__btn', groupEl);
    const pill = document.createElement('span');
    pill.className = 'btn-group__pill';
    groupEl.appendChild(pill);

    const updatePill = (activeBtn) => {
      pill.style.left  = `${activeBtn.offsetLeft}px`;
      pill.style.width = `${activeBtn.offsetWidth}px`;
    };

    const activeBtn = btns.find(b => b.classList.contains('is-active')) || btns[0];
    if (activeBtn) requestAnimationFrame(() => updatePill(activeBtn));

    btns.forEach(btn => {
      on(btn, 'click', () => {
        btns.forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        updatePill(btn);
      });
    });
  };

  $$('.btn-group').forEach(initBtnGroup);

  // ── Pagination ──
  $$('.pagination').forEach(paginationEl => {
    const pages = $$('.pagination__page', paginationEl);
    pages.forEach(page => {
      on(page, 'click', () => {
        pages.forEach(p => {
          p.classList.remove('is-active');
          p.removeAttribute('aria-current');
        });
        page.classList.add('is-active');
        page.setAttribute('aria-current', 'page');
      });
    });
  });

  // ── Dropdown toggle ──
  $$('.dropdown__trigger').forEach(trigger => {
    on(trigger, 'click', (e) => {
      e.stopPropagation();
      const dropdown = trigger.closest('.dropdown');
      const wasOpen = dropdown.classList.contains('is-open');
      $$('.dropdown.is-open').forEach(d => d.classList.remove('is-open'));
      if (!wasOpen) dropdown.classList.add('is-open');
    });
  });

  on(document, 'click', () => {
    $$('.dropdown.is-open').forEach(d => d.classList.remove('is-open'));
  });

  // ── Alert close ──
  UI.delegate(document, '.alert__close', 'click', (e, btn) => {
    const alert = btn.closest('.alert');
    if (!alert) return;
    alert.classList.add('is-dismissed');
    alert.addEventListener('animationend', () => alert.remove(), { once: true });
  });

  // ── Keyboard: Escape closes modals/panels ──
  on(document, 'keydown', (e) => {
    if (e.key === 'Escape') {
      // Close sidebar on mobile
      if (sidebar?.classList.contains('is-open')) {
        sidebar.classList.remove('is-open');
        mobileToggle?.setAttribute('aria-expanded', 'false');
      }
    }
  });

  // ── Cmd+K focuses search ──
  on(document, 'keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      const searchInput = $('#search-input');
      if (searchInput) searchInput.focus();
    }
  });

  // Initial highlight
  highlightActive();
})();
