/* ================================================
   js/app.js  — main (merge target)
   Orchestrates all feature modules.
   Boot order: data → auth → cart → wishlist →
               navbar → scroll-zoom → products
   ================================================ */

/* ---- Global Toast Utility ---- */
let _toastTimer;
window.showToast = function(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  clearTimeout(_toastTimer);
  toast.textContent = msg;
  toast.classList.add('show');
  _toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
};

/* ---- Boot ---- */
document.addEventListener('DOMContentLoaded', () => {
  try { window.AUTH.init();        } catch(e) { console.error('AUTH init:', e); }
  try { window.CART.init();        } catch(e) { console.error('CART init:', e); }
  try { window.WISHLIST.init();    } catch(e) { console.error('WISHLIST init:', e); }
  try { window.NAVBAR.init();      } catch(e) { console.error('NAVBAR init:', e); }
  try { window.SCROLL_ZOOM.init(); } catch(e) { console.error('SCROLL_ZOOM init:', e); }
  try { window.PRODUCTS.init();    } catch(e) { console.error('PRODUCTS init:', e); }

  /* Add scroll indicator to hero if it doesn't exist */
  const heroSticky = document.querySelector('.hero-sticky');
  if (heroSticky && !heroSticky.querySelector('.scroll-indicator')) {
    heroSticky.insertAdjacentHTML('beforeend', `
      <div class="scroll-indicator">
        <span>Scroll</span>
        <div class="scroll-line"></div>
      </div>
    `);
  }

  console.log('%cIzylions Store booted ✓', 'color:#30d158;font-weight:bold;font-size:14px');
});
