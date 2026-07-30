# GUÍA FIREBASE — Configuración paso a paso (Fase 0.2)

> Tiempo estimado: 15 minutos. Solo necesitas una cuenta de Google.
> Todo queda en la capa gratuita (Spark). No se pide tarjeta de crédito.

---

## Paso 1 — Crear el proyecto

1. Entra a <https://console.firebase.google.com>
2. Clic en **"Agregar proyecto"** / **"Add project"**
3. Nombre: `baby-shower-juan-manuel` → Continuar
4. **DESACTIVA** Google Analytics (no lo necesitamos) → Crear proyecto
5. Espera ~30 segundos → Continuar

## Paso 2 — Crear la base de datos Firestore

1. En el menú lateral: **Build → Firestore Database**
2. Clic en **"Crear base de datos"**
3. Selecciona **"Comenzar en modo de producción"** → Siguiente
   - ⚠️ NO uses "modo de prueba": sus reglas expiran a los 30 días y la
     invitación dejaría de guardar RSVP.
4. Ubicación: elige la más cercana disponible (ej. `us-east1` o `southamerica-east1`
   si aparece) → Habilitar

## Paso 3 — Publicar las reglas de seguridad

1. En Firestore Database → pestaña **"Reglas"**
2. Borra todo el contenido y pega EXACTAMENTE esto:

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

3. Clic en **"Publicar"**

**Qué hace esto:** cualquiera puede ENVIAR una confirmación válida
(nombre + sí/no), pero NADIE puede leer la lista de invitados desde la web,
ni editar ni borrar respuestas. Solo tú las ves desde la consola.

## Paso 4 — Registrar la app web y obtener la configuración

1. Clic en el ⚙️ (arriba a la izquierda) → **"Configuración del proyecto"**
2. Baja hasta **"Tus apps"** → clic en el ícono web `</>`
3. Nombre de la app: `invitacion-web` → **Registrar app**
   (NO actives Firebase Hosting si lo ofrece)
4. Aparecerá un bloque con `const firebaseConfig = { ... }`
5. Copia cada valor dentro de `js/firebase/config.js` de este proyecto,
   reemplazando los `'PEGA_AQUI'`
6. Clic en "Seguir en la consola"

## Paso 5 — App Check (anti-bots, opcional pero recomendado)

> Si esto te resulta confuso, puedes omitirlo: las reglas del Paso 3 ya te
> protegen bien. Puedes volver a activarlo después.

1. Menú lateral: **Build → App Check**
2. Clic en **"Comenzar"** → selecciona tu app web → **reCAPTCHA v3**
3. Registra el sitio y guarda la clave del sitio (site key)
4. En **APIs → Firestore**, activa **"Aplicar"** (enforce)

> Nota para la Fase 8: si App Check queda activado, hay que agregar su
> inicialización en `js/firebase/db.js` con la site key. Anótalo en
> `DECISIONS.md`.

## Paso 6 — Cómo consultar las respuestas (panel de padres)

Cuando empiecen a llegar confirmaciones:

1. Entra a <https://console.firebase.google.com> → tu proyecto
2. **Build → Firestore Database → pestaña "Datos"**
3. Abre la colección **`rsvps`**
4. Cada documento es una respuesta: `name` (nombre), `attending`
   (true = asistirá, false = no podrá), `createdAt` (fecha de respuesta)
5. Para contar asistentes: revisa los documentos con `attending: true`
6. Para borrar una respuesta de prueba: clic en el documento → menú ⋮ →
   **"Borrar documento"**

---

## Checklist de esta guía

- [ ] Proyecto creado (sin Analytics)
- [ ] Firestore creado en modo producción
- [ ] Reglas publicadas (Paso 3)
- [ ] `js/firebase/config.js` con valores reales
- [ ] App Check (opcional) — si lo activaste, registrarlo en `DECISIONS.md`
- [ ] Prueba de escritura (se hace en la Fase 8, no ahora)
