/* ================================================
   js/products.js  — feature/ui-base + feature/cart + feature/wishlist
   Product card rendering, featured grid, product
   page with filtering.
   ================================================ */

window.PRODUCTS = (() => {

  /* ---- Build a product card HTML ---- */
  function buildCard(product) {
    const isWishlisted = window.WISHLIST.has(product.id);
    const badge = product.badge
      ? `<span class="product-badge ${product.badge}">${product.badge === 'new' ? 'New' : 'Sale'}</span>` : '';
    const origPrice = product.originalPrice
      ? `<span class="product-price-original">${window.STORE.formatPrice(product.originalPrice)}</span>` : '';

    return `
      <div class="product-card" data-product-id="${product.id}">
        <div class="product-img-wrap">
          ${badge}
          <img src="${product.image}" alt="${product.name}" style="width:100%; height:100%; object-fit:cover; display:block;">
          <button class="card-wishlist-btn ${isWishlisted ? 'wishlisted' : ''}"
                  data-wishlist-btn="${product.id}"
                  title="${isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="${isWishlisted ? 'currentColor' : 'none'}"
                 stroke="currentColor" stroke-width="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </button>
        </div>
        <div class="product-info">
          <div class="product-category">${product.category}</div>
          <div class="product-name">${product.name}</div>
          <div class="product-desc">${product.desc}</div>
          <div class="product-price-row">
            <span class="product-price">${window.STORE.formatPrice(product.price)}</span>
            ${origPrice}
          </div>
        </div>
        <div class="product-actions">
          <button class="btn-primary" data-add-cart="${product.id}">Add to Cart</button>
        </div>
      </div>`;
  }

  /* ---- Render list of products into container ---- */
  function renderGrid(products, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = products.map(buildCard).join('');
    bindCardEvents(container);
    // trigger reveal animation after render
    setTimeout(() => window.SCROLL_ZOOM && window.SCROLL_ZOOM.initCardReveal(), 50);
  }

  /* ---- Bind cart + wishlist events on cards ---- */
  function bindCardEvents(root) {
    root = root || document;
    root.querySelectorAll('[data-add-cart]').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const id = Number(btn.dataset.addCart);
        window.CART.add(id);
        window.showToast('Added to cart 🛍️');
        // Animate button
        btn.textContent = '✓ Added';
        btn.style.background = '#30d158';
        btn.style.color = '#000';
        setTimeout(() => {
          btn.textContent = 'Add to Cart';
          btn.style.background = '';
          btn.style.color = '';
        }, 1400);
      });
    });

    root.querySelectorAll('[data-wishlist-btn]').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const id = Number(btn.dataset.wishlistBtn);
        const added = window.WISHLIST.toggle(id);
        if (added !== undefined) {
          btn.classList.toggle('wishlisted', added);
          const svg = btn.querySelector('svg');
          if (svg) svg.setAttribute('fill', added ? 'currentColor' : 'none');
        }
      });
    });
  }

  /* ---- Render featured grid on homepage ---- */
  function renderFeatured() {
    const featured = window.STORE.getFeatured();
    renderGrid(featured, 'featuredGrid');
  }

  /* ---- Products Page ---- */
  function initProductsPage() {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;

    // Get category from URL
    const params = new URLSearchParams(window.location.search);
    const initialCat = params.get('cat') || '';

    let activeCat = initialCat;
    let activeFilter = 'all';

    // Update header title
    const heading = document.getElementById('productsPageTitle');
    if (heading && initialCat) {
      heading.textContent = initialCat.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }

    function renderFiltered() {
      let products = activeCat ? window.STORE.getByCategory(activeCat) : window.STORE.products;
      if (activeFilter === 'new')  products = products.filter(p => p.badge === 'new');
      if (activeFilter === 'sale') products = products.filter(p => p.badge === 'sale');
      renderGrid(products, 'productsGrid');
    }

    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const cat = btn.dataset.cat || '';
        const filter = btn.dataset.filter || 'all';
        if (btn.dataset.cat !== undefined) activeCat = cat;
        if (btn.dataset.filter !== undefined) activeFilter = filter;
        renderFiltered();
      });
    });

    // Set active filter btn
    if (initialCat) {
      const matchBtn = document.querySelector(`[data-cat="${initialCat}"]`);
      if (matchBtn) {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        matchBtn.classList.add('active');
      }
    }

    renderFiltered();
  }

  /* ---- Add search overlay to navbar ---- */
  function injectSearchOverlay() {
    if (document.getElementById('searchOverlay')) return;
    const el = document.createElement('div');
    el.className = 'search-overlay';
    el.id = 'searchOverlay';
    el.innerHTML = `
      <div class="search-input-wrap">
        <input type="text" id="searchInput" placeholder="Search products…" autocomplete="off"/>
        <button class="search-close-btn" id="searchCloseBtn">✕</button>
      </div>
      <div class="search-results" id="searchResultsContainer"></div>
    `;
    document.body.appendChild(el);
  }

  function init() {
    injectSearchOverlay();
    renderFeatured();
    initProductsPage();
  }

  return { init, buildCard, renderGrid, bindCardEvents };
})();
