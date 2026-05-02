/* ================================================
   js/cart.js  — feature/cart
   Cart state (localStorage), sidebar UI, badge.
   Exposes window.CART API.
   ================================================ */

window.CART = (() => {
  const KEY = 'lumastore_cart';

  /* ---- State ---- */
  function getItems() {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; }
    catch { return []; }
  }
  function saveItems(items) {
    localStorage.setItem(KEY, JSON.stringify(items));
    updateBadge(items);
    window.dispatchEvent(new CustomEvent('cart:change', { detail: items }));
  }

  /* ---- Operations ---- */
  function add(productId, qty = 1) {
    const product = window.STORE.getById(productId);
    if (!product) return;
    const items = getItems();
    const existing = items.find(i => i.id === productId);
    if (existing) {
      existing.qty += qty;
    } else {
      items.push({ id: productId, qty });
    }
    saveItems(items);
  }

  function remove(productId) {
    saveItems(getItems().filter(i => i.id !== productId));
  }

  function setQty(productId, qty) {
    const items = getItems();
    const item = items.find(i => i.id === productId);
    if (!item) return;
    if (qty <= 0) { remove(productId); return; }
    item.qty = qty;
    saveItems(items);
  }

  function clear() { saveItems([]); }

  function total() {
    return getItems().reduce((sum, item) => {
      const p = window.STORE.getById(item.id);
      return sum + (p ? p.price * item.qty : 0);
    }, 0);
  }

  function count() {
    return getItems().reduce((sum, i) => sum + i.qty, 0);
  }

  /* ---- Badge ---- */
  function updateBadge(items) {
    const badge = document.getElementById('cartBadge');
    if (!badge) return;
    const n = (items || getItems()).reduce((s, i) => s + i.qty, 0);
    badge.textContent = n;
    badge.classList.toggle('has-items', n > 0);
  }

  /* ---- Render Sidebar ---- */
  function render() {
    const container = document.getElementById('cartItems');
    const totalEl   = document.getElementById('cartTotal');
    if (!container) return;

    const items = getItems();
    container.innerHTML = '';

    if (items.length === 0) {
      container.innerHTML = `
        <div class="cart-empty">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 0 1-8 0"/>
          </svg>
          <p>Your cart is empty</p>
        </div>`;
      if (totalEl) totalEl.textContent = 'RM 0';
      return;
    }

    items.forEach(item => {
      const p = window.STORE.getById(item.id);
      if (!p) return;
      const el = document.createElement('div');
      el.className = 'cart-item';
      el.innerHTML = `
        <div class="cart-item-img">${p.emoji}</div>
        <div class="cart-item-info">
          <div class="cart-item-name">${p.name}</div>
          <div class="cart-item-price">${window.STORE.formatPrice(p.price)}</div>
          <div class="cart-item-qty">
            <button class="qty-btn" data-action="dec" data-id="${p.id}">−</button>
            <span class="qty-value">${item.qty}</span>
            <button class="qty-btn" data-action="inc" data-id="${p.id}">+</button>
          </div>
        </div>
        <button class="cart-item-remove" data-remove="${p.id}" title="Remove">✕</button>
      `;
      container.appendChild(el);
    });

    if (totalEl) totalEl.textContent = window.STORE.formatPrice(total());
  }

  /* ---- Sidebar open/close ---- */
  function open()  {
    document.getElementById('cartSidebar').classList.add('open');
    document.getElementById('cartOverlay').classList.add('active');
    render();
  }
  function close() {
    document.getElementById('cartSidebar').classList.remove('open');
    document.getElementById('cartOverlay').classList.remove('active');
  }

  /* ---- Init ---- */
  function init() {
    updateBadge();

    const cartBtn    = document.getElementById('cartBtn');
    const closeBtn   = document.getElementById('closeCart');
    const overlay    = document.getElementById('cartOverlay');
    const checkoutBtn = document.getElementById('checkoutBtn');

    cartBtn    && cartBtn.addEventListener('click', open);
    closeBtn   && closeBtn.addEventListener('click', close);
    overlay    && overlay.addEventListener('click', close);

    checkoutBtn && checkoutBtn.addEventListener('click', () => {
      if (count() === 0) { window.showToast('Your cart is empty!'); return; }
      window.showToast('Proceeding to checkout… (demo)');
    });

    /* Delegated events inside sidebar */
    const sidebar = document.getElementById('cartSidebar');
    sidebar && sidebar.addEventListener('click', e => {
      const removeId = e.target.dataset.remove;
      const action   = e.target.dataset.action;
      const id       = e.target.dataset.id;

      if (removeId) { remove(Number(removeId)); render(); return; }
      if (action === 'inc') { setQty(Number(id), getItems().find(i => i.id === Number(id))?.qty + 1); render(); }
      if (action === 'dec') { setQty(Number(id), (getItems().find(i => i.id === Number(id))?.qty || 1) - 1); render(); }
    });

    window.addEventListener('cart:change', () => render());
  }

  return { init, add, remove, setQty, clear, total, count, open, close, getItems };
})();
