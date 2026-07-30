# PLAN DE DESARROLLO — Invitación Digital Baby Shower "Juan Manuel"

**Versión 1.1 | Aprobado: 29-jul-2026 | Evento: sábado 15-ago-2026**

> Este documento es la referencia maestra del proyecto. Cada fase (§12) es
> auto-contenida y ejecutable por un modelo de IA pequeño usando la plantilla
> de prompt de §15 junto con `CONTEXT.md`.

---

## Datos maestros del evento (fuente única de verdad)

| Dato | Valor |
|---|---|
| Bebé | Juan Manuel |
| Padres | Cristian Cerón & Luisa Ordóñez |
| Fecha | Sábado 15 de agosto de 2026 (verificado: es sábado) |
| Hora | 4:00 p.m. (hora Colombia, UTC−5) |
| Lugar | Salón Social Balcones del Este, Cra 2 #22B-123, Pasto, Nariño |
| Distribución | URL por WhatsApp (GitHub Pages) |
| Música | Archivo de audio propio del cliente (`assets/audio/musica.m4a`) |
| Panel RSVP | Firebase Console (sin código adicional) |

**Decisión:** el countdown usa el timestamp absoluto `2026-08-15T16:00:00-05:00`
para funcionar igual sin importar la zona horaria del dispositivo del invitado.

---

## 1. Análisis del proyecto

Single-page website (una página con scroll vertical) como invitación digital
interactiva. Proyecto desechable de un solo uso: no necesita CMS, escalabilidad
ni reutilización. Prioridad absoluta: belleza visual, fluidez y carga rápida
en móvil.

**Contexto de uso real:**
- 90%+ de visitas desde WhatsApp en celulares (incluido in-app browser).
- Conexiones posiblemente lentas → presupuesto de peso: **< 1 MB** sin audio.
- Visita corta (1–3 min): impactar en los primeros 5 segundos.

**Restricciones aceptadas:**
- Sin frameworks (React/Vue/etc.): ES Modules nativos bastan.
- Sin backend propio: Firebase Firestore (capa gratuita Spark).
- Todo gratis: GitHub Pages + Firebase Spark + Google Fonts + Maps Embed.
- Únicas librerías externas (vía CDN): Firebase SDK + lottie-web.

---

## 2. Arquitectura propuesta

```
┌─────────────────────────────────────────────┐
│  index.html  (estructura semántica única)    │
├─────────────────────────────────────────────┤
│  CSS en capas: base → layout → components    │
│  → animations → responsive                   │
├─────────────────────────────────────────────┤
│  JS: main.js (orquestador)                   │
│   ├── loader.js      (pantalla bienvenida)   │
│   ├── reveal.js      (animaciones on-scroll) │
│   ├── ambience.js    (partículas/efectos)    │
│   ├── lotties.js     (ilustraciones vivas)   │
│   ├── countdown.js   (cuenta regresiva)      │
│   ├── music.js       (audio toggle)          │
│   └── rsvp.js        (formulario + Firestore)│
├─────────────────────────────────────────────┤
│  firebase/config.js  +  firebase/db.js       │
├─────────────────────────────────────────────┤
│  Firebase Firestore (colección "rsvps")      │
└─────────────────────────────────────────────┘
```

**Decisiones clave:**
1. Sin framework, sin bundler, sin npm. Firebase y lottie-web se importan
   desde CDN oficial con `import` nativo.
2. CSS con custom properties (design tokens) → paleta/tipografía en `base.css`.
3. Animaciones **CSS-first** (reveals, flotación, nubes, estrellas) +
   **Lottie** solo para 2–3 ilustraciones animadas clave (lo que CSS no puede
   replicar). Librerías externas permitidas: Firebase SDK y lottie-web.
   **Ninguna otra** (GSAP y AOS fueron evaluadas y rechazadas: sobredimensionadas).
4. Textos centralizados en `js/data/content.js` → correcciones de último
   minuto sin tocar el HTML.
5. Los JSON de Lottie se cargan de forma perezosa (IntersectionObserver) y se
   pausan fuera de viewport.

---

## 3. Flujo de navegación

```
[Abre URL desde WhatsApp]
        │
        ▼
┌──────────────────────┐
│ 0. BIENVENIDA         │  Overlay fullscreen: luna + estrellas +
│ "Una sorpresa muy     │  texto + botón "Ver invitación"
│  especial te espera"  │  → el TAP desbloquea el audio
└─────────┬────────────┘    (gesto válido para el navegador)
          │  fade out del overlay (0.8s) + intenta iniciar música
          ▼
┌──────────────────────┐
│ 1. HERO               │  Nombre del bebé, fecha, Lottie osito,
│ nubes • luna •        │  indicador "desliza ↓"
│ estrellas             │
└─────────┬────────────┘
          ▼
┌──────────────────────┐
│ 2. MENSAJE EMOTIVO    │  Texto de los padres + Lottie elefantito
└─────────┬────────────┘
          ▼
┌──────────────────────┐
│ 3. DETALLES           │  3 tarjetas: Fecha / Hora / Lugar
└─────────┬────────────┘
          ▼
┌──────────────────────┐
│ 4. CUENTA REGRESIVA   │  Días • Horas • Min • Seg animados
└─────────┬────────────┘
          ▼
┌──────────────────────┐
│ 5. UBICACIÓN          │  Mapa embebido + botón "Cómo llegar"
└─────────┬────────────┘
          ▼
┌──────────────────────┐
│ 6. RSVP               │  Nombre + ¿Asistirás? + envío → éxito
└─────────┬────────────┘
          ▼
┌──────────────────────┐
│ 7. CIERRE             │  Agradecimiento + firma padres + footer
└──────────────────────┘

[Flotante permanente: botón de música (esquina inferior derecha)]
[Consulta RSVP: Firebase Console — fuera de la página]
```

---

## 4. Diseño de cada sección (spec detallada)

**Sistema general:** fondo en degradado vertical muy sutil (blanco cálido →
celeste pálido → beige), divisores SVG suaves entre secciones (silueta de
nubes u ondas), ancho máximo de contenido 640px centrado (en desktop sigue
siendo "columna de invitación" con decoración flotando a los lados).
Espaciado generoso, nada saturado.

### 0. Bienvenida (overlay)
- Fondo celeste suave con estrellas parpadeantes y luna SVG.
- Texto: *"Una sorpresa muy especial te espera"* + botón pill "Ver invitación".
- Función técnica doble: entrada elegante **y** gesto que habilita el audio.
- Al tocar: fade out + leve escalado; el overlay se retira del DOM.

### 1. Hero
- Kicker: *"Estás invitado al Baby Shower de"*
- **"Juan Manuel"** en tipografía display grande, azul medio.
- Fecha: *"Sábado 15 de agosto de 2026"*.
- Lottie protagonista: osito café durmiendo sobre luna/nube (loop suave).
- Nubes SVG/CSS a distintas velocidades; indicador "Desliza ↓" con rebote.

### 2. Mensaje emotivo
- Texto (editable en `content.js`):
  > *"Un pequeño milagro está por llegar y queremos celebrarlo contigo. Con
  > mucha ilusión te invitamos a compartir la alegría de la llegada de
  > nuestro bebé."*
- Firma: *"Cristian & Luisa"*.
- Lottie: elefantito bebé (loop sutil). Hojas suaves en esquinas.

### 3. Detalles
- Tres tarjetas blancas, sombra muy suave, radius 20px, íconos SVG lineales:
  - **Fecha:** Sábado 15 de agosto de 2026
  - **Hora:** 4:00 p.m.
  - **Lugar:** Salón Social Balcones del Este, Cra 2 #22B-123, Pasto, Nariño
- Aparición escalonada (stagger 150ms) al entrar en viewport.

### 4. Cuenta regresiva
- 4 bloques (Días / Horas / Minutos / Segundos), número grande + etiqueta.
- Al cambiar un dígito: micro-pulso (scale 1→1.08→1 + fade, 300ms).
- Al llegar a cero: *"¡Hoy es el gran día!"*.

### 5. Ubicación
- Iframe Google Maps Embed (dirección en **Pasto, Nariño**), `loading="lazy"`,
  radius 20px, altura ~300px.
- Botón destacado "Cómo llegar" → abre Google Maps app/web con la ruta.
- Texto: *"Cra 2 #22B-123, Salón Social Balcones del Este, Pasto"*.

### 6. RSVP
- Título: *"Confírmanos tu asistencia"* + subtítulo *"Nos encantaría contar contigo"*.
- Input nombre (grande, `autocomplete="name"`).
- ¿Asistirás? → dos "radio cards" táctiles: **"Sí, ahí estaré"** / **"No podré"**.
- Botón enviar deshabilitado hasta completar ambos campos.
- Envío: spinner sutil → check SVG que se dibuja + *"¡Gracias! Tu respuesta
  fue enviada"* + celebración discreta (globos/estrellas, 1.5s máx).
- Tras enviar, el form se reemplaza por el éxito (persistente con
  `localStorage` para no mostrarlo de nuevo).

### 7. Cierre
- Ilustración final pequeña (osito + elefantito o nubes).
- *"¡Te esperamos con los brazos abiertos!"* y *"Con amor, Cristian & Luisa"*.
- Footer: *"Baby Shower de Juan Manuel • 15.08.2026"*.

### Botón de música (flotante)
- Círculo 48px, esquina inferior derecha, blanco semitransparente con blur,
  ícono nota musical.
- Estados visuales claros: sonando (onditas animadas) / pausado.

---

## 5. Animaciones propuestas

| # | Animación | Técnica | Detalle |
|---|---|---|---|
| 1 | Salida de bienvenida | CSS transition + JS | opacity + scale, 0.8s `cubic-bezier(0.22,1,0.36,1)` |
| 2 | Reveal al hacer scroll | IntersectionObserver + CSS | `opacity 0 + translateY(24px)` → visible, 0.8s, `once: true` |
| 3 | Deriva de nubes | CSS `@keyframes` | `translateX(-10vw → 110vw)`, loops 60–120s, 3 duraciones |
| 4 | Flotación ilustraciones | CSS `@keyframes` | `translateY(±8px)`, 5–7s ease-in-out infinite, delays escalonados |
| 5 | Estrellas parpadeantes | CSS `@keyframes` | opacity 0.3↔1, 2–4s, delays variados |
| 6 | Globos/hojas meciéndose | CSS `rotate(±3deg)` | transform-origin abajo, 6s loop |
| 7 | Pulso dígitos countdown | JS + clase CSS | al cambiar: `scale(1.08)` + fade, 300ms |
| 8 | Éxito RSVP | SVG `stroke-dashoffset` + partículas | check en 0.6s + ~20 partículas discretas, 1.5s |
| 9 | Indicador "desliza ↓" | CSS keyframes | rebote vertical suave infinito |
| 10 | Ondas botón música | CSS keyframes | 3 barras scaleY alternado cuando suena |
| 11 | Ilustraciones vivas (osito, elefante) | **Lottie + JSON LottieFiles** | loop suave, autoplay al entrar en viewport, pausa fuera |

**Reglas de oro:**
- Animar **solo** `transform` y `opacity` (evita reflows).
- `prefers-reduced-motion: reduce` desactiva loops y reveals (contenido
  aparece directo; Lottie → SVG/PNG estático).
- Partículas: máx ~20 elementos; se apagan con pestaña oculta (`visibilitychange`).
- Lottie: máx 2–3 instancias, lazy-load, pausa fuera de viewport.

---

## 6. Recursos gráficos necesarios

| Recurso | Formato | Fuente | Peso objetivo |
|---|---|---|---|
| Osito durmiendo (hero) | **JSON Lottie** (+ fallback SVG/PNG) | [lottiefiles.com](https://lottiefiles.com) — buscar *"baby bear sleeping"*; recolorear si es posible | < 50 KB |
| Elefantito bebé (mensaje) | **JSON Lottie** (+ fallback) | lottiefiles.com — *"baby elephant"* | < 50 KB |
| Celebración RSVP (opcional) | JSON Lottie | lottiefiles.com — *"balloons"* / *"stars"* | < 50 KB |
| Nubes (3 variantes) | SVG | Hechas a mano (elipses fusionadas) | < 3 KB c/u |
| Luna + estrellas | SVG | Hechas a mano | < 2 KB |
| Hojas decorativas | SVG | Tabler Icons adaptadas o manuales | < 3 KB |
| Íconos (calendario, reloj, pin, música) | SVG inline | Tabler Icons (MIT) | < 1 KB c/u |
| Divisores de sección (nubes/onda) | SVG | Hechos a mano | < 3 KB |
| **Imagen Open Graph** (preview WhatsApp) | JPG/WebP 1200×630 | Composición del hero (nombre + fecha + ilustración) | < 200 KB |
| Favicon | SVG/PNG | Osito o luna simplificada | < 5 KB |
| Música | AAC (`.m4a`) | **Archivo propio del cliente** — canción completa (5:55) a 64kbps (ver DECISIONS.md) | < 3 MB |

**Criterio de consistencia:** osito y elefantito deben compartir línea visual
(cafés suaves, trazos redondeados, sin contornos negros duros). Registrar la
fuente/licencia de cada recurso en `DECISIONS.md`.

---

## 7. Paleta de colores

```css
/* Fondos */
--bg-blanco-calido:  #FDFBF7;   /* base */
--bg-celeste-niebla: #EAF3FA;   /* secciones alternas */
--bg-beige-suave:    #F4EDE3;   /* secciones alternas */
--degradado-hero:    linear-gradient(180deg, #DCEAF6 0%, #FDFBF7 100%);

/* Acentos */
--azul-principal:    #7FA8C9;   /* celeste medio: detalles */
--azul-profundo:     #4E6E8E;   /* títulos, botones (texto blanco) */
--cafe-tierno:       #B98E63;   /* osito, acentos cálidos */
--cafe-claro:        #D9BC96;   /* bordes y sombras cálidas */
--dorado-estrella:   #E8C87E;   /* estrellas, micro-destellos */
--rosa-error-suave:  #C97F7F;   /* solo errores de formulario */

/* Texto */
--texto-principal:   #44546A;   /* azul-grisáceo oscuro */
--texto-suave:       #7B8A9C;   /* subtítulos */
```

**Contraste verificado:** texto #44546A sobre #FDFBF7 ≈ 7.9:1 (AAA); sobre
#EAF3FA ≈ 7.2:1. Botones: #4E6E8E con texto blanco ≈ 5.9:1 (AA).

---

## 8. Tipografías recomendadas

Google Fonts (gratis), `font-display: swap`, subset `latin`, máx 3 familias:

| Rol | Fuente | Uso |
|---|---|---|
| Display/Títulos | **Playfair Display** (600–700, con itálica) | "Juan Manuel", títulos de sección |
| Cuerpo/UI | **Nunito** (400/600/700) | párrafos, botones, formulario |
| Acento manuscrito *(opcional)* | **Dancing Script** (600) | firma "Cristian & Luisa" |

Alternativa (elegir UNA pareja, no ambas): Cormorant Garamond + Quicksand.

**Escala móvil:** cuerpo 17px, h2 26px, nombre bebé `clamp(2.6rem, 12vw, 4.5rem)`.

---

## 9. Organización de carpetas

```
baby-shower-juan-manuel/
├── index.html                  # única página (Fase 1)
├── css/
│   ├── base.css                # reset + tokens (paleta, fuentes, espaciado)
│   ├── layout.css              # estructura de secciones, contenedores
│   ├── components.css          # botones, tarjetas, formulario, countdown
│   ├── animations.css          # @keyframes y clases reveal
│   └── responsive.css          # breakpoints tablet/desktop
├── js/
│   ├── main.js                 # orquestador: importa e inicializa módulos
│   ├── modules/
│   │   ├── loader.js           # overlay de bienvenida
│   │   ├── reveal.js           # IntersectionObserver
│   │   ├── ambience.js         # partículas + helpers de animación
│   │   ├── lotties.js          # carga perezosa de Lottie
│   │   ├── countdown.js
│   │   ├── music.js
│   │   └── rsvp.js             # formulario + validación + envío
│   ├── firebase/
│   │   ├── config.js           # credenciales públicas del proyecto
│   │   └── db.js               # init app/firestore + saveRsvp()
│   └── data/
│       └── content.js          # TODOS los textos editables
├── assets/
│   ├── images/                 # svg, og-image.jpg, favicon
│   ├── lottie/                 # JSON de animaciones Lottie
│   └── audio/                  # musica.m4a (archivo del cliente, optimizado)
├── docs/
│   ├── GUIA-FIREBASE.md        # setup Firebase paso a paso
│   └── GUIA-GITHUB-PAGES.md    # publicación paso a paso
├── .gitignore
├── README.md
├── PLAN.md                     # este documento
├── CONTEXT.md                  # resumen para prompts de IA
└── DECISIONS.md                # registro de decisiones
```

Sin carpeta `components/`: los componentes son bloques de HTML con clases CSS.
Cada archivo tiene una única responsabilidad y es corto (fácil para modelos
pequeños).

---

## 10. Estrategia Firebase

**Setup (Fase 0, manual, 15 min — ver `docs/GUIA-FIREBASE.md`):**
1. Crear proyecto `baby-shower-juan-manuel` (Analytics desactivado).
2. Firestore en **modo producción**, ubicación más cercana disponible.
3. Registrar app web → copiar config a `js/firebase/config.js`.
4. App Check con reCAPTCHA v3 (gratis) → anti-bots sin fricción.

**Modelo de datos — colección `rsvps`:**
```js
{
  name: "María Pérez",         // string, 1–80 chars
  attending: true,             // boolean
  createdAt: serverTimestamp() // hora del servidor
}
```

**Reglas de seguridad** (solo crear respuestas válidas; nadie lee/edita/borra):
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /rsvps/{doc} {
      allow read, update, delete: if false;
      allow create: if
        request.resource.data.keys().hasOnly(['name', 'attending', 'createdAt'])
        && request.resource.data.name is string
        && request.resource.data.name.size() >= 1
        && request.resource.data.name.size() <= 80
        && request.resource.data.attending is bool
        && request.resource.data.createdAt == request.time;
    }
  }
}
```

**Anti-spam gratuito (capas):** ① honeypot invisible en el form, ② botón se
deshabilita tras enviar + flag en `localStorage`, ③ App Check reCAPTCHA v3,
④ validación estricta en reglas. Ninguna capa cuesta ni molesta al invitado.

**La API key visible en el frontend es normal y segura por diseño** — la
seguridad la dan las reglas + App Check.

**Panel de padres:** Firebase Console → Firestore Database → colección
`rsvps` (guía en Fase 9).

---

## 11. Estrategia GitHub Pages

1. Repo público `baby-shower-juan-manuel`, rama `main` (ver `docs/GUIA-GITHUB-PAGES.md`).
2. *Settings → Pages → Deploy from a branch → main / (root)*.
3. URL: `https://<usuario>.github.io/baby-shower-juan-manuel/`.
4. Verificar preview de WhatsApp con un envío real; si la imagen OG se
   cachea, probar con `?v=2`.
5. **Firebase Hosting NO se usa** (GitHub Pages basta; menos piezas).
6. Meta tags: `og:title`, `og:description`, `og:image` (URL absoluta HTTPS),
   `og:type=website`, `theme-color` #EAF3FA, favicon, `description`.

---

## 12. Cronograma de desarrollo (tareas pequeñas y verificables)

> Estimado total: **12.5–16.5 horas**. Cada fase = una sesión independiente.

| Fase | Nombre | Tareas | Est. | Estado |
|---|---|---|---|---|
| **0** | Setup | 0.1 Estructura de carpetas. 0.2 Firebase + reglas + App Check (manual, usuario). 0.3 Repo GitHub + Pages (manual, usuario). 0.4 `config.js` + `content.js`. 0.5 Recibir/optimizar música (usuario). | 1 h | ✅ |
| **1** | HTML base | 1.1 `index.html` semántico completo (8 secciones, meta OG). 1.2 Cargar fuentes y CSS en orden. 1.3 Prueba: contenido legible sin CSS. | 1.5 h | ✅ |
| **2** | CSS base | 2.1 Reset + tokens. 2.2 Layout + contenedor 640px. 2.3 Escala tipográfica móvil. | 1.5 h | ✅ |
| **3** | CSS secciones | 3.1 Hero + overlay. 3.2 Tarjetas detalles. 3.3 Countdown. 3.4 Formulario + radio cards. 3.5 Mapa, cierre, botón música. 3.6 Integrar SVG (nubes, luna, hojas) y divisores. | 3 h | ✅ (divisores omitidos → ver DECISIONS.md) |
| **4** | Responsive | 4.1 Tablet ≥768px. 4.2 Desktop ≥1024px (decoración lateral). 4.3 safe-area iOS, 100svh, viewport 360px. | 1 h | ✅ |
| **5** | Animaciones | 5.1 `animations.css` (keyframes). 5.2 `reveal.js` (IO + stagger). 5.3 Salida overlay + desbloqueo audio. 5.4 `prefers-reduced-motion`. 5.5 `lotties.js` (lazy-load lottie-web CDN, pausa fuera de viewport, fallback SVG/PNG, reduced-motion → estático). | 2.5 h | ✅ |
| **6** | Countdown | 6.1 `countdown.js` con fecha `-05:00`. 6.2 Pulso al cambiar dígito. 6.3 Estado "¡Hoy es el gran día!". | 45 min | ✅ |
| **7** | Música | 7.1 `music.js` (play/pause, volumen 0.5, loop). 7.2 Autoplay tras tap de bienvenida + fallback. 7.3 Estados visuales del botón. | 45 min | ✅ |
| **8** | RSVP + Firestore | 8.1 `db.js` (init + saveRsvp). 8.2 `rsvp.js` (validación, honeypot, estados, éxito animado, localStorage). 8.3 Publicar reglas y probar escritura real. 8.4 Probar rechazo de lecturas externas. | 2 h | ✅ (8.3/8.4 verificados vía API REST) |
| **9** | Panel padres | 9.1 Mini-guía con capturas: Console → Firestore → `rsvps`. 9.2 Ordenar por fecha y contar asistentes. | 30 min | ✅ (`docs/PANEL-PADRES.md`) |
| **10** | Optimización y accesibilidad | 10.1 Lazy loading (mapa, imágenes, lottie). 10.2 Comprimir SVG/OG, peso < 1 MB sin audio. 10.3 Contraste/foco/labels/alt. 10.4 Preview WhatsApp real. | 1.5 h | ✅ (10.4 pendiente: envío real por el usuario → `docs/CHECKLIST-FINAL.md`) |
| **11** | QA y publicación | 11.1 Pruebas en iOS + Android reales y desde WhatsApp. 11.2 Checklist final (§13). 11.3 RSVP de prueba end-to-end y borrado. 11.4 Difusión. | 1 h | 🟡 (11.2 ✅ → `docs/CHECKLIST-FINAL.md`; 11.1/11.3/11.4 manuales, usuario) |

---

## 13. Entregables por fase

- **F0:** estructura de carpetas, `PLAN.md`/`CONTEXT.md`/`DECISIONS.md`,
  guías de setup, `config.js` placeholder, `content.js` con textos reales.
  *(Manual del usuario: proyecto Firebase con reglas publicadas, repo con
  Pages activo, archivo de música.)*
- **F1:** `index.html` válido con todos los textos reales del evento.
- **F2:** paleta y tipografías aplicadas en móvil.
- **F3:** página visualmente completa en móvil (sin animaciones aún).
- **F4:** diseño correcto en 360px / 768px / 1440px (capturas de evidencia).
- **F5:** animaciones del §5 funcionando, suaves, `prefers-reduced-motion`
  respetado; Lottie con lazy-load y fallback.
- **F6:** cuenta regresiva exacta al 15-ago-2026 4:00 p.m. (verificada
  adelantando la hora del sistema y cambiando zona horaria).
- **F7:** música suena tras "Ver invitación"; botón flotante con play/pause.
- **F8:** RSVP end-to-end: enviar → documento en Console; reglas rechazan
  lecturas anónimas (prueba desde consola del navegador).
- **F9:** `docs/PANEL-PADRES.md` con guía ilustrada.
- **F10:** Lighthouse móvil ≥ 90 Performance y Accessibility; OG correcto.
- **F11:** URL final validada en dispositivos reales; RSVP de prueba eliminado.

---

## 14. Riesgos técnicos y mitigación

| Riesgo | Prob. | Mitigación |
|---|---|---|
| Autoplay de audio bloqueado | Alta (garantizado) | La bienvenida ES el gesto: tap "Ver invitación" → `play()`. Si falla, el botón flotante queda disponible. Nunca forzar. |
| Firestore expuesto → spam | Media | Reglas solo-create con validación + honeypot + App Check + lectura pública denegada. |
| Preview WhatsApp roto | Media | `og:image` absoluta HTTPS 1200×630 < 300 KB; probar envío real; `?v=2` rompe caché. |
| Countdown incorrecto por zona horaria | Media | Timestamp absoluto `-05:00`; probar cambiando zona horaria del dispositivo. |
| Carga lenta en 3G/4G | Media | < 1 MB sin audio; SVG + Lottie JSON livianos con lazy-load; fuentes `swap`; mapa `loading="lazy"`. |
| Quirks iOS Safari | Media | `100dvh`/`svh` con fallback; audio por gesto; prueba en iPhone real (F11). |
| RSVP duplicado | Media | Botón deshabilitado + flag localStorage; duplicados residuales se ignoran en Console. |
| Cambios de último minuto | Media | Textos centralizados en `content.js`. |
| Cuota Firebase agotada | Baja | Spark: 20k escrituras/día; sobrado para una invitación familiar. |
| Licencias de ilustraciones | Baja | Solo fuentes gratuitas explícitas (LottieFiles/Tabler); registrar en `DECISIONS.md`. |
| JSON Lottie pesado o incompatible | Baja | Fallback a SVG/PNG estático por cada animación (F5.5). |

---

## 15. Ejecución con modelos de IA pequeños

**① Archivos de contexto persistente:**
- `PLAN.md` → referencia maestra.
- `CONTEXT.md` → resumen corto. **Pegar al inicio de CADA prompt.**
- `DECISIONS.md` → bitácora; agregar una línea por decisión tomada.

**② Plantilla de prompt por fase:**
```
[CONTEXTO] ← pegar CONTEXT.md completo
[OBJETIVO] Ejecutar la Fase __ del PLAN.md: "<nombre>"
[TAREAS] ← copiar literalmente las subtareas de la fase (§12)
[ARCHIVOS ACTUALES] ← árbol de archivos (ls -R)
[RESTRICCIONES]
- Sin frameworks ni librerías nuevas (solo Firebase CDN en Fase 8
  y lottie-web en Fase 5)
- Animar solo transform/opacity; respetar prefers-reduced-motion
- Mobile-first; no modificar archivos fuera de esta fase
- Textos exactamente como están en js/data/content.js
[ENTREGABLE] ← copiar el entregable de la fase (§13)
[VERIFICACIÓN] ← cómo comprobar que quedó bien (§13)
```

**③ Reglas de orquestación:**
1. Una fase = una sesión de chat. Nunca dos fases en un prompt.
2. Verificar el criterio de aceptación antes de avanzar a la siguiente fase.
3. Pegar el árbol de archivos actual en cada prompt (`ls -R`).
4. Prohibido refactorizar fuera del alcance; anotar hallazgos en `DECISIONS.md`.
5. Fases con más riesgo de alucinación: F5 y F8 → incluir en el prompt los
   fragmentos exactos del plan (§5 y §10).
6. Si una fase falla dos veces, subdividirla en subtareas individuales.
