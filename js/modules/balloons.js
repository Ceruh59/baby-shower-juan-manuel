/**
 * balloons.js — Globos CSS que suben continuamente por toda la página.
 */

const COLORS = ['#7EB6D9', '#A8D4F0', '#E8C98A', '#F0B7C4', '#9BC4E2', '#D4E8F5'];
const COUNT = 12;

export function initBalloons() {
  const root = document.getElementById('balloons');
  if (!root) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  for (let i = 0; i < COUNT; i += 1) {
    const el = document.createElement('span');
    el.className = 'balloon';
    const left = 4 + Math.random() * 92;
    const size = 16 + Math.random() * 18;
    const dur = 9 + Math.random() * 8;
    const delay = -Math.random() * 16;
    const drift = (Math.random() - 0.5) * 80;
    const color = COLORS[i % COLORS.length];

    el.style.left = `${left}%`;
    el.style.width = `${size}px`;
    el.style.height = `${size * 1.25}px`;
    el.style.background = `radial-gradient(circle at 30% 28%, rgba(255,255,255,0.75), ${color})`;
    el.style.setProperty('--dur', `${dur}s`);
    el.style.setProperty('--delay', `${delay}s`);
    el.style.setProperty('--drift', `${drift.toFixed(0)}px`);
    root.appendChild(el);
  }
}
