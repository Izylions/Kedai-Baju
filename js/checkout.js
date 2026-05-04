/* ================================================
   js/checkout.js — Checkout page logic
   Renders cart items, totals, handles form submit
   ================================================ */

document.addEventListener('DOMContentLoaded', () => {
  // Navbar scroll effect
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 10);
    });
  }

  const itemsContainer = document.getElementById('checkoutItems');
  const subtotalEl     = document.getElementById('checkoutSubtotal');
  const totalEl        = document.getElementById('checkoutTotal');
  const sstRow         = document.getElementById('sst-row');
  const sstAmountEl    = document.getElementById('sstAmount');
  const form           = document.getElementById('checkoutForm');
  const submitBtn      = document.getElementById('checkoutSubmitBtn');
  const successEl      = document.getElementById('checkoutSuccess');
  const containerEl    = document.getElementById('checkoutContainer');

  const SHIPPING_FEE = 10;

  function renderCheckout() {
    const items = window.CART.getItems();

    if (!items.length) {
      itemsContainer.innerHTML = `
        <div style="text-align:center;padding:24px 0;">
          <p style="color:var(--text-3);font-size:14px;margin-bottom:16px;">Your cart is empty.</p>
          <a href="../index.html" style="color:var(--accent);font-size:14px;font-weight:500;">← Back to Store</a>
        </div>`;
      subtotalEl.textContent = 'RM 0';
      totalEl.textContent = window.STORE.formatPrice(SHIPPING_FEE);
      return;
    }

    itemsContainer.innerHTML = items.map(item => {
      const p = window.STORE.getById(item.id);
      if (!p) return '';
      return `
        <div class="checkout-item">
          <img class="checkout-item-img" src="${p.image}" alt="${p.name}">
          <div class="checkout-item-info">
            <div class="checkout-item-name">${p.name}</div>
            <div class="checkout-item-qty">Qty: ${item.qty} · ${p.category}</div>
          </div>
          <div class="checkout-item-price">${window.STORE.formatPrice(p.price * item.qty)}</div>
        </div>`;
    }).join('');

    const subtotal = window.CART.total();
    subtotalEl.textContent   = window.STORE.formatPrice(subtotal);
    totalEl.textContent      = window.STORE.formatPrice(subtotal + SHIPPING_FEE);
  }

  renderCheckout();

  /* ---- Form submit ---- */
  form && form.addEventListener('submit', e => {
    e.preventDefault();

    if (window.CART.getItems().length === 0) {
      alert('Your cart is empty! Add some items before checking out.');
      return;
    }

    // Basic validation
    const required = ['firstName', 'lastName', 'email', 'address', 'city', 'postcode'];
    let valid = true;
    required.forEach(id => {
      const el = document.getElementById(id);
      if (!el || !el.value.trim()) {
        el && (el.style.borderColor = '#ff375f');
        valid = false;
      } else {
        el.style.borderColor = '';
      }
    });
    if (!valid) {
      alert('Please fill in all required fields.');
      return;
    }

    submitBtn.textContent = 'Processing…';
    submitBtn.disabled = true;

    setTimeout(() => {
      window.CART.clear();

      // Hide form, show success
      if (containerEl) containerEl.style.display = 'none';
      if (successEl)   successEl.classList.add('show');

      // Update step indicator
      const stepConfirm = document.getElementById('stepConfirm');
      if (stepConfirm) stepConfirm.classList.add('active');

      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1600);
  });
});
