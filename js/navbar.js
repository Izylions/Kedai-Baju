/* ================================================
   js/navbar.js  — feature/navbar
   Scroll-aware navbar, mobile drawer, search overlay
   ================================================ */

window.NAVBAR = (() => {
  function init() {
    const navbar = document.getElementById('navbar');

    /* ---- Scroll → frosted glass ---- */
    const observer = new IntersectionObserver(
      ([entry]) => navbar.classList.toggle('scrolled', !entry.isIntersecting),
      { threshold: 0, rootMargin: '-52px 0px 0px 0px' }
    );
    const sentinel = document.createElement('div');
    sentinel.style.cssText = 'position:absolute;top:0;left:0;width:1px;height:1px;pointer-events:none;';
    document.body.prepend(sentinel);
    observer.observe(sentinel);

    /* ---- Mobile hamburger ---- */
    const hamburger = document.getElementById('navHamburger');
    const mobileNav = document.getElementById('mobileNav');
    if (hamburger && mobileNav) {
      hamburger.addEventListener('click', () => {
        const open = mobileNav.classList.toggle('open');
        hamburger.setAttribute('aria-expanded', open);
      });
    }

    /* ---- Inline Search ---- */
    const searchBtn     = document.getElementById('searchBtn');
    const searchContainer = document.getElementById('inlineSearchContainer');
    const searchInput   = document.getElementById('inlineSearchInput');
    const searchResults = document.getElementById('inlineSearchResults');

    if (searchBtn && searchContainer && searchInput) {
      searchBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        searchContainer.classList.toggle('active');
        if (searchContainer.classList.contains('active')) {
          setTimeout(() => searchInput.focus(), 50);
        } else {
          closeSearch();
        }
      });
      
      document.addEventListener('click', e => {
        if (!searchContainer.contains(e.target)) {
          closeSearch();
        }
      });
      
      document.addEventListener('keydown', e => {
        if (e.key === 'Escape') closeSearch();
      });

      searchInput.addEventListener('input', e => {
        const q = e.target.value.trim();
        if (!q || q.length < 2) { searchResults.innerHTML = ''; return; }
        const results = window.STORE.search(q).slice(0, 6);
        searchResults.innerHTML = results.length
          ? results.map(p => `
              <div class="search-result-item" data-id="${p.id}" style="
                display:flex;gap:12px;align-items:center;
                padding:10px;border-radius:8px;cursor:pointer;
                transition:background .15s;
              " onmouseover="this.style.background='rgba(0,0,0,0.04)'"
                 onmouseout="this.style.background=''">
                <img src="${p.image}" alt="${p.name}" style="width:36px;height:36px;object-fit:cover;border-radius:6px;border:1px solid var(--border)">
                <div>
                  <div style="font-size:14px;color:var(--text-1);font-weight:500">${p.name}</div>
                  <div style="font-size:12px;color:var(--text-3)">${window.STORE.formatPrice(p.price)}</div>
                </div>
              </div>`).join('')
          : `<p style="color:var(--text-3);text-align:center;padding:16px 0;font-size:13px;">No results for "${q}"</p>`;

        searchResults.querySelectorAll('[data-id]').forEach(el => {
          el.addEventListener('click', () => {
            closeSearch();
            window.CART.add(Number(el.dataset.id));
            window.showToast('Added to cart 🛍️');
          });
        });
      });
    }

    function closeSearch() {
      if (searchContainer) searchContainer.classList.remove('active');
      if (searchInput)   searchInput.value = '';
      if (searchResults) searchResults.innerHTML = '';
    }
  }

  return { init };
})();
