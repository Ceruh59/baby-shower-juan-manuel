# DECISIONS.md — Bitácora de decisiones

> Formato: `FECHA | FASE | DECISIÓN | MOTIVO`. Agregar una línea por decisión.
> No borrar entradas; si algo cambia, agregar una nueva línea que la reemplace.

| Fecha | Fase | Decisión | Motivo |
|---|---|---|---|
| 2026-07-29 | Plan | Sin frameworks (HTML/CSS/JS ES Modules puros) | Una sola página estática no justifica build tooling; cualquier IA puede editarlo sin setup |
| 2026-07-29 | Plan | Librerías externas permitidas: SOLO Firebase SDK + lottie-web (CDN) | GSAP y AOS evaluadas y rechazadas (sobredimensionadas); Lottie aporta ilustraciones animadas que CSS no puede replicar |
| 2026-07-29 | Plan | Panel de padres = Firebase Console | Gratis, 100% seguro, cero código adicional, sin rutas ocultas inseguras |
| 2026-07-29 | Plan | Hosting = GitHub Pages; Firebase solo Firestore | Menos piezas que mantener; HTTPS y CDN gratis |
| 2026-07-29 | Plan | Countdown con timestamp absoluto `2026-08-15T16:00:00-05:00` | Correcto sin importar la zona horaria del invitado |
| 2026-07-29 | Plan | Anti-spam: reglas solo-create + honeypot + App Check reCAPTCHA v3 + localStorage | Todo gratuito y sin fricción para el invitado |
| 2026-07-29 | Plan | Música = archivo propio del cliente, sin autoplay forzado | Restricciones de navegadores; se desbloquea con tap en "Ver invitación" |
| 2026-07-29 | Plan | Textos centralizados en `js/data/content.js` | Cambios de último minuto sin tocar HTML |
| 2026-07-29 | Plan | Tipografías: Playfair Display + Nunito + Dancing Script (solo firma) | Elegante + tierna + legible; máx 3 familias por rendimiento |
| 2026-07-29 | 0 | Estructura de carpetas creada según PLAN.md §9 | — |
