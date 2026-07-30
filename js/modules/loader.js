/**
 * loader.js — Bienvenida + intro de nubes (tipo Simpson) + audio.
 */

const WELCOME_FADE_MS = 700;
const CLOUD_INTRO_MS = 2400;

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

    if (prefersReduced) {
      intro.hidden = true;
      intro.setAttribute('aria-hidden', 'true');
      resolve();
      return;
    }

    // Force reflow then animate
    void intro.offsetWidth;
    intro.classList.add('is-active');

    window.setTimeout(() => {
      intro.classList.remove('is-active');
      intro.hidden = true;
      intro.setAttribute('aria-hidden', 'true');
      resolve();
    }, CLOUD_INTRO_MS);
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
