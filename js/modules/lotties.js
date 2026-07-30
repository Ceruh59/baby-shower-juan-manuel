/**
 * lotties.js (Fase 5.5) — Ilustraciones animadas Lottie con carga perezosa.
 *
 * Contenedores en el HTML: <div class="lottie" data-lottie="ruta.json"
 * data-lottie-fallback="ruta.png">.
 * Opcional: data-lottie-speed="0.5" reduce la velocidad de ESA animación
 * (el elefantito tiene un loop nativo de 0.6s: demasiado vivo sin ajuste).
 *
 * Comportamiento:
 * - La librería lottie-web se importa desde CDN SOLO cuando un contenedor
 *   está a 250px de entrar en viewport (lazy-load real).
 * - La animación se pausa cuando sale del viewport (ahorro de CPU/batería).
 * - Cadena de fallback si algo falla (JSON no descargado aún, CDN caído):
 *     Lottie → imagen estática (data-lottie-fallback) → halo placeholder
 *     (`.lottie:empty`, ya definido en components.css).
 * - prefers-reduced-motion → NUNCA se carga Lottie; solo imagen estática
 *   o halo.
 */

const LOTTIE_CDN = 'https://cdn.jsdelivr.net/npm/lottie-web@5.12.2/+esm';
const PRELOAD_MARGIN = '250px';

let lottieLibraryPromise = null;

function loadLottieLibrary() {
  if (!lottieLibraryPromise) {
    lottieLibraryPromise = import(LOTTIE_CDN).then((module) => module.default ?? module);
  }
  return lottieLibraryPromise;
}

/** Fallback: imagen estática; si también falla, el contenedor queda vacío
 *  y components.css muestra el halo suave (.lottie:empty). */
function showFallback(container) {
  const fallbackSrc = container.dataset.lottieFallback;
  if (!fallbackSrc || container.querySelector('img')) return;

  const img = new Image();
  img.loading = 'lazy';
  img.alt = ''; // el contenedor ya tiene role="img" + aria-label
  img.src = fallbackSrc;
  img.onerror = () => img.remove();
  container.appendChild(img);
}

/** Monta la animación y la pausa/reanuda según visibilidad. */
async function mountAnimation(container) {
  try {
    const lottie = await loadLottieLibrary();

    const animation = lottie.loadAnimation({
      container,
      renderer: 'svg',
      loop: true,
      autoplay: false,
      path: container.dataset.lottie,
    });

    // Si el JSON no existe o está corrupto → fallback
    animation.addEventListener('data_failed', () => {
      animation.destroy();
      showFallback(container);
    });

    // Velocidad personalizada por contenedor (p. ej. loops nativos muy cortos)
    const speed = Number.parseFloat(container.dataset.lottieSpeed);
    if (Number.isFinite(speed) && speed > 0) animation.setSpeed(speed);

    const visibilityObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) animation.play();
          else animation.pause();
        });
      },
      { threshold: 0.1 }
    );
    visibilityObserver.observe(container);
  } catch {
    showFallback(container);
  }
}

export function initLotties() {
  const containers = document.querySelectorAll('.lottie[data-lottie]');
  if (containers.length === 0) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  containers.forEach((container) => {
    if (prefersReduced || !('IntersectionObserver' in window)) {
      showFallback(container);
      return;
    }

    // Carga perezosa: montar solo cuando el contenedor se acerca al viewport
    const preloadObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          preloadObserver.unobserve(container);
          mountAnimation(container);
        });
      },
      { rootMargin: PRELOAD_MARGIN }
    );
    preloadObserver.observe(container);
  });
}
