/**
 * main.js — Orquestador de la invitación.
 *
 * Importa e inicializa los módulos en orden. Cada módulo se implementa
 * en su fase correspondiente (ver PLAN.md §12). Descomentar cada import
 * cuando la fase esté lista.
 *
 * Módulos:
 *   ✅ loader.js    (Fase 5) → overlay de bienvenida + desbloqueo de audio
 *   ✅ reveal.js    (Fase 5) → animaciones al hacer scroll (IntersectionObserver)
 *   ✅ lotties.js   (Fase 5) → ilustraciones animadas con carga perezosa
 *   ✅ countdown.js (Fase 6) → cuenta regresiva al 2026-08-15T16:00:00-05:00
 *   ✅ music.js     (Fase 7) → botón flotante play/pause
 *   ✅ rsvp.js      (Fase 8) → formulario + envío a Firestore + celebración
 *      (la celebración con partículas está integrada en rsvp.js; no hay
 *      ambience.js separado — ver DECISIONS.md)
 *
 * Datos del evento: SIEMPRE desde js/data/content.js (no duplicar aquí).
 */

import { initLoader } from './modules/loader.js';
import { initReveal } from './modules/reveal.js';
import { initLotties } from './modules/lotties.js';
import { initCountdown } from './modules/countdown.js';
import { initMusic } from './modules/music.js';
import { initRsvp } from './modules/rsvp.js';

initLoader();
initReveal();
initLotties();
initCountdown();
initMusic();
initRsvp();
