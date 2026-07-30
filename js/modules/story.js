/**
 * story.js — Split del nombre, elefantes que vuelan con scroll, inicio siempre arriba.
 */

function forceStartAtTop() {
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  window.scrollTo(0, 0);
}

function splitHeroName() {
  const target = document.querySelector('[data-split]');
  if (!target || target.dataset.splitDone === '1') return;

  const text = target.textContent ?? '';
  target.textContent = '';
  target.setAttribute('aria-hidden', 'true');

  [...text].forEach((char, index) => {
    const span = document.createElement('span');
    span.className = char === ' ' ? 'char is-space' : 'char';
    span.textContent = char === ' ' ? '\u00A0' : char;
    span.style.setProperty('--i', String(index));
    target.appendChild(span);
  });

  target.dataset.splitDone = '1';
}

function initFlyingElephants() {
  const floaters = [...document.querySelectorAll('.floater[data-fly]')];
  if (floaters.length === 0) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  let ticking = false;

  const update = () => {
    const y = window.scrollY || window.pageYOffset || 0;
    floaters.forEach((el) => {
      const speed = Number.parseFloat(el.dataset.fly) || 1;
      // Suben al hacer scroll hacia abajo (vuelan con los globos)
      const offset = -y * speed * 0.35;
      const sway = Math.sin((y + speed * 200) * 0.004) * 10;
      el.style.transform = `translate3d(${sway.toFixed(1)}px, ${offset.toFixed(1)}px, 0)`;
    });
    ticking = false;
  };

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(update);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  update();
}

export function initStory() {
  document.documentElement.classList.add('js');
  forceStartAtTop();
  splitHeroName();
  initFlyingElephants();

  // Por si no hay overlay
  if (!document.getElementById('welcome')) {
    document.body.classList.add('is-entered');
  }
}
