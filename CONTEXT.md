# CONTEXT.md — Pegar al inicio de CADA prompt de IA

## Qué es
Invitación digital (single-page, scroll vertical) para el Baby Shower de
**Juan Manuel**. Se comparte por WhatsApp. Mobile-first. Sin frameworks.
Dirección visual: **cuento interactivo cinematográfico** (capítulos al scroll,
monograma JM, luna/anillos; sin ilustraciones de animales por defecto).

## Datos del evento (inmutables, también en `js/data/content.js`)
- Bebé: Juan Manuel
- Padres: Cristian Cerón & Luisa Ordóñez
- Fecha: Sábado 15 de agosto de 2026, 4:00 p.m. (Colombia, UTC−5)
- Countdown: timestamp absoluto `2026-08-15T16:00:00-05:00`
- Lugar: Salón Social Balcones del Este, Cra 2 #22B-123, Pasto, Nariño

## Stack (NO agregar nada más)
- HTML5 + CSS3 + JS ES Modules nativos. Sin npm, sin bundler, sin frameworks.
- Únicas librerías externas (CDN): Firebase SDK v10. lottie-web queda disponible
  pero NO se usa en main salvo que se reintroduzcan ilustraciones Lottie.
- Firestore: colección `rsvps` { name: string 1–80, attending: bool, createdAt: serverTimestamp }.
- Hosting: GitHub Pages. Panel de padres: Firebase Console (sin código).

## Diseño
- Paleta (tokens en css/base.css): niebla #C5D9EB / cielo #DCEAF4 / paper #F7F4EF
  / cream #FBF8F3 / sand #EFE6D8 · ink #2F4256 · azul #3F5F7A / #8EB4D0 ·
  champagne #C4A574 / #E2C98A · texto suave #6A7D91.
- Fuentes Google: Cormorant Infant (títulos), Outfit (cuerpo),
  Great Vibes (solo firma). font-display: swap.
- Estilo: cuento premium, cinematográfico al scroll, aireado. Nada infantil exagerado.
- Contenido max-width 640px centrado.
- Módulos motion: `reveal.js` (data-reveal), `story.js` (split nombre + parallax).

## Reglas técnicas obligatorias
- Animar SOLO transform y opacity (y la propiedad CSS `translate` para parallax).
  Respetar prefers-reduced-motion.
- Audio: NUNCA autoplay directo; se desbloquea con el tap de "Ver invitación".
- Lazy-load: iframe del mapa; imágenes si se agregan.
- Presupuesto: < 1 MB total sin contar el audio.
- Textos ESTÁTICOS: viven en `index.html` (SEO, OG, legibilidad sin JS).
  Textos/DATOS usados por módulos JS (countdown, RSVP, música, mapas):
  SIEMPRE desde `js/data/content.js` (no duplicar en los módulos).
- Referencia completa: `PLAN.md`. Decisiones: `DECISIONS.md`.
