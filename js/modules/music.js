/**
 * music.js (Fase 7) — Botón flotante de música (play/pause).
 *
 * Modelo de reproducción (PLAN.md §Música / §14):
 * - NUNCA hay autoplay directo. loader.js (Fase 5) ya intentó iniciar el
 *   audio con el tap de "Ver invitación" (gesto válido del usuario).
 * - Este módulo SINCRONIZA el botón con el estado real del <audio> (por si
 *   el loader logró iniciarla) y permite alternar play/pause.
 * - El estado visual lo controla `aria-pressed` (components.css/animations.css
 *   cambian el ícono por las ondas animadas).
 * - Si el archivo de audio no existe o falla, el botón se OCULTA solo:
 *   nunca queda un botón roto visible.
 */

const VOLUME = 0.5;

export function initMusic() {
  const audio = document.getElementById('bg-music');
  const button = document.getElementById('music-btn');
  if (!audio || !button) return;

  audio.volume = VOLUME;

  /** Refleja en el botón el estado real del audio. */
  function syncButton() {
    const isPlaying = !audio.paused && !audio.ended;
    button.setAttribute('aria-pressed', String(isPlaying));
    button.setAttribute(
      'aria-label',
      isPlaying ? 'Pausar música' : 'Reproducir música'
    );
  }

  async function toggle() {
    if (audio.paused) {
      try {
        await audio.play();
      } catch {
        // Sin gesto válido o archivo no disponible; syncButton() mantiene
        // el estado real (no se finge que suena).
      }
    } else {
      audio.pause();
    }
  }

  button.addEventListener('click', toggle);

  // Sincronización por eventos del audio (fuente de verdad)
  audio.addEventListener('play', syncButton);
  audio.addEventListener('pause', syncButton);
  audio.addEventListener('ended', syncButton);

  // Si el archivo falta o no se puede cargar → ocultar el botón
  audio.addEventListener('error', () => {
    button.hidden = true;
  });

  // El loader intentó iniciar la música al entrar: sincronizar entonces
  document.addEventListener('invitation:entered', syncButton);

  syncButton();
}
