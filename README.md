# Vespinos de Málaga

Web del club Vespinos de Málaga, hecha con Angular. Es un proyecto independiente del modelado 3D del Vespino, que vive en [Itsjulii23/vespino](https://github.com/Itsjulii23/vespino).

Páginas: inicio, quiénes somos, quedadas (con una página por quedada), galería con visor a pantalla completa, patrocinadores y únete.

```
npm install
npm start                    # servidor local
npm test -- --watch=false
npm run build:pages          # build para GitHub Pages (base /vespinos-malaga/)
```

Se publica sola en GitHub Pages con cada cambio en `main` (Settings → Pages → Source = GitHub Actions).

## Cómo cambiar el contenido

Todo el texto vive en `src/app/datos/`, sin tocar código:

| Archivo | Qué contiene |
|---|---|
| `club.json` | Descripción, sede, Instagram y cifras |
| `quedadas.json` | Una entrada por quedada. Las futuras salen como "próximas" solas, según la fecha |
| `galeria.json` | Fotos de la galería, con su tamaño y pie |
| `patrocinadores.json` | Patrocinadores |

## Contenido provisional

- Las fotos de `public/img/provisional/` son SVG de relleno y se generan con `node scripts/generar-provisionales.mjs`. Para poner fotos reales, copia las imágenes a `public/img/` y cambia su ruta, ancho y alto en `galeria.json` y `quedadas.json`.
- Las quedadas con `"provisional": true` y los patrocinadores son de ejemplo. La web los marca con una etiqueta amarilla. En las quedadas desaparece al poner `"provisional": false`. En galería, patrocinadores y únete hay que borrar a mano el `<p class="etiqueta">` de su archivo en `src/app/paginas/`.
- Los datos reales (sede, unos 150 Vespinos, inauguración de octubre de 2025) salen de la noticia de El Español del 7 de octubre de 2025 y del listado del Ayuntamiento de Málaga.
- El escudo de la cabecera es un dibujo provisional con los colores del club.
