(() => {
  const bar = document.getElementById('ag-sticky-cta');
  const hero = document.querySelector('[data-ag-home-hero]');
  const closing = document.querySelector('[data-ag-home-closing]');
  if (!bar || !hero || !closing) return;

  let frame = 0;
  let dismissed = false;
  const update = () => {
    frame = 0;
    const afterHero = hero.getBoundingClientRect().bottom <= 0;
    const beforeClosing = closing.getBoundingClientRect().top >= window.innerHeight;
    bar.hidden = dismissed || !afterHero || !beforeClosing;
  };
  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(update);
  };
  bar.querySelector('.ag-sticky-close').addEventListener('click', () => {
    dismissed = true;
    update();
  });
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  window.addEventListener('load', schedule);
  window.addEventListener('pageshow', schedule);
  if ('ResizeObserver' in window) {
    const observer = new ResizeObserver(schedule);
    observer.observe(document.body);
    observer.observe(hero);
  }
  update();
})();

(() => {
  const motion = window.matchMedia('(prefers-reduced-motion: no-preference)').matches;

  // Scroll reveal for the review sections.
  if (motion && 'IntersectionObserver' in window) {
    const targets = document.querySelectorAll('.ag-trust--compact .ag-trust__head, .ag-trust--compact .ag-message, .ag-trust--compact .ag-trust__project, .ag-stories__head, .ag-story, .ag-benefits--home .ag-benefits__head, .ag-home-benefits li, .ag-voices-rotator');
    document.documentElement.classList.add('ag-motion');
    const io = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-in');
      io.unobserve(entry.target);
    }), { rootMargin: '0px 0px -8% 0px' });
    targets.forEach((el, i) => {
      el.classList.add('ag-reveal');
      el.style.transitionDelay = `${(i % 3) * 90}ms`;
      io.observe(el);
    });
  }

  // Wheels: rotate the customer quotes every five seconds.
  document.querySelectorAll('[data-ag-rotator]').forEach((rotator) => {
    const track = rotator.querySelector('.ag-voices__grid');
    const items = track ? [...track.children] : [];
    if (items.length < 2) return;
    const step = () => items[1].offsetLeft - items[0].offsetLeft;
    const go = (dir) => {
      const max = track.scrollWidth - track.clientWidth - 2;
      if (dir > 0 && track.scrollLeft >= max) track.scrollTo({ left: 0 });
      else if (dir < 0 && track.scrollLeft <= 2) track.scrollTo({ left: track.scrollWidth });
      else track.scrollBy({ left: dir * step() });
    };
    rotator.querySelectorAll('[data-dir]').forEach((button) => {
      button.addEventListener('click', () => go(Number(button.dataset.dir)));
    });
    if (!motion) return;
    let paused = false;
    let visible = false;
    rotator.addEventListener('mouseenter', () => { paused = true; });
    rotator.addEventListener('mouseleave', () => { paused = false; });
    rotator.addEventListener('focusin', () => { paused = true; });
    rotator.addEventListener('focusout', () => { paused = false; });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }).observe(rotator);
    } else {
      visible = true;
    }
    setInterval(() => { if (visible && !paused && !document.hidden) go(1); }, 5000);
  });
})();

// Legends of the Open Road carousel: started here from the bundled Swiper (Swiper 8), with
// the live settings: 3 per view from 1200px, 2 below, 20px spacing, looping, 3s autoplay.
(() => {
  const start = () => {
    if (typeof window.Swiper !== 'function') return;
    const motion = window.matchMedia('(prefers-reduced-motion: no-preference)').matches;
    document.querySelectorAll('.ag-gallery-carousel .e-n-carousel').forEach((el) => {
      if (el.swiper) return;
      const widget = el.closest('.ag-gallery-carousel');
      new window.Swiper(el, {
        slidesPerView: 2,
        slidesPerGroup: 1,
        spaceBetween: 20,
        loop: true,
        speed: 500,
        grabCursor: true,
        autoplay: motion ? { delay: 3000, pauseOnMouseEnter: true, disableOnInteraction: true } : false,
        pagination: { el: widget.querySelector('.swiper-pagination'), clickable: true, type: 'bullets' },
        breakpoints: { 1200: { slidesPerView: 3 } },
        a11y: { enabled: true },
      });
    });
  };
  if (document.readyState === 'complete') start();
  else window.addEventListener('load', start);
})();
