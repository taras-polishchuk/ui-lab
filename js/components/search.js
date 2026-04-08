/**
 * Search & filter component cards
 */
(() => {
  const { $, $$, on, debounce } = UI;

  const searchInput = $('#search-input');
  const cards = $$('.component-card[data-tags]');
  const grids  = $$('.component-grid');

  if (!searchInput) return;

  let noResultsEl = null;

  const getNoResults = () => {
    if (!noResultsEl) {
      noResultsEl = document.createElement('p');
      noResultsEl.id = 'search-no-results';
      noResultsEl.innerHTML = `<span style="font-size:2rem">🔍</span><br>No components found`;
      noResultsEl.hidden = true;
      const main = document.getElementById('main');
      if (main) main.appendChild(noResultsEl);
    }
    return noResultsEl;
  };

  const filterCards = debounce((query) => {
    const q = query.toLowerCase().trim();
    let visible = 0;

    cards.forEach(card => {
      const tags = (card.dataset.tags || '').toLowerCase();
      const name = (card.querySelector('.component-card__name')?.textContent || '').toLowerCase();
      const desc = (card.querySelector('.component-card__desc')?.textContent || '').toLowerCase();
      const matches = !q || tags.includes(q) || name.includes(q) || desc.includes(q);

      card.toggleAttribute('data-hidden', !matches);
      card.style.display = matches ? '' : 'none';
      if (matches) visible++;
    });

    // Show/hide sections with no visible cards
    $$('.section[data-section]').forEach(section => {
      const visibleCards = [...section.querySelectorAll('.component-card')].filter(c => !c.hasAttribute('data-hidden'));
      section.style.display = (q && visibleCards.length === 0) ? 'none' : '';
    });

    const noResults = getNoResults();
    noResults.hidden = visible > 0 || !q;

    // Update UI lab store
    UI.appStore?.set({ searchQuery: q });
  }, 150);

  on(searchInput, 'input', (e) => filterCards(e.target.value));

  // Restore search query from state
  const savedQuery = UI.appStore?.get('searchQuery');
  if (savedQuery) {
    searchInput.value = savedQuery;
    filterCards(savedQuery);
  }

  // Allow clearing with Escape key
  on(searchInput, 'keydown', (e) => {
    if (e.key === 'Escape') {
      searchInput.value = '';
      filterCards('');
      searchInput.blur();
    }
  });
})();
