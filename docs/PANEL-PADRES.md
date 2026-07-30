# PANEL DE PADRES — Cómo ver las confirmaciones (RSVP)

> Para Cristian y Luisa. No necesitas saber de tecnología: son 5 minutos.
> Aquí verás quién confirmó asistencia al Baby Shower de Juan Manuel.

---

## ¿Dónde están las respuestas?

Cuando un invitado llena el formulario de la invitación, su respuesta se
guarda automáticamente en **Firebase Console** (la base de datos del
proyecto). Solo ustedes pueden verla: la página no muestra la lista a
nadie más.

## Paso 1 — Entrar a la consola

1. Abre en el navegador (computador o celular):
   <https://console.firebase.google.com>
2. Inicia sesión con la misma cuenta de Google con la que se creó el
   proyecto.
3. Haz clic en el proyecto **`baby-shower-juan-manuel`**.

## Paso 2 — Abrir la lista de respuestas

1. En el menú de la izquierda, haz clic en **"Firestore Database"**
   (dentro de la sección *Build* / *Compilación*).
2. Asegúrate de estar en la pestaña **"Datos"**.
3. Si el proyecto tiene más de una base de datos, selecciona **`juanmanuel`**
   en el selector superior.
4. Verás una colección llamada **`rsvps`**. Haz clic en ella.

Cada fila (documento) es **una respuesta de un invitado**, con tres datos:

| Campo | Qué significa |
|---|---|
| `name` | El nombre que escribió el invitado |
| `attending` | `true` = ✅ sí asistirá · `false` = ❌ no podrá |
| `createdAt` | Fecha y hora en que respondió |

## Paso 3 — Contar los asistentes

**Forma rápida (a simple vista):**
- Recorre la lista y cuenta los documentos con `attending: true`.
  Esos son los que confirmaron. Los `false` son los que avisaron que no
  podrán (también agradece su respuesta 💛).

**Forma ordenada (filtro):**
1. Encima de la lista, haz clic en **"Filtrar"** (o en el ícono de filtro).
2. Campo: `attending` · Condición: `==` · Valor: `true`
   (escríbelo como *booleano*, no como texto).
3. La lista mostrará **solo los que sí asisten**. El contador de
   documentos te da el número de asistentes.

**Ordenar por fecha:**
1. Clic en el encabezado o en "Ordenar por" → campo `createdAt`.
2. Descendente = las respuestas más recientes primero.

## Paso 4 — Borrar una respuesta de prueba

Durante las pruebas técnicas puede aparecer una respuesta llamada
**"PRUEBA TÉCNICA - BORRAR"** (o cualquier prueba que ustedes hagan):

1. Haz clic sobre ese documento.
2. Arriba a la derecha, menú **⋮** → **"Borrar documento"**.
3. Confirmar. Listo, no afecta nada más.

> ⚠️ No borres respuestas reales: no hay papelera de reciclaje.

## Dudas frecuentes

**¿Me llega un correo o aviso cuando alguien confirma?**
No. Hay que entrar a la consola a revisar. Con revisar una vez al día
(especialmente la última semana) es suficiente.

**¿Puedo verlo desde el celular?**
Sí, la consola funciona en el navegador del celular, aunque se ve más
cómoda en un computador.

**¿Los invitados pueden ver quién más confirmó?**
No. La base de datos está configurada para que NADIE pueda leer la lista
desde la web (reglas de seguridad del Paso 3 de `GUIA-FIREBASE.md`).
Solo ustedes, con su cuenta de Google.

**¿Qué pasa si alguien confirma dos veces?**
La página intenta evitarlo (recuerda al invitado en su propio
dispositivo), pero si ocurre un duplicado, simplemente bórralo (Paso 4).

**¿Hasta cuándo debo revisar?**
Sugerencia: haz el conteo final el **viernes 7 de agosto de 2026**, una
semana antes del evento, para cuadrar logística con el salón.

---

## Checklist

- [ ] Puedo entrar a Firebase Console y abrir la colección `rsvps`
- [ ] Entiendo qué significa `attending: true` / `false`
- [ ] Sé filtrar y contar los asistentes
- [ ] Borré la respuesta de prueba "PRUEBA TÉCNICA - BORRAR"
- [ ] Tengo anotada la fecha del conteo final: **viernes 7-ago-2026**
