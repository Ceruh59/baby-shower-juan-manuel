/**
 * reveal.js — Aparición al scroll.
 */

const STAGGER_MS = 120;
const STAGGER_MAX_MS = 480;

export function initReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (elements.length === 0) return;

  document.documentElement.classList.add('js');

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced || !('IntersectionObserver' in window)) {
    elements.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const countPerParent = new Map();
  elements.forEach((el) => {
    if (el.closest('#hero')) {
      el.classList.add('is-visible');
      return;
    }

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
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
  );

  elements.forEach((el) => {
    if (!el.closest('#hero')) observer.observe(el);
  });
}
