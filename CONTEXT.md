# CONTEXT.md — Pegar al inicio de CADA prompt de IA

## Qué es
Invitación digital (single-page, scroll vertical) para el Baby Shower de
**Juan Manuel**. Se comparte por WhatsApp. Mobile-first. Sin frameworks.

## Datos del evento (inmutables, también en `js/data/content.js`)
- Bebé: Juan Manuel
- Padres: Cristian Cerón & Luisa Ordóñez
- Fecha: Sábado 15 de agosto de 2026, 4:00 p.m. (Colombia, UTC−5)
- Countdown: timestamp absoluto `2026-08-15T16:00:00-05:00`
- Lugar: Salón Social Balcones del Este, Cra 2 #22B-123, Pasto, Nariño

## Stack (NO agregar nada más)
- HTML5 + CSS3 + JS ES Modules nativos. Sin npm, sin bundler, sin frameworks.
- Únicas librerías externas (CDN): Firebase SDK v10 (Fase 8) y lottie-web (Fase 5).
- Firestore: colección `rsvps` { name: string 1–80, attending: bool, createdAt: serverTimestamp }.
- Hosting: GitHub Pages. Panel de padres: Firebase Console (sin código).

## Diseño
- Paleta: fondos #FDFBF7 / #EAF3FA / #F4EDE3 · acentos #7FA8C9, #4E6E8E,
  #B98E63, #D9BC96, #E8C87E · texto #44546A / #7B8A9C (tokens en css/base.css).
- Fuentes Google: Playfair Display (títulos), Nunito (cuerpo),
  Dancing Script (solo firma). font-display: swap.
- Estilo: tierno-elegante, aireado, premium. Nada saturado ni infantil exagerado.
- Contenido max-width 640px centrado.

## Reglas técnicas obligatorias
- Animar SOLO transform y opacity. Respetar prefers-reduced-motion.
- Audio: NUNCA autoplay directo; se desbloquea con el tap de "Ver invitación".
- Lazy-load: iframe del mapa, imágenes y JSON de Lottie.
- Presupuesto: < 1 MB total sin contar el audio.
- Textos ESTÁTICOS: viven en `index.html` (SEO, OG, legibilidad sin JS).
  Textos/DATOS usados por módulos JS (countdown, RSVP, música, mapas):
  SIEMPRE desde `js/data/content.js` (no duplicar en los módulos).
- Referencia completa: `PLAN.md`. Decisiones: `DECISIONS.md`.
