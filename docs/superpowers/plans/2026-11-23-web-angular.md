# Web Angular para la maqueta Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Una web Angular con portada y ruta `/maqueta` que muestra la maqueta existente en un iframe, publicada en GitHub Pages.

**Architecture:** Proyecto Angular standalone en `web/` con dos rutas. `vespino-3d.html` (autocontenido, 2,8 MB) se copia sin modificar a `web/public/maqueta/index.html` en el build. La ruta `/maqueta` la incrusta en un `<iframe>`.

**Tech Stack:** Angular (última estable, `ng new --standalone --routing --style=css`), Node 24, GitHub Actions + Pages.

**Spec:** `docs/superpowers/specs/2026-11-23-web-angular-design.md`

## Global Constraints

- No se modifica `vespino-3d.html` ni `vespino-sim/`.
- Sin servidor ni base de datos.
- Rutas: `/` (portada) y `/maqueta`.
- `base-href` de producción: `/vespino/`; el enlace https://itsjulii23.github.io/vespino/ debe seguir abriendo la web.
- Textos en español; datos de la portada solo del README (49,77 cc, 38,4 × 43 mm, Mortadelo 1968).
- Repo público: no subir `referencias/` ni fotos de terceros.

## Review Focus

- Visitar `/maqueta` directamente (recarga) en Pages: debe funcionar (404.html = copia de index.html).
- Pantalla móvil estrecha: el iframe ocupa el alto visible y el botón Volver no tapa los controles.
- URL del iframe respeta el `base-href` (`/vespino/maqueta/index.html`), no una ruta absoluta.
- Sin JavaScript de Angular cargado aún, la portada no debe quedar en blanco (título y enlace en `index.html`).
- Teclado/sonido: el iframe recibe foco con un clic; el botón de la portada indica "haz clic en la maqueta para activar el sonido".

---

### Task 1: Esqueleto Angular y copia de la maqueta

**Files:**
- Create: `web/` (con `ng new web --standalone --routing --style=css --skip-git`)
- Create: `web/scripts/copy-maqueta.mjs`
- Modify: `web/package.json` (scripts `prebuild` y `prestart` ejecutan la copia)
- Modify: `.gitignore` (añadir `web/public/maqueta/`, `web/dist/`)

**Interfaces:**
- Produces: `public/maqueta/index.html` generado desde `../vespino-3d.html`; servido en `<base>/maqueta/index.html`.

- [ ] **Step 1:** Ejecutar `ng new web --standalone --routing --style=css --skip-git --ssr=false` y comprobar con `npm run build` en `web/` que compila.
- [ ] **Step 2:** `copy-maqueta.mjs`: copia `../vespino-3d.html` a `public/maqueta/index.html` (crea la carpeta); falla con error claro si no existe el origen.
- [ ] **Step 3:** Enlazar la copia en `prebuild`/`prestart`; añadir al `.gitignore`.
- [ ] **Step 4:** Verificar: `npm run build` y comprobar que existe `dist/web/browser/maqueta/index.html` (tamaño ≈ 2,8 MB).
- [ ] **Step 5:** Commit `feat(web): esqueleto Angular y copia de la maqueta`.

### Task 2: Ruta /maqueta con iframe

**Files:**
- Create: `web/src/app/maqueta/maqueta.component.ts` (+ `.html`, `.css`)
- Create: `web/src/app/maqueta/maqueta.component.spec.ts`
- Modify: `web/src/app/app.routes.ts`

**Interfaces:**
- Produces: `MaquetaComponent` (standalone), ruta `{ path: 'maqueta', component: MaquetaComponent }`.

- [ ] **Step 1: Test** `maqueta.component.spec.ts`: `it('incrusta la maqueta con ruta relativa al base-href')` — el `iframe` existe y su `src` termina en `maqueta/index.html` y no empieza por `/`; `it('tiene botón Volver a la portada')` — hay un `a[routerLink="/"]` con texto "Volver".
- [ ] **Step 2:** `npm test -- --watch=false` → FALLA (componente no existe).
- [ ] **Step 3:** Implementar `MaquetaComponent`: iframe a pantalla completa (`100dvh`, sin borde, `title="Maqueta 3D del Vespino"`), URL con `DomSanitizer.bypassSecurityTrustResourceUrl` construida con `document.baseURI` + `maqueta/index.html`; botón Volver flotante arriba a la izquierda; registrar la ruta.
- [ ] **Step 4:** `npm test -- --watch=false` → PASA.
- [ ] **Step 5:** Commit `feat(web): ruta /maqueta con la maqueta en iframe`.

### Task 3: Portada

**Files:**
- Create: `web/src/app/portada/portada.component.ts` (+ `.html`, `.css`)
- Create: `web/src/app/portada/portada.component.spec.ts`
- Modify: `web/src/app/app.routes.ts`, `web/src/app/app.html`, `web/src/index.html` (título "Vespino 3D", `lang="es"`, enlace de respaldo dentro de `<app-root>`)

**Interfaces:**
- Consumes: ruta `/maqueta` (Task 2).
- Produces: `PortadaComponent`, ruta `''`.

- [ ] **Step 1: Test** `portada.component.spec.ts`: `it('muestra un botón "Ver en 3D" que lleva a /maqueta')`; `it('muestra la ficha técnica con 49,77 cc y 38,4 × 43 mm')`.
- [ ] **Step 2:** Ejecutar tests → FALLAN.
- [ ] **Step 3:** Implementar la portada: hero con título y botón "Ver en 3D" (aviso de clic para activar sonido), sección historia (texto condensado del README, fuentes citadas), sección ficha técnica (cilindrada, diámetro × carrera, modelo y año), pie con créditos a @elvarofficial y fuentes. Una imagen del Mortadelo solo si ya está en el repo (captura propia); si no, sin imagen. CSS responsive, paleta en la línea del README (decisión del implementador).
- [ ] **Step 4:** Tests → PASAN; `npm run build` sin errores.
- [ ] **Step 5:** Revisar a mano con `npm start`: portada → botón → maqueta funciona y Volver regresa. Commit `feat(web): portada con historia y ficha técnica`.

### Task 4: Despliegue en GitHub Pages

**Files:**
- Create: `.github/workflows/pages.yml`
- Modify: `web/package.json` (script `build:pages`: `ng build --base-href /vespino/` y copia de `index.html` a `404.html`)
- Modify: `README.md` (enlace y sección "La web")

- [ ] **Step 1:** Workflow: en push a `main`, `actions/checkout`, Node 24, `npm ci` y `npm run build:pages` en `web/`, subir `web/dist/web/browser` con `upload-pages-artifact`, `deploy-pages` (permisos `pages: write`, `id-token: write`).
- [ ] **Step 2:** Verificar en local: `npm run build:pages` y comprobar que existen `404.html` y `maqueta/index.html` en `dist`.
- [ ] **Step 3:** Pedir a la usuaria que cambie en GitHub: Settings → Pages → Source = "GitHub Actions" (paso manual).
- [ ] **Step 4:** Push a `main` y comprobar https://itsjulii23.github.io/vespino/ (portada) y `/vespino/maqueta` con recarga (Review Focus 1).
- [ ] **Step 5:** Actualizar README y commit `feat(web): despliegue en Pages y README`.
