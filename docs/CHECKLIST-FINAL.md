# CHECKLIST FINAL — QA y Publicación (Fase 11)

> Última revisión antes de difundir la invitación.
> URL de producción: <https://ceruh59.github.io/baby-shower-juan-manuel/>

---

## 1. Verificaciones técnicas ya realizadas ✅

Estas pruebas ya se hicieron en desarrollo (29-jul-2026); no hace falta
repetirlas:

- [x] Todos los recursos cargan correctamente (HTML, 5 CSS, 10 JS,
      Lottie JSON, imágenes, audio) — 23/23 con HTTP 200
- [x] Sintaxis de los 10 archivos JS validada (sin errores)
- [x] Countdown: la fecha `2026-08-15T16:00:00-05:00` corresponde
      exactamente a **sábado 15 de agosto de 2026, 4:00 p.m. en Colombia**
- [x] Firestore — reglas de seguridad probadas vía API:
      - Lectura anónima de `rsvps` → **rechazada** (403) ✅
      - Crear RSVP con datos inválidos → **rechazado** (403) ✅
      - Crear RSVP válido → **aceptado** (200) ✅
- [x] Peso total sin audio: **328 KB** (presupuesto: < 1 MB)
- [x] Audio optimizado: **2.9 MB** AAC (presupuesto: < 3 MB), canción completa
- [x] Imagen Open Graph creada: 1200×630, **58 KB** (presupuesto: < 200 KB)
- [x] Accesibilidad: contraste AA/AAA según PLAN §7, `:focus-visible`,
      skip-link, labels, `aria-label`, `role="status"`, foco inicial en el
      diálogo de bienvenida
- [x] Lazy loading verificado: mapa (`loading="lazy"`), Lottie
      (IntersectionObserver), audio (`preload="none"`)

## 2. Pruebas en dispositivos reales (pendientes — hazlas tú)

> Son las más importantes: la mayoría de invitados abrirá desde WhatsApp
> en celular. Tiempo estimado: 15 minutos.

### 2.1 En tu iPhone y/o Android

- [ ] Abrir la URL en el navegador del celular (Safari/Chrome)
- [ ] Aparece la bienvenida → tap en **"Ver invitación"** → entra la
      animación de salida
- [ ] **La música empieza a sonar** tras el tap (si no, el botón flotante
      🎵 debe funcionar al tocarlo)
- [ ] El osito y el elefantito se ven **animados** (no estáticos)
- [ ] El countdown muestra días/horas/min/seg correctos y avanza
- [ ] El mapa carga y el botón **"Cómo llegar"** abre Google Maps
- [ ] Scroll completo sin errores ni elementos cortados

### 2.2 Vista previa en WhatsApp (Fase 10.4)

- [ ] Envía el link a un chat de prueba (a ti mismo o a un familiar)
- [ ] La tarjeta de vista previa muestra: título "Baby Shower de Juan
      Manuel 🧸", descripción y **la imagen con el osito y el elefantito**
- [ ] Abrir el link DESDE WhatsApp (navegador interno) y repetir 2.1
- [ ] ⚠️ Si la imagen no aparece o quedó vieja en caché: comparte
      `https://ceruh59.github.io/baby-shower-juan-manuel/?v=2`

### 2.3 RSVP end-to-end en la página (Fase 11.3)

- [ ] En la invitación (celular), escribe tu nombre + elige "Sí, ahí
      estaré" → **Enviar respuesta**
- [ ] Aparece el bloque "¡Gracias!" con el check animado
- [ ] Recarga la página → el formulario ya NO aparece (solo el agradecimiento)
- [ ] En Firebase Console → Firestore → colección `rsvps` aparece tu
      respuesta (guía: `docs/PANEL-PADRES.md`)
- [ ] **Borra** tu RSVP de prueba Y el documento
      **"PRUEBA TÉCNICA - BORRAR"** (creado en la verificación técnica):
      clic en el documento → menú ⋮ → "Borrar documento"

### 2.4 Prueba de escritorio (opcional, 2 min)

- [ ] Abrir la URL en un computador: la columna se ve centrada con nubes
      decorativas a los lados, todo legible

## 3. Difusión 🎉

- [ ] Todas las pruebas anteriores pasaron
- [ ] Compartir el link por WhatsApp a los invitados:
      `https://ceruh59.github.io/baby-shower-juan-manuel/`
- [ ] Revisar las confirmaciones una vez al día en Firebase Console
      (guía: `docs/PANEL-PADRES.md`)
- [ ] Conteo final de asistentes: **viernes 7 de agosto de 2026**

---

### Si algo falla

| Síntoma | Qué revisar |
|---|---|
| La música no suena | Es normal si el navegador bloquea el autoplay: el invitado toca el botón 🎵. Verifica que `assets/audio/musica.m4a` esté subida al repo |
| El formulario dice "Hubo un problema" | Revisa en Firebase Console que las reglas del Paso 3 de `GUIA-FIREBASE.md` sigan publicadas y no hayan expirado |
| La vista previa de WhatsApp no muestra imagen | Verifica que `assets/images/og-image.jpg` esté en el repo y prueba con `?v=2` al final del link |
| Los animalitos no se animan | Se ven estáticos si el invitado tiene "reducir movimiento" activo (es el comportamiento correcto) o si el JSON no cargó; los PNG de respaldo se muestran automáticamente |
