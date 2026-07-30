/**
 * story.js — Coreografía del cuento: split del nombre + parallax suave.
 *
 * - Parte "Juan Manuel" en letras para la entrada cinematic post-welcome.
 * - Parallax de capas [data-depth] en el hero (solo transform).
 * - Activa body.is-entered al evento invitation:entered (o ya si no hay overlay).
 */

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

function initParallax() {
  const root = document.querySelector('[data-parallax]');
  if (!root) return;

  const layers = [...root.querySelectorAll('[data-depth]')];
  if (layers.length === 0) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  let ticking = false;

  const update = () => {
    const hero = document.getElementById('hero');
    if (!hero) return;

    const rect = hero.getBoundingClientRect();
    const viewH = window.innerHeight || 1;
    // Progreso del hero en viewport: 0 centro → ± al salir
    const progress = (viewH * 0.5 - (rect.top + rect.height * 0.5)) / viewH;

    layers.forEach((layer) => {
      const depth = Number.parseFloat(layer.dataset.depth) || 0;
      const y = progress * depth * 140;
      // Conservar translate centrado de anillos vía CSS; solo sumamos Y
      const isRing = layer.classList.contains('hero__ring');
      if (isRing) {
        layer.style.translate = `0 ${y.toFixed(1)}px`;
      } else if (layer.classList.contains('hero__moon')) {
        layer.style.translate = `0 ${y.toFixed(1)}px`;
      } else {
        layer.style.translate = `0 ${y.toFixed(1)}px`;
      }
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

function markEntered() {
  document.body.classList.add('is-entered');
}

export function initStory() {
  document.documentElement.classList.add('js');
  splitHeroName();
  initParallax();

  // Si el overlay ya no existe (p. ej. noscript edge), entrar igual
  if (!document.getElementById('welcome')) {
    markEntered();
    return;
  }

  document.addEventListener('invitation:entered', markEntered, { once: true });
}
