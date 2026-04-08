/* ================================================
   js/scroll-zoom.js  — feature/ui-base
   Apple-style scroll-driven zoom for hero section.
   Pins hero, scales content as user scrolls.
   ================================================ */

window.SCROLL_ZOOM = (() => {

  function init() {
    const section  = document.getElementById('heroSection');
    const zoomWrap = document.getElementById('heroZoom');
    if (!section || !zoomWrap) return;

    let ticking = false;

    function update() {
      const rect = section.getBoundingClientRect();
      const sectionH = section.offsetHeight;
      const viewH    = window.innerHeight;

      /* scrolled distance into the section (0 → sectionH - viewH) */
      const scrolled = -rect.top;
      const maxScroll = sectionH - viewH;
      const progress = Math.max(0, Math.min(1, scrolled / maxScroll));

      /* Scale: 1.0 → 1.18 as user scrolls through */
      const scale = 1 + progress * 0.18;

      /* Fade out text when zoomed past 70% */
      const contentOpacity = progress < 0.6 ? 1 : Math.max(0, 1 - (progress - 0.6) / 0.4);

      zoomWrap.style.transform = `scale(${scale})`;

      const content = zoomWrap.querySelector('.hero-content');
      if (content) content.style.opacity = contentOpacity;

      /* Hide scroll indicator after 10% scroll */
      const indicator = section.querySelector('.scroll-indicator');
      if (indicator) indicator.classList.toggle('hidden', progress > 0.08);

      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });

    update(); // initial
  }

  /* ---- Scroll-triggered product card reveal ---- */
  function initCardReveal() {
    const cards = document.querySelectorAll('.product-card, .cat-card, .promo-banner');
    if (!cards.length) return;

    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    cards.forEach((card, i) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(28px)';
      card.style.transition = `opacity 0.6s ${i * 0.06}s ease, transform 0.6s ${i * 0.06}s ease`;
      io.observe(card);
    });
  }

  return { init, initCardReveal };
})();
