/**
 * video.js — Ecografía: carga perezosa + play/pause al entrar/salir de vista.
 */

export function initVideo() {
  const video = document.getElementById('eco-video');
  if (!video) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let loaded = false;

  function ensureLoad() {
    if (loaded) return;
    loaded = true;
    // Dispara la descarga real (preload="none" hasta este momento)
    video.load();
  }

  if (!('IntersectionObserver' in window)) {
    ensureLoad();
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          ensureLoad();
          if (!prefersReduced) {
            // Autoplay silencioso al entrar (los controles permiten subir volumen)
            video.muted = true;
            const playAttempt = video.play();
            if (playAttempt) playAttempt.catch(() => {});
          }
        } else if (!video.paused) {
          video.pause();
        }
      });
    },
    { threshold: 0.45, rootMargin: '80px 0px' }
  );

  observer.observe(video);
}
