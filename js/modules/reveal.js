/**
 * reveal.js (Fase 5.2) — Aparición gradual de elementos al hacer scroll.
 *
 * - Marca <html class="js"> para que animations.css active el estado oculto
 *   de .reveal SOLO cuando JS está disponible (sin JS todo se ve).
 * - IntersectionObserver agrega .is-visible una sola vez (once).
 * - Stagger de 150ms entre hermanos .reveal del mismo contenedor (máx 450ms).
 * - Si el usuario prefiere movimiento reducido o no hay IntersectionObserver,
 *   todo se muestra de inmediato.
 */

const STAGGER_MS = 150;
const STAGGER_MAX_MS = 450;

export function initReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (elements.length === 0) return;

  document.documentElement.classList.add('js');

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced || !('IntersectionObserver' in window)) {
    elements.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  // Stagger: retraso incremental entre .reveal hermanos
  const countPerParent = new Map();
  elements.forEach((el) => {
    const parent = el.parentElement;
    const index = countPerParent.get(parent) ?? 0;
    el.style.transitionDelay = `${Math.min(index * STAGGER_MS, STAGGER_MAX_MS)}ms`;
    countPerParent.set(parent, index + 1);
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target); // se anima una sola vez
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
  );

  elements.forEach((el) => observer.observe(el));
}
