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
| 2026-07-29 | 0 | Firebase configurado por el usuario: proyecto `baby-shower-juan-manuel`, credenciales reales en `config.js` | Desbloquea Fase 8 |
| 2026-07-29 | 0 | GitHub Pages activo: `https://ceruh59.github.io/baby-shower-juan-manuel/` | URL usada en meta OG de index.html |
| 2026-07-29 | 1 | Textos estáticos en HTML + textos/datos dinámicos desde `content.js` (híbrido) | Los crawlers de WhatsApp y la prueba "legible sin CSS/JS" requieren HTML real; los módulos JS leen de `content.js` |
| 2026-07-29 | 2 | Fondo = degradado global continuo con `background-attachment: fixed` (sin alternar fondos por sección) | Transición visual más suave y elegante; menos pintado en scroll (rendimiento móvil) |
| 2026-07-29 | 3 | Divisores SVG entre secciones OMITIDOS; se usa espaciado generoso + degradado continuo | Los divisores solo funcionan visualmente entre fondos de distinto color; con el degradado continuo se verían forzados |
| 2026-07-29 | 3 | Radio cards con selector `:has(input:checked)` | Soportado en todos los navegadores modernos (2023+); evita JS para el estado seleccionado |
| 2026-07-29 | 3 | Placeholder `.lottie:empty` = halo radial suave mientras llegan los JSON/PNG | El hueco de la ilustración se ve intencional y elegante desde ya |
| 2026-07-29 | 4 | Hero con `100svh` en lugar de `100dvh` | dvh cambia cuando Safari oculta su barra → salto visual; svh es estable durante el scroll |
| 2026-07-29 | 4 | Decoración desktop = nubes fijas vía `body::before/::after` (data-URI) | Cero peticiones extra, sin ensuciar el HTML semántico |
| 2026-07-29 | 5 | `ambience.js` eliminado como módulo separado; la celebración del RSVP se integra en `rsvp.js` (Fase 8) | El único uso de partículas es el éxito del formulario; un módulo aparte sería un archivo vacío hasta Fase 8 |
| 2026-07-29 | 5 | Estado oculto de `.reveal` solo aplica con `<html class="js">` | Sin JS (o si JS falla) el contenido siempre es visible — degradación elegante |
| 2026-07-29 | 5 | lottie-web vía `cdn.jsdelivr.net/npm/lottie-web@5.12.2/+esm` con import dinámico | lottie-web no publica build ESM oficial; `+esm` de jsDelivr lo envuelve. Versión fijada (pin) para estabilidad |
| 2026-07-29 | 5 | Deriva de nubes con delays negativos (`animation-delay: -18s/-42s/-60s`) | Al cargar la página las nubes ya aparecen repartidas por el cielo, no todas juntas a la izquierda |
| 2026-07-29 | 6 | Countdown recalcula desde `Date.now()` en cada tick (no acumula contadores) | Los navegadores pausan los intervalos en segundo plano; así nunca se desfasa aunque el invitado cambie de pestaña |
| 2026-07-29 | 6 | Pulso `.tick` solo cuando el texto del dígito cambia + `void offsetWidth` para reiniciar la animación | Evita pulsos innecesarios (60/seg) y permite re-disparar la animación CSS cada segundo |
| 2026-07-29 | 7 | El estado del botón de música se deriva de eventos del `<audio>` (play/pause/ended), no del clic | El audio es la fuente de verdad: imposible que el botón muestre "sonando" cuando no suena |
| 2026-07-29 | 7 | Si el archivo de audio falla, el botón se oculta solo (`error` → `hidden`) | Nunca queda visible un botón roto |
| 2026-07-29 | 8 | Reglas Firestore verificadas vía API REST (sin navegador): create válido → 200; lectura anónima → 403; create con campo extra → 403. Quedó un doc "PRUEBA TÉCNICA - BORRAR" para que el usuario lo borre | Prueba end-to-end de 8.3/8.4; el borrado manual ejercita el panel de padres |
| 2026-07-29 | 5 | Lottie JSON descargados de LottieFiles: oso = "Sleeping bear" (Andri Graphic, 27 KB), elefante = "Cute elephant animal" (Ayman Imran, 24 KB). Licencia: uso gratuito LottieFiles | Cumplen < 50 KB y la línea visual (trazos redondeados, sin contornos duros, paleta café/azul) |
| 2026-07-29 | 5 | Fallbacks `oso.png`/`elefante.png` derivados de los thumbnails oficiales (fondo blanco del oso → transparente con flood fill) | Misma ilustración que la animación → coherencia visual total si Lottie falla |
| 2026-07-29 | 10 | `og-image.jpg` generada con Pillow + fuentes oficiales de Google Fonts (1200×630, 58 KB) | Sin herramientas de diseño en el sistema; composición fiel a la paleta (degradado hero, nubes, estrellas, oso + elefante) |
| 2026-07-29 | 10 | Música: canción completa (5:55) → AAC 64kbps `.m4a` (2.9 MB) con `afconvert` de macOS; original respaldado fuera del repo | Decisión del usuario (conservar canción completa); ffmpeg no disponible; AAC lo reproducen todos los navegadores móviles; cumple < 3 MB |
| 2026-07-29 | 10 | Foco inicial en el botón "Ver invitación" (`loader.js`) | El overlay es `role="dialog"`: la navegación por teclado debe empezar dentro de él |
| 2026-07-29 | 5 | `data-lottie-speed="0.5"` en el elefantito (soporte en `lotties.js`) | Su loop nativo es de 0.6s: demasiado vivo para el tono "loop sutil" del mensaje emotivo |
| 2026-07-30 | Redesign | Dirección visual: cuento interactivo cinematográfico (capítulos + monograma JM + luna) | El usuario rechazó el look sencillo y las ilustraciones oso/elefante; pide scroll dinámico tipo landing |
| 2026-07-30 | Redesign | Tipografías: Cormorant Infant + Outfit + Great Vibes | Reemplazan Playfair/Nunito/Dancing Script (rechazadas); Infant evoca libro infantil premium, Outfit es cuerpo moderno |
| 2026-07-30 | Redesign | Lottie oso/elefante retirados del HTML; `lotties.js` fuera de main | Usuario no quiere esos dibujos; ornamentación SVG/CSS (luna, anillos, monograma) hasta que aporte assets propios |
| 2026-07-30 | Redesign | Módulo `story.js`: split del nombre + parallax hero + `body.is-entered` | Coreografía de entrada post-overlay y profundidad al scroll sin librerías nuevas |
| 2026-07-30 | Redesign | Reveals con `data-reveal` (up/left/right/scale/fade) | Variedad cinematográfica al scroll manteniendo solo transform/opacity |
