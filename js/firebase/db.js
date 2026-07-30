/**
 * db.js (Fase 8.1) — Conexión con Firebase Firestore.
 *
 * - Firebase SDK v10 importado desde el CDN oficial (versión fijada).
 * - La API key visible es NORMAL y segura por diseño: la protección la dan
 *   las reglas de Firestore (PLAN.md §10) — solo-create con validación.
 * - Los documentos se guardan en la colección "rsvps" con la forma:
 *     { name: string (1–80), attending: bool, createdAt: serverTimestamp }
 *   que es EXACTAMENTE lo que las reglas de seguridad permiten.
 */

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

import { firebaseConfig } from './config.js';

const app = initializeApp(firebaseConfig);

// La base de datos se creó con ID personalizado "juanmanuel" (no "(default)")
const db = getFirestore(app, 'juanmanuel');

/* --------------------------------------------------------------------------
   OPCIONAL — App Check (solo si lo activaste en docs/GUIA-FIREBASE.md Paso 5).
   Descomentar y pegar tu SITE KEY de reCAPTCHA v3:

   import { initializeAppCheck, ReCaptchaV3Provider } from
     'https://www.gstatic.com/firebasejs/10.12.2/firebase-app-check.js';

   initializeAppCheck(app, {
     provider: new ReCaptchaV3Provider('PEGA_TU_SITE_KEY'),
     isTokenAutoRefreshEnabled: true,
   });
   -------------------------------------------------------------------------- */

/**
 * Guarda una confirmación de asistencia.
 * @param {{ name: string, attending: boolean }} data
 * @returns {Promise<import('firebase/firestore').DocumentReference>}
 */
export function saveRsvp({ name, attending }) {
  return addDoc(collection(db, 'rsvps'), {
    name,
    attending,
    createdAt: serverTimestamp(),
  });
}
