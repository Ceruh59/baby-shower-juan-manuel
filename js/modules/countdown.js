/**
 * countdown.js (Fase 6) — Cuenta regresiva al Baby Shower.
 *
 * - La fecha objetivo viene de content.js (EVENT.dateISO) como timestamp
 *   ABSOLUTO con offset -05:00 → es correcta sin importar la zona horaria
 *   del dispositivo del invitado.
 * - Cada dígito hace un micro-pulso (.tick) SOLO cuando su valor cambia
 *   (la animación la define animations.css; con prefers-reduced-motion
 *   el pulso no se ve, solo cambia el número).
 * - Al llegar a cero: el countdown se oculta y aparece el mensaje
 *   "¡Hoy es el gran día!".
 * - El cálculo usa Date.now() en cada tick (no acumula deriva aunque el
 *   navegador pause los intervalos en segundo plano).
 */

import { EVENT } from '../data/content.js';

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

export function initCountdown() {
  const root = document.querySelector('[data-countdown]');
  if (!root) return;

  const targetTime = new Date(EVENT.dateISO).getTime();
  if (Number.isNaN(targetTime)) {
    console.error('[countdown] EVENT.dateISO inválido:', EVENT.dateISO);
    return;
  }

  const parts = {
    days: root.querySelector('[data-days]'),
    hours: root.querySelector('[data-hours]'),
    minutes: root.querySelector('[data-minutes]'),
    seconds: root.querySelector('[data-seconds]'),
  };
  if (Object.values(parts).some((el) => !el)) return;

  const doneMessage = document.querySelector('[data-countdown-done]');

  /** Escribe el valor (2 dígitos) y dispara el pulso solo si cambió. */
  function setValue(el, value) {
    const text = String(value).padStart(2, '0');
    if (el.textContent === text) return;
    el.textContent = text;
    el.classList.remove('tick');
    void el.offsetWidth; // reinicia la animación CSS
    el.classList.add('tick');
  }

  function update() {
    const diff = targetTime - Date.now();

    if (diff <= 0) {
      window.clearInterval(timer);
      root.hidden = true;
      if (doneMessage) doneMessage.hidden = false;
      return;
    }

    setValue(parts.days, Math.floor(diff / DAY));
    setValue(parts.hours, Math.floor((diff % DAY) / HOUR));
    setValue(parts.minutes, Math.floor((diff % HOUR) / MINUTE));
    setValue(parts.seconds, Math.floor((diff % MINUTE) / SECOND));
  }

  update();
  const timer = window.setInterval(update, SECOND);
}
