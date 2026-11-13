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
