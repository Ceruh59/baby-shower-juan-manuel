# GUÍA GITHUB PAGES — Publicación paso a paso (Fase 0.3)

> Tiempo estimado: 10 minutos. Necesitas una cuenta de GitHub (gratis).
> Resultado: `https://TU-USUARIO.github.io/baby-shower-juan-manuel/`

---

## Paso 1 — Crear el repositorio

1. Entra a <https://github.com/new>
2. **Repository name:** `baby-shower-juan-manuel`
3. **Public** (GitHub Pages gratis requiere repo público en cuentas gratuitas)
4. NO marques "Add a README" (ya tenemos uno)
5. Clic en **"Create repository"**

## Paso 2 — Subir el código

Abre la terminal en la carpeta del proyecto y ejecuta:

```bash
cd baby-shower-juan-manuel
git init
git add .
git commit -m "Fase 0: estructura del proyecto y documentación"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/baby-shower-juan-manuel.git
git push -u origin main
```

> Reemplaza `TU-USUARIO` por tu nombre de usuario de GitHub.

## Paso 3 — Activar GitHub Pages

1. En el repo en GitHub: **Settings → Pages** (menú lateral izquierdo)
2. **Source:** "Deploy from a branch"
3. **Branch:** `main` · carpeta `/ (root)` → **Save**
4. Espera 1–2 minutos y refresca: aparecerá la URL pública
   `https://TU-USUARIO.github.io/baby-shower-juan-manuel/`

## Paso 4 — Verificar

1. Abre la URL en tu celular → debería mostrar la página (aun en construcción)
2. Envía el link por WhatsApp a un chat de prueba → verifica que aparezca
   la tarjeta con título e imagen (esto funcionará completo desde la Fase 1/10
   cuando existan los meta tags OG y `assets/images/og-image.jpg`)

> ⚠️ WhatsApp cachea la vista previa con fuerza. Si cambias la imagen OG y
> no se actualiza, comparte el link con un parámetro: `.../?v=2`

## Flujo de trabajo diario (para las siguientes fases)

Cada vez que termines una fase:

```bash
git add .
git commit -m "Fase N: descripción corta"
git push
```

Los cambios se publican solos en ~1 minuto. No hay paso extra de deploy.

---

## Notas

- **No** usamos Firebase Hosting: GitHub Pages es suficiente (HTTPS + CDN gratis).
- La carpeta `assets/audio/` con la música también se sube al repo (es pública,
  igual que toda la invitación).
- Si algún día quieres un dominio propio (ej. `babyshowerjuanmanuel.com`),
  se configura en Settings → Pages → Custom domain. NO es necesario.
