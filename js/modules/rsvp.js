/**
 * rsvp.js (Fase 8.2) — Formulario de confirmación de asistencia.
 *
 * Flujo:
 * 1. El botón de envío solo se habilita con nombre + opción elegida.
 * 2. Honeypot invisible: si está lleno → es un bot → se finge éxito y no
 *    se envía nada (capa anti-spam; las demás están en PLAN.md §10).
 * 3. Al enviar: estado "Enviando…" → saveRsvp() en Firestore.
 * 4. Éxito: el form se reemplaza por el bloque de éxito (check que se
 *    dibuja vía animations.css) + celebración discreta de partículas
 *    (canvas ~1.6s, desactivada con prefers-reduced-motion).
 * 5. Error: mensaje suave y botón rehabilitado para reintentar.
 * 6. localStorage: quien ya confirmó ve el éxito directamente y no puede
 *    duplicar el envío.
 *
 * Textos: SIEMPRE desde content.js (TEXTS.rsvp).
 */

import { saveRsvp } from '../firebase/db.js';
import { TEXTS } from '../data/content.js';

const STORAGE_KEY = 'rsvp_sent';
const CELEBRATION_MS = 1600;
const PARTICLE_COUNT = 22;
const PARTICLE_COLORS = ['#7FA8C9', '#E8C87E', '#B98E63', '#D9BC96'];

/* localStorage a prueba de modo incógnito (puede lanzar excepción) */
const storage = {
  get() {
    try {
      return window.localStorage.getItem(STORAGE_KEY);
    } catch {
      return null;
    }
  },
  set() {
    try {
      window.localStorage.setItem(STORAGE_KEY, '1');
    } catch {
      /* sin persistencia: solo se duplicaría el form en la próxima visita */
    }
  },
};

export function initRsvp() {
  const form = document.getElementById('rsvp-form');
  const successBlock = document.querySelector('.rsvp-success');
  if (!form || !successBlock) return;

  const nameInput = document.getElementById('rsvp-name');
  const submitButton = form.querySelector('button[type="submit"]');
  const status = form.querySelector('.form-status');
  if (!nameInput || !submitButton || !status) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Quien ya confirmó ve el éxito directo (anti-duplicados) */
  if (storage.get() === '1') {
    showSuccess();
    return;
  }

  /* Habilitar envío solo con el formulario completo */
  function updateSubmitState() {
    const hasName = nameInput.value.trim().length > 0;
    const hasChoice = form.elements.attending.value !== '';
    submitButton.disabled = !(hasName && hasChoice);
  }
  form.addEventListener('input', updateSubmitState);
  form.addEventListener('change', updateSubmitState);
  updateSubmitState();

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    // Honeypot: los bots lo llenan; se les finge éxito sin enviar nada
    if (form.elements.website.value !== '') {
      showSuccess();
      return;
    }

    const name = nameInput.value.trim().slice(0, 80);
    const choice = form.elements.attending.value; // 'yes' | 'no'
    if (name === '' || choice === '') return;

    submitButton.disabled = true;
    submitButton.textContent = TEXTS.rsvp.sendingButton;
    status.textContent = '';
    status.classList.remove('is-error');

    try {
      await saveRsvp({ name, attending: choice === 'yes' });
      storage.set();
      showSuccess();
      celebrate();
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
    successBlock.classList.add('is-visible'); // el check se dibuja (animations.css)
    successBlock.scrollIntoView({
      behavior: prefersReduced ? 'auto' : 'smooth',
      block: 'center',
    });
  }

  /* Celebración discreta: ~22 partículas flotando hacia arriba 1.6s.
     Canvas 2D ligero; se elimina solo al terminar. */
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
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.scale(dpr, dpr);

    const originX = window.innerWidth / 2;
    const originY = window.innerHeight / 2;
    const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: originX + (Math.random() - 0.5) * 80,
      y: originY,
      vx: (Math.random() - 0.5) * 1.6,
      vy: -(1.2 + Math.random() * 2.2),
      size: 3 + Math.random() * 4,
      color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
      rotation: Math.random() * Math.PI,
      spin: (Math.random() - 0.5) * 0.1,
    }));

    const start = performance.now();

    function frame(now) {
      const elapsed = now - start;
      if (elapsed >= CELEBRATION_MS) {
        canvas.remove();
        return;
      }
      const fade = 1 - elapsed / CELEBRATION_MS;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.spin;
        ctx.save();
        ctx.globalAlpha = fade;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      });

      requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);
  }
}
