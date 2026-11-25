# Vespinos de Málaga

La web del club **Vespinos de Málaga**: una asociación de aficionados que rescata Vespinos de la chatarra, los restaura y los vuelve a poner en la carretera. Tienen sede propia en Teatinos, unos 150 Vespinos entre todos los socios y salidas solidarias durante el año.

La web sirve para tres cosas: que cualquiera sepa cuándo es la próxima quedada, que vea fotos de los Vespinos y que sepa cómo escribir al club o apuntarse. La mayoría de las visitas llegarán desde el móvil, por un enlace de Instagram, así que está pensada para eso.

Está hecha con Angular y no tiene servidor ni base de datos. Es un proyecto independiente del modelado 3D del Vespino, que vive en [Itsjulii23/vespino](https://github.com/Itsjulii23/vespino).

## Qué hay dentro

- **Inicio**: presentación del club con Vespinos que se relevan solos, la línea del tiempo del Vespino (de 1968 a hoy, con un Vespino que baja por la carretera al hacer scroll) y la próxima quedada.
- **Quiénes somos**: la historia del club, la sede y las cifras.
- **Quedadas**: el listado y una página para cada una. Las futuras salen como "próximas" solas, según la fecha.
- **Galería**: mosaico de fotos con un visor a pantalla completa.
- **Patrocinadores**: las empresas que apoyan al club.
- **Únete**: cómo hacerse socio.

## Cómo se ve

El estilo busca algo moderno por dentro y retro por fuera, como los Vespinos de los años 60 y 70 que restauran.

- **Colores**: verde y morado (los del escudo), blanco roto de fondo y un negro apagado para el texto. Los define `:root` al principio de `src/styles.css`. Si hay que retocar un color, se cambia ahí y se aplica en toda la web.
- **Tipografía**: siempre retro. Shrikhand para los titulares, Alfa Slab One para números y placas de matrícula, y Zilla Slab para el texto. Las fuentes van instaladas en el proyecto, no se piden a Google.
- **Reglas de diseño**: están en [DESIGN.md](DESIGN.md). Léelas antes de tocar la interfaz. Un test (`src/app/estilos.spec.ts`) falla si alguien mete una tipografía que no sea de las tres.
- **Para quién es y por qué**: [PRODUCT.md](PRODUCT.md) cuenta quién usa la web y qué se quiere conseguir con ella.

## Ponerlo en marcha

Necesitas [Node.js](https://nodejs.org) y npm.

```
npm install        # solo la primera vez
npm start          # abre un servidor local en http://localhost:4200
```

Mientras `npm start` está en marcha, cada cambio que guardes se refleja solo en el navegador.

Otros comandos útiles:

```
npm test -- --watch=false    # pasa los tests una vez
npm run build                # compila la web en dist/
npm run build:pages          # compila para GitHub Pages
```

## Cómo cambiar el contenido

El texto y las fotos no están metidos en el código. Viven en archivos JSON dentro de `src/app/datos/`, que se pueden editar sin saber programar. Basta con abrir el archivo, cambiar lo que haga falta y guardar.

| Archivo | Qué contiene |
|---|---|
| `club.json` | Descripción, sede, Instagram y cifras |
| `quedadas.json` | Una entrada por quedada |
| `galeria.json` | Las fotos de la galería, con su tamaño y pie |
| `historia.json` | Los años de la línea del tiempo de la portada. Una foto es opcional y debe estar en `galeria.json` |
| `patrocinadores.json` | Los patrocinadores |

### Añadir una quedada

Copia una entrada de `quedadas.json`, pégala debajo (con su coma) y cambia los datos:

```json
{
  "slug": "ruta-de-primavera",
  "titulo": "Ruta de primavera",
  "fecha": "2027-03-14",
  "lugar": "Por confirmar",
  "resumen": "Ruta en grupo con parada para comer.",
  "texto": ["Primer párrafo.", "Segundo párrafo."],
  "foto": "img/ruta-primavera.jpg"
}
```

El `slug` es la parte de la dirección web (`/quedadas/ruta-de-primavera`), así que en minúsculas y con guiones. La fecha va como `año-mes-día`. Cuando pasa esa fecha, la quedada deja de ser "próxima" sin que tengas que hacer nada.

### Añadir fotos a la galería

1. Copia las imágenes a la carpeta `public/img/`.
2. Añade una línea en `galeria.json` con la ruta, el ancho y alto en píxeles, y un pie de foto.

Hay que poner el tamaño real de cada foto para que la galería no dé saltos mientras cargan.

## Contenido de ejemplo

Todavía faltan cosas reales: fotos del club, logos de patrocinadores y fechas de quedadas. Mientras tanto, la web usa material de relleno, y está marcado para que nadie lo confunda con información verdadera.

- **Fotos de ejemplo**: están en `public/img/vespinos/` y son fotos reales de Vespinos con licencia libre, sacadas de Wikimedia Commons. Sus autores y licencias están en `galeria.json` y se enseñan en la galería, en "Créditos de las fotos". Para usar fotos del club, cambia la ruta, el ancho y el alto en `galeria.json` y `quedadas.json`, y borra de la galería el campo de autor y licencia de las que sustituyas.
- **Quedadas y patrocinadores de ejemplo**: la web los marca con una etiqueta verde de "ejemplo". En las quedadas desaparece al poner `"provisional": false`. En galería, patrocinadores y únete hay que borrar a mano el `<p class="etiqueta">` del archivo correspondiente en `src/app/paginas/`.
- **El escudo** de la cabecera es un dibujo provisional con los colores del club, hasta que haya un archivo oficial.

Lo que sí es real viene de la noticia de El Español del 7 de octubre de 2025 y del listado del Ayuntamiento de Málaga: la sede, los unos 150 Vespinos y la inauguración de octubre de 2025.

Faltan por decidir el grupo de Facebook, el horario de la sede y la cuota de socio.

## Publicar la web

Se publica sola en GitHub Pages. Cada vez que se sube un cambio a la rama `main`, GitHub compila la web y la actualiza. La configuración es una sola vez: en el repositorio, **Settings → Pages → Source = GitHub Actions**.

`build:pages` usa la base `/vespinos-malaga/` porque la web vive en una subcarpeta de GitHub Pages, y crea una copia de `index.html` como `404.html` para que recargar una página interior no dé error.

## Estructura del proyecto

```
src/
  app/
    paginas/      una página por archivo (inicio, quedadas, galería…)
    datos/        los JSON de contenido
  styles.css      colores, tipografías y estilos de toda la web
public/img/       fotos y favicon
scripts/          utilidades (404 para GitHub Pages)
```

## Contacto con el club

Instagram: [@vespinos_de_malaga](https://www.instagram.com/vespinos_de_malaga/)
Sede: calle Shanti Andía, 13, local 2, 29006 Málaga
