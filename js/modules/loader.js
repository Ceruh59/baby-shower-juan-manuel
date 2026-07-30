/**
 * loader.js (Fase 5.3) — Overlay de bienvenida + desbloqueo de audio.
 *
 * Flujo:
 * 1. Mientras el overlay está visible, el scroll queda bloqueado
 *    (body.is-locked).
 * 2. El tap en "Ver invitación" es un GESTO DEL USUARIO → es el momento
 *    legítimo para intentar reproducir la música (los navegadores bloquean
 *    el autoplay sin gesto). Si falla, no pasa nada: el botón flotante
 *    (Fase 7) permite iniciarla después.
 * 3. El overlay hace fade out (.is-leaving) y se retira del DOM.
 * 4. Se emite 'invitation:entered' para que music.js (Fase 7) sincronice
 *    el estado de su botón.
 */

const EXIT_ANIMATION_MS = 850; // 0.8s de transición + margen

export function initLoader() {
  const overlay = document.getElementById('welcome');
  const enterButton = document.getElementById('btn-enter');
  if (!overlay || !enterButton) return;

  document.body.classList.add('is-locked');

  // Accesibilidad: el overlay es role="dialog"; el foco inicia en su botón
  // para que la navegación por teclado no quede tras el overlay.
  enterButton.focus();

  enterButton.addEventListener(
    'click',
    () => {
      overlay.classList.add('is-leaving');
      document.body.classList.remove('is-locked');

      // Desbloqueo de audio con el gesto del usuario
      const audio = document.getElementById('bg-music');
      if (audio) {
        audio.volume = 0.5;
        const playAttempt = audio.play();
        if (playAttempt) playAttempt.catch(() => { /* el botón de música queda disponible */ });
      }

      document.dispatchEvent(new CustomEvent('invitation:entered'));

      window.setTimeout(() => overlay.remove(), EXIT_ANIMATION_MS);
    },
    { once: true }
  );
}
