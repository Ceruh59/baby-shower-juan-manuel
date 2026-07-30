/**
 * rsvp.js — Confirmación multi-asistente + confeti/globos al éxito.
 *
 * Cada nombre se guarda como documento independiente en Firestore
 * (reglas: { name, attending, createdAt }).
 * No se usa localStorage para forzar el inicio desde arriba en cada visita.
 */

import { saveRsvp } from '../firebase/db.js';
import { TEXTS } from '../data/content.js';

const MAX_GUESTS = 10;
const CELEBRATION_MS = 3200;

export function initRsvp() {
  const form = document.getElementById('rsvp-form');
  const successBlock = document.querySelector('.rsvp-success');
  const guestList = document.getElementById('guest-list');
  const addBtn = document.getElementById('btn-add-guest');
  if (!form || !successBlock || !guestList || !addBtn) return;

  const submitButton = form.querySelector('button[type="submit"]');
  const status = form.querySelector('.form-status');
  if (!submitButton || !status) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function guestInputs() {
    return [...guestList.querySelectorAll('input[name="guest"]')];
  }

  function updateRemoveButtons() {
    const rows = guestList.querySelectorAll('[data-guest]');
    rows.forEach((row) => {
      const btn = row.querySelector('.guest-remove');
      if (!btn) return;
      btn.hidden = rows.length <= 1;
    });
    addBtn.hidden = rows.length >= MAX_GUESTS;
  }

  function updateSubmitState() {
    const names = guestInputs().map((i) => i.value.trim()).filter(Boolean);
    const hasNames = names.length > 0 && guestInputs().every((i) => i.value.trim().length > 0);
    const hasChoice = form.elements.attending.value !== '';
    submitButton.disabled = !(hasNames && hasChoice);
  }

  function bindRow(row) {
    const input = row.querySelector('input[name="guest"]');
    const remove = row.querySelector('.guest-remove');
    if (input) {
      input.addEventListener('input', updateSubmitState);
    }
    if (remove) {
      remove.addEventListener('click', () => {
        if (guestList.querySelectorAll('[data-guest]').length <= 1) return;
        row.remove();
        updateRemoveButtons();
        updateSubmitState();
      });
    }
  }

  guestList.querySelectorAll('[data-guest]').forEach(bindRow);

  addBtn.addEventListener('click', () => {
    const count = guestList.querySelectorAll('[data-guest]').length;
    if (count >= MAX_GUESTS) return;

    const row = document.createElement('div');
    row.className = 'guest-row field';
    row.dataset.guest = '';
    row.innerHTML = `
      <label>
        Nombre del asistente
        <input name="guest" type="text" required minlength="1" maxlength="80"
               autocomplete="name" placeholder="Escribe el nombre">
      </label>
      <button type="button" class="guest-remove" aria-label="Quitar asistente">×</button>
    `;
    guestList.appendChild(row);
    bindRow(row);
    updateRemoveButtons();
    updateSubmitState();
    row.querySelector('input')?.focus();
  });

  form.addEventListener('change', updateSubmitState);
  updateRemoveButtons();
  updateSubmitState();

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (form.elements.website.value !== '') {
      showSuccess();
      return;
    }

    const names = guestInputs()
      .map((i) => i.value.trim().slice(0, 80))
      .filter((n) => n.length > 0);

    const choice = form.elements.attending.value;
    if (names.length === 0 || choice === '') return;

    submitButton.disabled = true;
    submitButton.textContent = TEXTS.rsvp.sendingButton;
    status.textContent = '';
    status.classList.remove('is-error');

    try {
      const attending = choice === 'yes';
      await Promise.all(names.map((name) => saveRsvp({ name, attending })));
      showSuccess();
      if (attending) celebrate();
    } catch (error) {
      console.error('[rsvp] Error al guardar:', error);
      status.textContent = TEXTS.rsvp.errorMessage;
      status.classList.add('is-error');
      submitButton.disabled = false;
      submitButton.textContent = TEXTS.rsvp.submitButton;
    }
  });

  function showSuccess() {
    form.hidden = true;
    successBlock.hidden = false;
    successBlock.classList.add('is-visible');
  }

  function celebrate() {
    if (prefersReduced) return;

    const canvas = document.createElement('canvas');
    canvas.setAttribute('aria-hidden', 'true');
    Object.assign(canvas.style, {
      position: 'fixed',
      inset: '0',
      pointerEvents: 'none',
      zIndex: '95',
    });
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      canvas.remove();
      return;
    }

    const dpr = window.devicePixelRatio || 1;
    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const W = () => window.innerWidth;
    const H = () => window.innerHeight;
    const colors = ['#7EB6D9', '#E8C98A', '#F0B7C4', '#9BC4E2', '#C4A574', '#FFFFFF', '#A8D4F0'];

    // Confeti + globos
    const confetti = Array.from({ length: 70 }, () => ({
      x: Math.random() * W(),
      y: -20 - Math.random() * H() * 0.4,
      w: 5 + Math.random() * 7,
      h: 8 + Math.random() * 10,
      vx: (Math.random() - 0.5) * 3,
      vy: 2 + Math.random() * 4,
      rot: Math.random() * Math.PI,
      spin: (Math.random() - 0.5) * 0.2,
      color: colors[Math.floor(Math.random() * colors.length)],
      kind: 'confetti',
    }));

    const balloons = Array.from({ length: 18 }, () => ({
      x: Math.random() * W(),
      y: H() + 30 + Math.random() * 120,
      r: 10 + Math.random() * 14,
      vx: (Math.random() - 0.5) * 0.8,
      vy: -(1.4 + Math.random() * 2.2),
      color: colors[Math.floor(Math.random() * colors.length)],
      kind: 'balloon',
    }));

    const particles = [...confetti, ...balloons];
    const start = performance.now();

    function frame(now) {
      const elapsed = now - start;
      if (elapsed >= CELEBRATION_MS) {
        canvas.remove();
        return;
      }

      const fade = elapsed > CELEBRATION_MS - 600
        ? (CELEBRATION_MS - elapsed) / 600
        : 1;

      ctx.clearRect(0, 0, W(), H());

      particles.forEach((p) => {
        if (p.kind === 'confetti') {
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.04;
          p.rot += p.spin;
          ctx.save();
          ctx.globalAlpha = fade;
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rot);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
          ctx.restore();
        } else {
          p.x += p.vx + Math.sin((now + p.x) * 0.002) * 0.4;
          p.y += p.vy;
          ctx.save();
          ctx.globalAlpha = fade * 0.9;
          // balloon body
          const grd = ctx.createRadialGradient(p.x - p.r * 0.3, p.y - p.r * 0.35, 2, p.x, p.y, p.r);
          grd.addColorStop(0, '#fff');
          grd.addColorStop(0.35, p.color);
          grd.addColorStop(1, p.color);
          ctx.fillStyle = grd;
          ctx.beginPath();
          ctx.ellipse(p.x, p.y, p.r * 0.85, p.r, 0, 0, Math.PI * 2);
          ctx.fill();
          // string
          ctx.strokeStyle = 'rgba(90,111,134,0.4)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y + p.r);
          ctx.lineTo(p.x, p.y + p.r + 22);
          ctx.stroke();
          ctx.restore();
        }
      });

      requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);
  }
}
