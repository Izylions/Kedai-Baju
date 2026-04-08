/* ================================================
   js/wishlist.js  — feature/wishlist
   Per-user wishlist stored in localStorage.
   Auth-gated: prompts login if not signed in.
   Exposes window.WISHLIST API.
   ================================================ */

window.WISHLIST = (() => {
  function getKey() {
    const user = window.AUTH.current();
    return user ? `lumastore_wishlist_${user.id}` : null;
  }

  function getItems() {
    const key = getKey();
    if (!key) return [];
    try { return JSON.parse(localStorage.getItem(key)) || []; }
    catch { return []; }
  }

  function saveItems(items) {
    const key = getKey();
    if (!key) return;
    localStorage.setItem(key, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent('wishlist:change', { detail: items }));
  }

  function has(productId) {
    return getItems().includes(productId);
  }

  function toggle(productId) {
    if (!window.AUTH.isLoggedIn()) {
      window.showToast('Sign in to save to your wishlist ♡');
      window.openAuthModal && window.openAuthModal('login');
      return false;
    }
    const items = getItems();
    const idx = items.indexOf(productId);
    if (idx === -1) {
      items.push(productId);
      saveItems(items);
      window.showToast('Added to wishlist ♡');
      return true;
    } else {
      items.splice(idx, 1);
      saveItems(items);
      window.showToast('Removed from wishlist');
      return false;
    }
  }

  function clear() {
    const key = getKey();
    if (key) localStorage.removeItem(key);
    window.dispatchEvent(new CustomEvent('wishlist:change', { detail: [] }));
  }

  /* ---- Render Wishlist Modal ---- */
  function renderModal() {
    const container = document.getElementById('wishlistItems');
    if (!container) return;
    const items = getItems();
    container.innerHTML = '';

    if (items.length === 0) {
      container.innerHTML = `<div class="wishlist-empty"><p>Your wishlist is empty.<br>Heart items to save them here.</p></div>`;
      return;
    }

    items.forEach(id => {
      const p = window.STORE.getById(id);
      if (!p) return;
      const el = document.createElement('div');
      el.className = 'wishlist-item';
      el.innerHTML = `
        <div class="wishlist-item-img">${p.emoji}</div>
        <div>
          <div class="wishlist-item-name">${p.name}</div>
          <div class="wishlist-item-price">${window.STORE.formatPrice(p.price)}</div>
        </div>
        <div class="wishlist-item-actions">
          <button class="btn-secondary" style="font-size:12px;padding:7px 14px;" data-cart="${p.id}">Add to Cart</button>
          <button class="btn-secondary" style="font-size:12px;padding:7px 14px;color:#ff375f;" data-remove="${p.id}">Remove</button>
        </div>
      `;
      container.appendChild(el);
    });
  }

  /* ---- Open/Close Modal ---- */
  function openModal() {
    if (!window.AUTH.isLoggedIn()) {
      window.showToast('Sign in to view your wishlist');
      window.openAuthModal && window.openAuthModal('login');
      return;
    }
    renderModal();
    document.getElementById('wishlistModal').classList.add('active');
    document.getElementById('wishlistOverlay').classList.add('active');
  }

  function closeModal() {
    document.getElementById('wishlistModal').classList.remove('active');
    document.getElementById('wishlistOverlay').classList.remove('active');
  }

  /* ---- Init ---- */
  function init() {
    const wishlistNavBtn = document.getElementById('wishlistNavBtn');
    const closeWishlist  = document.getElementById('closeWishlist');
    const wishlistOverlay = document.getElementById('wishlistOverlay');
    const footerWishlistLink = document.getElementById('footerWishlistLink');

    wishlistNavBtn    && wishlistNavBtn.addEventListener('click', openModal);
    closeWishlist     && closeWishlist.addEventListener('click', closeModal);
    wishlistOverlay   && wishlistOverlay.addEventListener('click', closeModal);
    footerWishlistLink && footerWishlistLink.addEventListener('click', e => { e.preventDefault(); openModal(); });

    /* Delegated events in modal */
    const modal = document.getElementById('wishlistModal');
    modal && modal.addEventListener('click', e => {
      const cartId   = e.target.dataset.cart;
      const removeId = e.target.dataset.remove;
      if (cartId) {
        window.CART.add(Number(cartId));
        window.showToast('Added to cart 🛍️');
      }
      if (removeId) {
        toggle(Number(removeId));
        renderModal();
        syncAllWishlistBtns();
      }
    });

    /* Re-render when auth changes */
    window.addEventListener('auth:change', () => {
      syncAllWishlistBtns();
    });
    window.addEventListener('wishlist:change', () => {
      syncAllWishlistBtns();
    });
  }

  /* ---- Sync heart button states on page ---- */
  function syncAllWishlistBtns() {
    document.querySelectorAll('[data-wishlist-btn]').forEach(btn => {
      const id = Number(btn.dataset.wishlistBtn);
      btn.classList.toggle('wishlisted', has(id));
    });
  }

  return { init, toggle, has, getItems, openModal, closeModal, clear, syncAllWishlistBtns };
})();
