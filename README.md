# Jardines de Caleta X — Plano interactivo de solares

Aplicación web (HTML + CSS + JS puro, sin dependencias de build) para que cualquier
visitante explore el plano de la urbanización con zoom/paneo, vea qué solares están
**disponibles**, **reservados** o **vendidos**, y para que un administrador marque
y desmarque solares en tiempo real.

## Archivos

```
index.html                       → estructura de la página
styles.css                       → estilos (tema azul y blanco)
script.js                        → toda la lógica (datos, zoom, admin, persistencia)
assets/plano-jardines-caleta-x.jpg → plano recortado del PDF original, en alta resolución
```

## Cómo probarlo ahora mismo

No necesitas servidor ni instalar nada: descarga la carpeta completa y haz doble
clic en `index.html`. También puedes subir estos 4 archivos a cualquier hosting
estático (Netlify, Vercel, GitHub Pages, tu propio servidor, etc.) y funcionará igual.

## Acceso de administrador

- Botón **"Acceso admin"** arriba a la derecha.
- Contraseña por defecto: `caletax2026`
- Cámbiala en `script.js`, línea con `ADMIN_PASSWORD`, **antes de publicar el sitio**.

> ⚠️ Esta contraseña vive en el código del navegador (front-end), así que no es
> seguridad real — cualquiera que abra el código fuente puede leerla. Es suficiente
> para evitar que un visitante casual edite el plano, pero si esto va a manejar
> ventas reales con dinero de por medio, lo correcto es mover esa validación a un
> backend/API propio.

## Cómo marcar un solar como reservado o vendido

1. Entra como admin.
2. En el panel de administración, busca el número de solar o fíltralo por estado.
3. Cambia el menú **Estado** del solar (Disponible / Reservado / Vendido). Esto se
   refleja al instante en el contador del encabezado y en la lista de "Reservas".
4. (Opcional) Pulsa **"Ubicar en mapa"**, haz clic sobre el plano en el punto exacto
   del solar, y aparecerá un marcador (●/✕) ahí mismo — así puedes "tachar" visualmente
   el solar directamente sobre el dibujo. Puedes reubicarlo o quitarlo cuando quieras.

Cualquier visitante (sin iniciar sesión) puede hacer zoom, buscar un solar por número,
y ver la lista de "Reservas" — pero no puede cambiar nada.

## Sobre el "tiempo real"

Los datos se guardan en `localStorage` del navegador y se sincronizan automáticamente
entre **pestañas del mismo navegador/dispositivo** usando `BroadcastChannel`. Esto ya
da una experiencia de tiempo real para pruebas, demos, o si solo un dispositivo
administra el plano.

**Para que los cambios del admin se vean en tiempo real en los celulares/computadoras
de *otros* visitantes**, necesitas una base de datos compartida en la nube. Dejé todo
listo para conectar **Firebase Realtime Database** (gratis):

1. Crea un proyecto en https://console.firebase.google.com y activa "Realtime Database".
2. En `index.html`, antes de `<script src="script.js">`, agrega:
   ```html
   <script src="https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js"></script>
   <script src="https://www.gstatic.com/firebasejs/10.12.2/firebase-database-compat.js"></script>
   ```
3. En `script.js`, busca el bloque comentado que dice **"FIREBASE (OPCIONAL)"**,
   pega la configuración de tu proyecto y descomenta el código indicado.

Con eso, cada cambio del admin se sube a Firebase y se empuja al instante a todos los
navegadores conectados, sin que nadie tenga que recargar la página.

## Notas

- Los 156 solares y sus áreas (m²) ya están cargados según la planilla del plano original.
- Todos empiezan en estado "Disponible".
- El botón "Exportar datos (JSON)" del panel admin descarga una copia de respaldo del
  estado completo (útil antes de cambiar de contraseña, de hosting, o de pasar a Firebase).
