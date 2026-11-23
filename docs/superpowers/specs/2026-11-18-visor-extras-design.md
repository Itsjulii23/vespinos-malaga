# Visor del Mortadelo: examinar piezas, humo, puño, luces y tienda

Fecha: 18-11-2026. Petición del usuario: «poder examinar cada pieza y rotarla de la forma que quieras; humo real del escape; un puño en el que, según la fuerza que le des, suene el Vespino; encender las luces; que esté en un entorno como las fotos del local». Instrucción vigente: hacer siempre lo recomendado sin preguntar.

## Objetivos
1. **Examinar en 3D**: desde la ficha de cualquier pieza, un visor a pantalla completa con solo esa pieza, que se gira libremente en cualquier eje (rotación tipo trackball), con zoom, giro automático y volver a la posición inicial.
2. **Humo del escape**: partículas que salen de la punta del silenciador, más densas y en bocanadas al acelerar, que suben, se expanden y se desvanecen; en conducción se quedan atrás.
3. **Puño del acelerador**: un puño dibujado que se gira arrastrando; cuanto más se gira, más vueltas y más suena el motor. Al soltarlo vuelve al ralentí, como un puño de verdad. Al usarlo se enciende el sonido.
4. **Luces**: botón «Luces» (tecla L) que enciende el faro (cristal luminoso y foco que ilumina el suelo) y el piloto trasero.
5. **Entorno de tienda**: suelo de porcelánico claro en baldosas grandes, pared gris azulada con cuadros negros con relieves geométricos, una zona de suelo hidráulico, escalera con barandilla de acero y una papelera negra. En modo conducción vuelve la carretera.

## No objetivos
- No se incrustan las fotos del local ni sus logotipos (son de terceros y el repositorio es público): el entorno se construye con geometría y texturas dibujadas por código, inspiradas en las fotos.
- No se añade un modelo de sonido grabado: se sigue generando con Web Audio.

## Enfoques considerados
- **Visor de pieza**: (a) un segundo renderer en una ventana aparte; (b) el mismo renderer pintando otra escena mientras el visor está abierto. Elegido (b): comparte el mapa de entorno y los materiales, no crea un segundo contexto WebGL.
- **Humo**: (a) sprites sueltos; (b) un único `THREE.Points` con shader propio; (c) quads instanciados encarados a la cámara. Se empezó con (b) y se pasó a (c): muchas GPU limitan `gl_PointSize` muy por debajo del tamaño de una bocanada vista de cerca. Sigue siendo una sola llamada de dibujo.
- **Sonido**: mantener los osciladores y añadir pulsos de escape (ruido modulado a la frecuencia de explosión) y un volumen que depende de la apertura del puño, no solo de las vueltas.

## Diseño
- Archivos nuevos en `vespino-sim/`: `inspect.js` (visor), `smoke.js` (humo), `shop.js` (entorno), `grip.js` (puño, DOM + SVG). `bike.js` expone `lights.set(on)` y `lights.state()`; `stage.js` crea tienda y carretera y expone `setEnv('shop'|'road')`; `live.js` lo conecta todo.
- Interfaz: la fila «Conducción / Sonido» pasa a tres botones «Conducción / Sonido / Luces». En la ficha de pieza, botón «Examinar en 3D». El puño va abajo a la derecha de la zona central.
- `window.LIVE.set` acepta `lights`, `inspect`, `throttle` para pruebas y capturas.

## Resultado
Hecho el 18-11-2026. 15 pruebas en verde (4 del GLB, 11 de la página). Las pruebas de la página esperan tiempo de simulación (`LIVE.T`) y no tiempo de reloj, porque con SwiftShader la escena va a 1-2 fps.

## Pruebas
Ampliar `tests/page.test.mjs`: el visor abre con las mallas de la pieza y se cierra; las luces cambian la intensidad del foco; hay humo visible con el motor en marcha y más a más vueltas; el puño sube las vueltas y al soltar vuelven al ralentí; la tienda se ve fuera de conducción y la carretera en conducción; sin errores de consola.
