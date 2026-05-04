/* ================================================
   js/navbar.js — Navbar: scroll-aware, search, mobile
   ================================================ */

window.NAVBAR = (() => {
  function init() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    /* ---- Scroll → frosted glass ---- */
    const observer = new IntersectionObserver(
      ([entry]) => navbar.classList.toggle('scrolled', !entry.isIntersecting),
      { threshold: 0, rootMargin: '-60px 0px 0px 0px' }
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
    const searchBtn       = document.getElementById('searchBtn');
    const searchContainer = document.getElementById('inlineSearchContainer');
    const searchInput     = document.getElementById('inlineSearchInput');
    const searchResults   = document.getElementById('inlineSearchResults');

    if (!searchBtn || !searchContainer || !searchInput || !searchResults) return;

    function showRecommendations() {
      const inPages = window.location.pathname.includes('/pages/');
      const base = inPages ? 'products.html' : 'pages/products.html';
      const popular = ['T-Shirts', 'Denim Jeans', 'Summer Dresses', 'Jackets', 'Accessories'];
      const cats     = ['t-shirts', 'jeans', 'dresses', 'outerwear', 'accessories'];
      searchResults.innerHTML = `
        <div style="padding:14px 16px 8px;">
          <p style="font-size:11px;font-weight:700;color:var(--text-3);text-transform:uppercase;
                    letter-spacing:0.1em;margin-bottom:12px;">Popular Searches</p>
          <div style="display:flex;flex-wrap:wrap;gap:8px;">
            ${popular.map((name, i) => `
              <a href="${base}?cat=${cats[i]}" style="
                background:var(--bg-2);
                padding:6px 14px;
                border-radius:980px;
                font-size:13px;
                font-weight:500;
                color:var(--text-1);
                text-decoration:none;
                border:1px solid var(--border);
                transition:all 0.15s;
              " onmouseover="this.style.borderColor='var(--accent)';this.style.color='var(--accent)'"
                 onmouseout="this.style.borderColor='var(--border)';this.style.color='var(--text-1)'">
                ${name}
              </a>`).join('')}
          </div>
        </div>
      `;
    }

    function showResults(q) {
      if (!window.STORE) return;
      const results = window.STORE.search(q).slice(0, 6);
      searchResults.innerHTML = results.length
        ? results.map(p => `
            <div class="search-result-item" data-id="${p.id}" style="
              display:flex;gap:12px;align-items:center;
              padding:10px 12px;border-radius:8px;cursor:pointer;
              transition:background .15s;
            " onmouseover="this.style.background='rgba(0,0,0,0.04)'"
               onmouseout="this.style.background=''">
              <img src="${p.image || ''}" alt="${p.name}" style="
                width:40px;height:40px;object-fit:cover;
                border-radius:6px;border:1px solid var(--border);flex-shrink:0;">
              <div style="min-width:0;">
                <div style="font-size:14px;color:var(--text-1);font-weight:500;
                            white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
                  ${p.name}
                </div>
                <div style="font-size:12px;color:var(--text-3);">${window.STORE.formatPrice(p.price)}</div>
              </div>
            </div>`).join('')
        : `<p style="color:var(--text-3);text-align:center;padding:18px 0;font-size:13px;">
             No results for "${q}"
           </p>`;

      searchResults.querySelectorAll('[data-id]').forEach(el => {
        el.addEventListener('click', () => {
          closeSearch();
          window.CART && window.CART.add(Number(el.dataset.id));
          window.showToast && window.showToast('Added to cart 🛍️');
        });
      });
    }

    function openSearch() {
      searchContainer.classList.add('active');
      if (!searchInput.value.trim()) showRecommendations();
      setTimeout(() => searchInput.focus(), 60);
    }

    function closeSearch() {
      searchContainer.classList.remove('active');
      searchInput.value = '';
      searchResults.innerHTML = '';
    }

    searchBtn.addEventListener('click', e => {
      e.stopPropagation();
      searchContainer.classList.contains('active') ? closeSearch() : openSearch();
    });

    searchInput.addEventListener('focus', () => {
      if (!searchInput.value.trim()) showRecommendations();
    });

    searchInput.addEventListener('input', e => {
      const q = e.target.value.trim();
      q.length < 2 ? showRecommendations() : showResults(q);
    });

    document.addEventListener('click', e => {
      if (!searchContainer.contains(e.target)) closeSearch();
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeSearch();
    });
  }

  return { init };
})();
