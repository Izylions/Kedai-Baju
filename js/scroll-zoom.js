/* ================================================
   js/scroll-zoom.js — Nike-style Hero Slideshow
   Handles: auto-advance, pause/play, prev/next,
   dots, counter, video playback, slide click-through
   ================================================ */

window.SCROLL_ZOOM = (() => {

  function init() {
    const slides    = document.querySelectorAll('.slide');
    const dots      = document.querySelectorAll('.dot');
    const prevBtn   = document.getElementById('slidePrev');
    const nextBtn   = document.getElementById('slideNext');
    const pauseBtn  = document.getElementById('slidePauseBtn');
    const pauseIcon = document.getElementById('pauseIcon');
    const playIcon  = document.getElementById('playIcon');
    const counter   = document.getElementById('slideCounter');

    if (!slides.length) return;

    let currentSlide = 0;
    let slideInterval = null;
    let isPaused = false;
    const INTERVAL_MS = 5500;

    /* ---- Navigate to slide ---- */
    function goToSlide(index) {
      slides[currentSlide].classList.remove('active');
      if (dots[currentSlide]) dots[currentSlide].classList.remove('active');

      // Pause video of previous slide
      const prevVideo = slides[currentSlide].querySelector('.slide-video');
      if (prevVideo) prevVideo.pause();

      currentSlide = ((index % slides.length) + slides.length) % slides.length;

      slides[currentSlide].classList.add('active');
      if (dots[currentSlide]) dots[currentSlide].classList.add('active');

      // Update counter
      if (counter) counter.textContent = `${currentSlide + 1} / ${slides.length}`;

      // Play video of new slide if present
      const nextVideo = slides[currentSlide].querySelector('.slide-video');
      if (nextVideo) {
        nextVideo.currentTime = 0;
        nextVideo.play().catch(() => {});
      }
    }

    /* ---- Click on a slide to navigate to its product page ---- */
    slides.forEach(slide => {
      slide.addEventListener('click', e => {
        // Don't navigate if a CTA button was clicked (they handle their own link)
        if (e.target.closest('.slide-ctas')) return;
        const link = slide.getAttribute('data-link');
        if (link) window.location.href = link;
      });
      slide.style.cursor = 'pointer';
    });

    /* ---- Auto-advance ---- */
    function start() {
      if (slideInterval) return;
      slideInterval = setInterval(() => goToSlide(currentSlide + 1), INTERVAL_MS);
    }
    function stop() {
      clearInterval(slideInterval);
      slideInterval = null;
    }
    function reset() { stop(); if (!isPaused) start(); }

    /* ---- Prev / Next ---- */
    if (prevBtn) prevBtn.addEventListener('click', e => {
      e.stopPropagation();
      goToSlide(currentSlide - 1);
      reset();
    });
    if (nextBtn) nextBtn.addEventListener('click', e => {
      e.stopPropagation();
      goToSlide(currentSlide + 1);
      reset();
    });

    /* ---- Dots ---- */
    dots.forEach(dot => {
      dot.addEventListener('click', e => {
        e.stopPropagation();
        goToSlide(parseInt(dot.getAttribute('data-index')));
        reset();
      });
    });

    /* ---- Pause / Play button ---- */
    if (pauseBtn) {
      pauseBtn.addEventListener('click', e => {
        e.stopPropagation();
        isPaused = !isPaused;
        if (isPaused) {
          stop();
          if (pauseIcon) pauseIcon.style.display = 'none';
          if (playIcon)  playIcon.style.display  = 'block';
          pauseBtn.setAttribute('aria-label', 'Play slideshow');
        } else {
          start();
          if (pauseIcon) pauseIcon.style.display = 'block';
          if (playIcon)  playIcon.style.display  = 'none';
          pauseBtn.setAttribute('aria-label', 'Pause slideshow');
        }
      });
    }

    /* ---- Keyboard navigation ---- */
    document.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft')  { goToSlide(currentSlide - 1); reset(); }
      if (e.key === 'ArrowRight') { goToSlide(currentSlide + 1); reset(); }
    });

    /* ---- Start ---- */
    start();
  }

  /* ---- Card reveal on scroll ---- */
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
