/* ================================================
   js/scroll-zoom.js  — feature/ui-base (Now Slideshow)
   Handles the hero slideshow functionality
   ================================================ */

window.SCROLL_ZOOM = (() => {

  function init() {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.getElementById('slidePrev');
    const nextBtn = document.getElementById('slideNext');
    
    if (!slides.length) return;

    let currentSlide = 0;
    let slideInterval;

    function goToSlide(index) {
      slides[currentSlide].classList.remove('active');
      dots[currentSlide].classList.remove('active');
      
      currentSlide = (index + slides.length) % slides.length;
      
      slides[currentSlide].classList.add('active');
      dots[currentSlide].classList.add('active');
    }

    function nextSlide() {
      goToSlide(currentSlide + 1);
    }

    function prevSlide() {
      goToSlide(currentSlide - 1);
    }

    function startSlideshow() {
      slideInterval = setInterval(nextSlide, 5000);
    }

    function resetSlideshow() {
      clearInterval(slideInterval);
      startSlideshow();
    }

    if (prevBtn && nextBtn) {
      prevBtn.addEventListener('click', () => {
        prevSlide();
        resetSlideshow();
      });
      
      nextBtn.addEventListener('click', () => {
        nextSlide();
        resetSlideshow();
      });
    }

    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        goToSlide(parseInt(dot.getAttribute('data-index')));
        resetSlideshow();
      });
    });

    startSlideshow();
  }

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
