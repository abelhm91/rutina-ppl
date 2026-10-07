# Rutina PPL — app instalable

Rutina Empuje / Tirón / Piernas con registro de kg y repeticiones, modo entrenamiento y temporizador de descanso. Funciona sin conexión una vez instalada.

## 1. Publicarla gratis con GitHub Pages (una sola vez)

1. Entra en https://github.com/new
   - **Repository name:** `rutina-ppl`
   - Márcalo como **Public**.
   - Pulsa **Create repository**.
2. En la página del repositorio nuevo, pulsa **uploading an existing file**.
3. Descomprime el .zip en tu ordenador y arrastra **todo el contenido de la carpeta** (no la carpeta en sí): `index.html`, `manifest.webmanifest`, `sw.js`, `README.md` y la carpeta `icons`.
4. Pulsa **Commit changes**.
5. Ve a **Settings → Pages**.
   - En **Branch** elige `main` y la carpeta `/ (root)`.
   - Pulsa **Save**.
6. Espera 1 o 2 minutos y recarga. Aparecerá tu dirección, del estilo:
   `https://TU-USUARIO.github.io/rutina-ppl/`

Esa es la dirección que pasas a tus amigos.

## 2. Instalarla en Android

1. Abre la dirección en **Chrome**.
2. Pulsa el menú **⋮** y luego **Instalar aplicación** (o **Añadir a pantalla de inicio**).
3. Aparece el icono de la barra con discos en tu pantalla de inicio. Se abre a pantalla completa, como una app normal.

En iPhone: abre la dirección en **Safari**, pulsa **Compartir** y después **Añadir a pantalla de inicio**.

## 3. Cómo se guardan los datos

- Cada persona tiene sus propios kg y repeticiones, guardados **en su propio móvil**.
- No hace falta cuenta ni conexión en el gimnasio.
- Si alguien borra los datos de Chrome o desinstala la app, pierde lo que había apuntado.

## 4. Actualizar la app

Sube el `index.html` nuevo al repositorio y sustituye al anterior. La próxima vez que tus amigos abran la app con conexión, recibirán la versión nueva.

Si cambias los iconos, abre `sw.js` y sube el número de versión: `rutina-ppl-v1` → `rutina-ppl-v2`.
