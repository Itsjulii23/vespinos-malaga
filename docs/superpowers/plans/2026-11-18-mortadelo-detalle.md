# Mortadelo detallado en la maqueta: plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Que la moto de `vespino-3d.html` sea el Mortadelo de Blender con detalle, con la skill `vespino-blender` mejorada para conseguirlo.

**Architecture:** Fase 1 amplía la skill. Fase 2 rehace `blender/mortadelo.blend` pieza a pieza con comprobaciones automáticas dentro de Blender (silueta contra foto, cotas, ids, triángulos). Fase 3 exporta las piezas fijas a un GLB en coordenadas de la maqueta, lo importa en `vespino-sim` (el build de teardown lo incrusta en base64), lo decodifica antes de `runLive()` y `bike.js` usa esas mallas por id; las piezas móviles siguen siendo de código, recolocadas en las cotas del Mortadelo.

**Tech Stack:** Blender 5.3 vía MCP (`bpy`, `bmesh`, numpy), three.js + GLTFLoader, build de teardown (esbuild, `.glb` → base64), Node 20, Playwright (en `~/.claude/skills/teardown/node_modules`).

**Spec:** `docs/superpowers/specs/2026-11-18-mortadelo-detalle-design.md`

## Global Constraints
- Medidas oficiales: 1130 mm entre ejes; 1760 x 610 x 1040 mm; neumático 2 1/4" x 18" (radio 0,2855 m); 49,77 cc, 38,4 x 43,0 mm.
- Solo las fotos de `referencias/mortadelo/` (ninguna foto nueva). Calibración de `perfil.jpg`: 0,002173 m/px, eje trasero px (189,405), delantero (709,409), suelo y=541.
- Coordenadas de la maqueta: metros, x adelante, y arriba, z a la izquierda del piloto, eje trasero en el origen. Blender: X adelante, Y izquierda, Z arriba; el exportador glTF con `export_yup=True` hace la conversión.
- Ids de pieza exactamente los 43 de `vespino-sim/parts.js`.
- La maqueta sigue siendo un solo HTML que funciona con `file://` y sin red.
- Presupuesto: moto completa < 150.000 triángulos; GLB < 4 MB.
- Lo estimado sobre foto se marca como estimado en `modelos/mortadelo.md`; nunca se presenta como medida oficial.

## Review Focus
- **Corte "cristal" y "sección"**: las mallas del GLB deben usar los materiales de la maqueta (los de `SHELLS`/`clipMats`), si no el corte no las afecta. Test en Task 9.
- **Cambio de color (pestaña Modelos)**: la pintura del GLB debe ser el material que cambia `setPaint`. Test en Task 9.
- **Abrir desde `file://` sin red**: el GLB va incrustado; nada se descarga. Test en Task 10.
- **Pieza sin malla**: si un id del catálogo no llega del GLB ni del código, clic/ficha/despiece fallan en silencio. Test en Task 8 y Task 10 (43 ids con malla).
- **Motor y correa descolocados** al mover `AXLE`, `CRANK`, `DRIVEN`: la correa debe seguir tocando las dos poleas y el pistón dentro del cilindro. Test en Task 9.

---

## Fase 1: skill

### Task 1: Ampliar la skill `vespino-blender`

**Files:**
- Modify: `.claude/skills/vespino-blender/SKILL.md`
- Modify: `.claude/skills/vespino-blender/modelos/mortadelo.md`

**Interfaces:**
- Produces: secciones `## Modelado por secciones`, `## Lista de detalles por pieza`, `## Materiales`, `## Comprobaciones automáticas`, `## Integración en la maqueta` que siguen las tareas 2-10.

- [ ] **Step 1:** Añadir `## Modelado por secciones`: chapa con malla base de baja densidad + Subdivision Surface (nivel 2 render, 1 visor) y loops de apoyo en los bordes; curvas en las tres direcciones tomando perfil de `perfil.jpg`, anchura de `frontal.jpg` y planta de `manillar-cenital.jpg`/`asiento-portaequipajes-cenital.jpg`.
- [ ] **Step 2:** Añadir `## Lista de detalles por pieza` (tabla id → detalles obligatorios): neumático con dibujo de bloques; llanta con perfil en U, 36 radios cruzados, niples y cubo con brazo de freno; horquilla con tapones y abrazaderas; faro con aro cromado y tornillo; manillar con puños estriados, manetas y cables; claxon con rejilla de lamas; velocímetro con esfera y aguja; cubierta con emblema "Vespino"; tapa de la correa con dos rejillas y emblema "Vespa"; cilindro con aletas; escape con abrazaderas; sillín con costura y muelles; portabultos de pletina; piloto con cristal y base cromada; tornillería visible en uniones.
- [ ] **Step 3:** Añadir `## Materiales`: nombres fijos `pintura`, `pintura_interior`, `cromo`, `aluminio`, `carter`, `acero`, `goma`, `asiento`, `cristal`, `piloto`, `esfera`, y su equivalencia con los materiales de `bike.js` (GREEN, GREEN2, CHROME, ALU, CASE, STEEL, RUBBER, DARK).
- [ ] **Step 4:** Añadir `## Comprobaciones automáticas` (funciones de `vespino_helpers`, ver Task 2) y `## Integración en la maqueta` (Tasks 7-9 en resumen: qué ids van en el GLB, transformación de coordenadas, cómo se cargan).
- [ ] **Step 5:** En `modelos/mortadelo.md`, añadir la calibración de `frontal.jpg` y de las cenitales (se rellena en Task 2) y la lista "aproximado por falta de foto": interior del motor, transmisión, parte trasera.
- [ ] **Step 6:** Verificar: `grep -c "^## " .claude/skills/vespino-blender/SKILL.md` ≥ 12. Commit `skill vespino-blender: modelado por secciones, detalles, materiales y comprobaciones`.

## Fase 2: modelo

### Task 2: Comprobaciones automáticas y calibración frontal/cenital

**Files:**
- Modify: texto `vespino_helpers` dentro de `blender/mortadelo.blend`
- Create: `blender/scripts/helpers.py` (copia en disco del mismo texto, para versionarlo)

**Interfaces:**
- Produces (en `vespino_helpers`):
  - `silhouette_iou(view: str, ids: list[str] | None = None) -> float`: render ortográfico de la vista (`'perfil'`) con la cámara alineada a la foto calibrada, máscara del modelo contra máscara de la foto (fondo amarillo fuera); devuelve IoU.
  - `check_dims() -> dict`: `{'wheelbase': m, 'length': m, 'height': m, 'width': m}` del modelo.
  - `check_parts() -> list[str]`: ids que faltan o sobran frente a los 43 de `parts.js` (leídos de `vespino-sim/parts.js` con regex).
  - `tri_count() -> int`.
  - `compare(view: str, path: str)`: guarda una imagen con foto y render lado a lado.
  - `FRONT_S: float`, `PF(px, py) -> (y, z)`: escala y conversión de `frontal.jpg`.

- [ ] **Step 1:** Escribir el test en Blender: `assert abs(check_dims()['wheelbase']-1.13)<0.005`, `assert check_parts()==[]`, `assert tri_count()<150000`, `assert silhouette_iou('perfil')>0.80` (el modelo actual debe pasarlo; es la línea base).
- [ ] **Step 2:** Ejecutarlo: falla con `NameError` (funciones no definidas).
- [ ] **Step 3:** Implementar las funciones. `FRONT_S` se obtiene midiendo en `frontal.jpg` el ancho entre extremos de puños y fijándolo a 0,61 m (anchura oficial); anotar en `mortadelo.md` como estimado.
- [ ] **Step 4:** Ejecutar el test: pasa. Guardar el IoU de partida en `mortadelo.md`.
- [ ] **Step 5:** Guardar `.blend`, escribir `blender/scripts/helpers.py`, commit.

### Task 3: Chapa detallada (chasis, trasera, cubierta, guardabarros-d, guardabarros-t)

**Files:** `blender/mortadelo.blend`

**Interfaces:** Consumes `vespino_helpers` (Task 2). Produces objetos con esos ids, material `pintura`, origen como hoy.

- [ ] **Step 1:** Test: `silhouette_iou('perfil', ['chasis','trasera','cubierta','guardabarros-d','guardabarros-t']) > 0.88`; ninguna de esas piezas es una extrusión plana (`max |normal.y|` de caras laterales < 0,98 en al menos el 30 % de caras).
- [ ] **Step 2:** Ejecutar: falla (las piezas actuales son extrusiones).
- [ ] **Step 3:** Rehacer con malla base + Subdivision Surface: bastidor en U con sección redondeada que se ensancha hacia la dirección; trasera con laterales abombados, tapa con hendidura y puerta embutida; cubierta con emblema "Vespino" en relieve; guardabarros con perfil en U, labio y tirante delantero.
- [ ] **Step 4:** Ejecutar el test y `compare('perfil', ...)`; mirar con `look` (tres cuartos, frente, arriba) frente a `tres-cuartos-delantero.jpg` y `frontal.jpg`. Pasa.
- [ ] **Step 5:** Guardar y commit `mortadelo: chapa detallada`.

### Task 4: Dirección y ruedas detalladas

**Files:** `blender/mortadelo.blend`

**Interfaces:** Ids `horquilla`, `manillar`, `faro`, `claxon`, `velocimetro`, `espejos`, `rueda-{t,d}-{neumatico,llanta,tambor}`. Origen de las piezas de dirección en el eje de dirección (`AX(125)`), ruedas en su eje.

- [ ] **Step 1:** Test: `silhouette_iou('perfil', ids_direccion+ids_ruedas) > 0.85`; neumático con ≥ 40 bloques de dibujo (contar islas de caras con material `goma` en la banda); llanta con 36 radios.
- [ ] **Step 2:** Ejecutar: falla (sin dibujo).
- [ ] **Step 3:** Modelar según la tabla de detalles de la skill, con `manillar-cenital.jpg`, `faro-y-tija.jpg`, `faro-claxon.jpg`, `cubo-delantero.jpg`, `despiece-horquilla.jpg`.
- [ ] **Step 4:** Test pasa; `look` frente a las fotos de detalle.
- [ ] **Step 5:** Commit `mortadelo: dirección y ruedas detalladas`.

### Task 5: Motor, transmisión y resto

**Files:** `blender/mortadelo.blend`

**Interfaces:** Ids restantes de `parts.js`. Polea conducida centrada en la toma trasera de la tapa: px (205,405) → maqueta (0,035, 0,29); cigüeñal px (347,409) → maqueta (0,343, 0,287). Estas dos cotas las usa Task 9.

- [ ] **Step 1:** Test: `check_parts()==[]`; cilindro de diámetro interior 38,4 mm ± 0,5; carrera de la biela 43 mm ± 0,5 (distancia muñequilla-eje ×2); `silhouette_iou('perfil') > 0.88` de la moto completa; `tri_count() < 150000`.
- [ ] **Step 2:** Ejecutar: falla al menos el IoU global o la polea conducida descolocada.
- [ ] **Step 3:** Detallar tapa de correa (`carter.jpg`), escape, amortiguador, pedales, caballete, sillín (`asiento-portaequipajes-cenital.jpg`), portabultos, piloto; interior del motor por ficha; mover `conducida`/`embrague`/`correa` a la toma trasera.
- [ ] **Step 4:** Test pasa.
- [ ] **Step 5:** Commit `mortadelo: motor, transmisión y resto detallados`.

### Task 6: Materiales y render de control

**Files:** `blender/mortadelo.blend`, `docs/mortadelo-blender.png`

- [ ] **Step 1:** Test: todos los materiales de la moto están en la lista fija de la skill (Task 1, Step 3); ninguna malla sin material.
- [ ] **Step 2:** Ejecutar: falla (nombres actuales `blanco_crudo`, `gris_carter`…).
- [ ] **Step 3:** Renombrar/unificar materiales; pintura con capa de barniz (coat), goma con dibujo, cromo.
- [ ] **Step 4:** Test pasa; render 1400x800 a `docs/mortadelo-blender.png`.
- [ ] **Step 5:** Commit.

## Fase 3: integración en la maqueta

### Task 7: Exportar GLB en coordenadas de la maqueta

**Files:**
- Create: `vespino-sim/mortadelo.glb`
- Create: `blender/scripts/export_maqueta.py`
- Create: `vespino-sim/tests/glb.test.mjs`

**Interfaces:**
- Produces: `vespino-sim/mortadelo.glb` con un nodo por id (nombre = id), raíz trasladada para que el eje trasero quede en el origen (Blender X += 0,565), materiales con los nombres de la skill, modificadores aplicados.

- [ ] **Step 1:** Test Node (`node --test vespino-sim/tests/glb.test.mjs`), que lee el chunk JSON del GLB sin dependencias: los nombres de nodo incluyen los ids fijos (ver Task 8) ; tamaño < 4 MB; `min` del accesor de posición del neumático trasero centrado en x≈0 ± 0,01.
- [ ] **Step 2:** Ejecutar: falla (no existe el archivo).
- [ ] **Step 3:** Implementar `export_maqueta.py` (se ejecuta con `exec` desde MCP): duplica en una escena temporal, traslada, exporta con `export_yup=True`, `export_apply=True`, sin cámaras ni luces.
- [ ] **Step 4:** Test pasa.
- [ ] **Step 5:** Commit.

### Task 8: Cargar el GLB antes de construir la moto

**Files:**
- Create: `vespino-sim/mortadelo.js`
- Modify: `vespino-sim/main.js`

**Interfaces:**
- Produces: `loadMortadelo(): Promise<void>` y `mortadeloPart(id: string): THREE.Object3D | null` (clon de las mallas de ese id, con `userData.part = id` en cada malla, materiales todavía los del GLB). `GLB_IDS: string[]`: ids que vienen del GLB = `chasis, trasera, cubierta, guardabarros-t, guardabarros-d, portabultos, sillin, piloto, deposito, horquilla, claxon, manillar, espejos, faro, velocimetro, carter, tapa-volante, filtro, carburador, cubierta-correa, escape, amortiguador, caballete, cilindro, culata, bujia`. El resto (ruedas, pistón, biela, cigüeñal, volante, poleas, muelle, correa, embrague, engranajes, pedales) sigue en código.
- `main.js`: `loadMortadelo().then(runLive)`.

- [ ] **Step 1:** Test Playwright `vespino-sim/tests/page.test.mjs` (abre `teardown-out/dist/vespino-sim.html` por `file://`): sin errores de consola; `window.__vespino?.glbIds.length === 26`.
- [ ] **Step 2:** Compilar (`node "<ruta-de-teardown>/sims/build.mjs" ./vespino-sim`) y ejecutar: falla.
- [ ] **Step 3:** Implementar con `import glb from './mortadelo.glb'` (string base64 del build), `GLTFLoader.parse` sobre el ArrayBuffer; exponer `window.__vespino = {glbIds}` solo para tests.
- [ ] **Step 4:** Compilar y test pasa.
- [ ] **Step 5:** Commit.

### Task 9: `bike.js` usa las mallas del Mortadelo

**Files:**
- Modify: `vespino-sim/bike.js` (bloques `P('<id>')` de los ids de `GLB_IDS`; constantes `AXLE`, `CRANK`, `DRIVEN`)
- Modify: `vespino-sim/kin.js` si alguna cota del motor depende de esas constantes
- Modify: `vespino-sim/learn.js` (accesores de la pestaña Modelos que dejen de encajar)

**Interfaces:** Consumes `mortadeloPart(id)`, `GLB_IDS`. Equivalencia de materiales: `pintura`→GREEN, `pintura_interior`→GREEN2, `cromo`→CHROME, `aluminio`→ALU, `carter`→CASE, `acero`→STEEL, `goma`→RUBBER, `asiento`→DARK; el resto se queda con el suyo.

- [ ] **Step 1:** Ampliar `page.test.mjs`: los 43 ids devuelven al menos una malla en `bike.partMeshes`; tras `setPaint('#ff0000')` la pintura del chasis es roja; tras `setCut('section')` las mallas de `trasera` tienen `clippingPlanes` activos; distancia entre centros de rueda 1,13 ± 0,005; la correa (`correa`) toca ambas poleas (distancia de su bounding box a cada polea < 5 mm).
- [ ] **Step 2:** Compilar y ejecutar: falla.
- [ ] **Step 3:** `AXLE.front = [1.13, 0.2855]`, `AXLE.rear = [0, 0.2855]`, `CRANK = [0.343, 0.287]`, `DRIVEN = [0.035, 0.29]`; sustituir la geometría de cada id de `GLB_IDS` por `mortadeloPart(id)` añadida al mismo grupo (`body`, `front`…), remapeando materiales; ajustar accesorios de `learn.js`.
- [ ] **Step 4:** Compilar y test pasa; mirar la maqueta (vista general, despiece, corte, pestaña Motor, modo conducción) con Playwright en capturas.
- [ ] **Step 5:** Commit.

### Task 10: Publicar la maqueta nueva

**Files:**
- Modify: `vespino-3d.html` (copia de `teardown-out/dist/vespino-sim.html`)
- Modify: `README.md`, `docs/*.png` que cambien

- [ ] **Step 1:** Test: `page.test.mjs` contra `vespino-3d.html` por `file://` con la red bloqueada (`context.route('**', r => r.request().url().startsWith('file:') ? r.continue() : r.abort())`): carga sin errores y los 43 ids tienen malla.
- [ ] **Step 2:** Copiar el build y ejecutar el test: pasa.
- [ ] **Step 3:** Capturas nuevas para el README (vista general, despiece), README actualizado ("la moto es ahora el Mortadelo de Blender").
- [ ] **Step 4:** Commit y push a `main` (el usuario pidió subir a GitHub).
