/**
 * main.js — Orquestador de la invitación (cuento interactivo).
 *
 * Datos del evento: SIEMPRE desde js/data/content.js
 */

import { initLoader } from './modules/loader.js';
import { initReveal } from './modules/reveal.js';
import { initStory } from './modules/story.js';
import { initCountdown } from './modules/countdown.js';
import { initMusic } from './modules/music.js';
import { initRsvp } from './modules/rsvp.js';

initLoader();
initStory();
initReveal();
initCountdown();
initMusic();
initRsvp();
