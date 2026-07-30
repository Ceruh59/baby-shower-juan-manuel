/**
 * loader.js — Bienvenida + intro de nubes (hold + salida lenta) + audio.
 */

const WELCOME_FADE_MS = 650;
const CLOUD_HOLD_MS = 1800;
const CLOUD_EXIT_MS = 2800;

function unlockAudio() {
  const audio = document.getElementById('bg-music');
  if (!audio) return;
  audio.volume = 0.5;
  const playAttempt = audio.play();
  if (playAttempt) playAttempt.catch(() => {});
}

function playCloudIntro() {
  return new Promise((resolve) => {
    const intro = document.getElementById('cloud-intro');
    if (!intro) {
      resolve();
      return;
    }

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    intro.hidden = false;
    intro.setAttribute('aria-hidden', 'false');
    intro.classList.add('is-visible');

    if (prefersReduced) {
      intro.hidden = true;
      intro.classList.remove('is-visible');
      intro.setAttribute('aria-hidden', 'true');
      resolve();
      return;
    }

    // 1) Nubes cubren la pantalla un momento
    window.setTimeout(() => {
      void intro.offsetWidth;
      intro.classList.add('is-leaving');

      // 2) Luego se abren despacio
      window.setTimeout(() => {
        intro.classList.remove('is-visible', 'is-leaving');
        intro.hidden = true;
        intro.setAttribute('aria-hidden', 'true');
        resolve();
      }, CLOUD_EXIT_MS);
    }, CLOUD_HOLD_MS);
  });
}

export function initLoader() {
  const overlay = document.getElementById('welcome');
  const enterButton = document.getElementById('btn-enter');
  if (!overlay || !enterButton) return;

  document.body.classList.add('is-locked');
  enterButton.focus();

  enterButton.addEventListener(
    'click',
    async () => {
      unlockAudio();

      overlay.classList.add('is-leaving');
      await new Promise((r) => window.setTimeout(r, WELCOME_FADE_MS));
      overlay.remove();

      await playCloudIntro();

      document.body.classList.remove('is-locked');
      document.body.classList.add('is-entered');
      document.dispatchEvent(new CustomEvent('invitation:entered'));
    },
    { once: true }
  );
}
