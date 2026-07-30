/**
 * story.js — Elefantes anclados a secciones que vuelan al scroll.
 */

function forceStartAtTop() {
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  window.scrollTo(0, 0);
}

/**
 * Cada elefante aparece solo cuando su sección ancla ya se leyó,
 * y desde ahí sube (o baja al volver) con el scroll.
 */
function initFlyingElephants() {
  const floaters = [...document.querySelectorAll('[data-floater][data-anchor]')];
  if (floaters.length === 0) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const items = floaters.map((el) => {
    const anchor = document.getElementById(el.dataset.anchor);
    return {
      el,
      anchor,
      fly: Number.parseFloat(el.dataset.fly) || 0.5,
    };
  }).filter((item) => item.anchor);

  if (items.length === 0) return;

  let ticking = false;

  const update = () => {
    const viewH = window.innerHeight || 1;

    items.forEach(({ el, anchor, fly }) => {
      const rect = anchor.getBoundingClientRect();
      const releaseY = rect.bottom - viewH * 0.55;
      const travel = -releaseY;

      if (travel <= 0) {
        el.classList.remove('is-flying');
        el.style.opacity = '0';
        el.style.transform = 'translate3d(0, 48px, 0)';
        return;
      }

      el.classList.add('is-flying');
      const rise = travel * fly;
      const sway = Math.sin(travel * 0.012) * 8;
      const y = Math.min(rise, viewH * 1.6);

      if (prefersReduced) {
        el.style.opacity = '1';
        el.style.transform = 'translate3d(0, 0, 0)';
        return;
      }

      el.style.opacity = '1';
      el.style.transform = `translate3d(${sway.toFixed(1)}px, ${(-y).toFixed(1)}px, 0)`;
    });

    ticking = false;
  };

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(update);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  update();
}

export function initStory() {
  document.documentElement.classList.add('js');
  forceStartAtTop();
  initFlyingElephants();

  if (!document.getElementById('welcome')) {
    document.body.classList.add('is-entered');
  }
}
