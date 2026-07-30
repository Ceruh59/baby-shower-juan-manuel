/**
 * main.js — Orquestador
 */

import { initLoader } from './modules/loader.js';
import { initReveal } from './modules/reveal.js';
import { initStory } from './modules/story.js';
import { initBalloons } from './modules/balloons.js';
import { initCountdown } from './modules/countdown.js';
import { initMusic } from './modules/music.js';
import { initRsvp } from './modules/rsvp.js';
import { initVideo } from './modules/video.js';

// Siempre empezar arriba (evita restaurar scroll al fondo)
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

initStory();
initLoader();
initBalloons();
initReveal();
initCountdown();
initMusic();
initRsvp();
initVideo();
