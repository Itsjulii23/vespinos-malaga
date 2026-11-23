# Web Angular para la maqueta del Vespino

Diseño corto, aprobado por la usuaria el 23-11-2026 (opción 1: iframe).

## Intención
Que la maqueta 3D se abra desde una web hecha en Angular, con un clic en un enlace. Hoy la maqueta ya está en https://itsjulii23.github.io/vespino/ pero sin web alrededor.

## Objetivos
- Web Angular con portada (hero del Mortadelo, historia, ficha técnica) y botón "Ver en 3D".
- Ruta `/maqueta` con la maqueta a pantalla completa y botón para volver.
- Publicación en GitHub Pages con una acción de GitHub; el enlace actual sigue funcionando.

## No objetivos
- No se toca el simulador ni `vespino-sim/`. No hay servidor ni base de datos.
- No se porta el simulador a Angular (opciones 2 y 3 descartadas por ahora).

## Approaches
1. **iframe en un componente (elegida)**: no toca el simulador, rápida y segura. Contra: no comparte estado con Angular; el sonido y el teclado necesitan un clic dentro del iframe.
2. Portar a componente nativo: integración total, pero trabajo grande y riesgo de romper lo que funciona.
3. Web Component `<vespino-sim>`: vía intermedia, pero exige refactorizar el simulador.

## Diseño
- Proyecto Angular nuevo en `web/`, componentes standalone, router con dos rutas (`/`, `/maqueta`).
- La maqueta (`vespino-3d.html` (autocontenido; no usa `vespino-sim/` ni `models/`)) se copia sin modificar a `public/sim/` en el build.
- La ruta `/maqueta` muestra un `<iframe>` a pantalla completa (DomSanitizer para la URL) y un botón "Volver".
- Estilo en la línea del README y la maqueta (decisión mía).
- Despliegue: GitHub Actions construye `web/` con `base-href` `/vespino/` y publica en Pages.

## Queda al constructor
Textos exactos de la portada (salen del README y las fuentes citadas), paleta, y cómo copiar la maqueta en el build.
