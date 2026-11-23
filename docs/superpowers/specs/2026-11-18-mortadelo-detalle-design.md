# Mortadelo detallado dentro de la maqueta

Fecha: 18 de noviembre de 2026. Aprobado por el usuario.

## Intención
La moto que se ve en `vespino-3d.html` tiene que ser el Vespino Mortadelo (primera serie, 1968) modelado en Blender con medidas oficiales y el mayor detalle posible, no la moto aproximada hecha por código. Para conseguirlo, la skill `vespino-blender` tiene que enseñar a modelar con más detalle.

## Objetivos
- Skill `vespino-blender` mejorada para subir el nivel de detalle en Blender.
- Mortadelo rehecho con detalle a partir de las fotos que ya hay en `referencias/mortadelo/`.
- El Mortadelo de Blender sustituye a la moto de código dentro de la maqueta actual.

## No objetivos (por ahora)
- Web nueva o visor aparte: el usuario lo descartó.
- Fotos nuevas, catálogo de despiece o generadores 3D de pago: solo se usan las fotos actuales.
- Humo del escape, puño con sonido, luces y entorno de la tienda: trabajo posterior, sobre la moto nueva.
- Otros modelos de Vespino en 3D.

## Antiobjetivos
- Que la maqueta deje de funcionar sin internet (el modelo va incrustado en el HTML).
- Que el motor deje de animarse o que fichas, despiece y quiz pierdan piezas.
- Presentar como medida real lo que es una estimación sobre foto.

## Restricciones
- Medidas oficiales del Mortadelo (`modelos/mortadelo.md`): 1130 mm entre ejes, 1760 x 610 x 1040 mm.
- Convención de la maqueta: metros, x adelante, y arriba, z a la izquierda del piloto, eje trasero en el origen.
- Ids de pieza de `vespino-sim/parts.js` (43 piezas).
- Se compila con la skill teardown (`build.mjs`) a un solo HTML.

## Enfoques considerados
- **A. Página nueva solo para los modelos de Blender.** Descartado por el usuario: tiene que ser la maqueta actual.
- **B. Cambiar la moto de la maqueta por la de Blender (elegido).** Piezas fijas desde el GLB; piezas móviles siguen siendo de código, recolocadas en las cotas del Mortadelo para que la cinemática siga funcionando.
- **C. Página nueva y luego migrar pestañas.** Descartado por lo mismo que A.

## Diseño
### Fase 1: skill
Añadir a `vespino-blender`: modelado por secciones con subdivisión para la chapa; calibración de fotos frontales y cenitales; lista de detalles por pieza (tornillería, cables, emblema, dibujo del neumático, aletas, rejillas); materiales (pintura con barniz, cromo, goma, aluminio); comparación render-foto desde el mismo ángulo; pasos de integración en la maqueta.

### Fase 2: modelo
Rehacer en `blender/mortadelo.blend` pieza a pieza siguiendo la skill. Zonas sin foto (interior del motor, trasera) quedan aproximadas y marcadas así en `modelos/mortadelo.md`.

### Fase 3: integración
- Exportar las piezas fijas en coordenadas de la maqueta y cargarlas en `bike.js` por id, incrustadas en el HTML.
- Piezas móviles (pistón, biela, cigüeñal, variador, correa, engranajes, ruedas, dirección) siguen generadas por código, con `AXLE`, `CRANK` y `DRIVEN` movidos a las cotas del Mortadelo.
- El cambio de color sigue funcionando sobre el material de pintura del GLB. Los accesorios de la pestaña Modelos que no encajen se adaptan o se quitan.

## Queda a criterio del constructor
Cómo se incrusta el GLB en el build, qué piezas concretas se dejan en código si no se pueden animar desde el GLB, presupuesto de triángulos por pieza.
