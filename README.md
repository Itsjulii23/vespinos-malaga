# Vespinos de Málaga

La web del club **Vespinos de Málaga**, un grupo de aficionados que rescata Vespinos de la chatarra, los restaura y los vuelve a sacar a la carretera. Tienen sede propia en Teatinos desde octubre de 2025 y, entre todos los socios, juntan unos 150 Vespinos.

La web está pensada para que cualquiera sepa cuándo es la próxima quedada, vea los Vespinos del club, lea sus novedades y sepa cómo apuntarse. Casi todo el mundo llegará desde el móvil, por un enlace de Instagram, así que todo se diseña primero para el móvil.

Está hecha con Angular y no tiene servidor ni base de datos: todo el contenido vive en archivos JSON dentro del proyecto. Es independiente del modelado 3D del Vespino, que está en [Itsjulii23/vespino](https://github.com/Itsjulii23/vespino).

## Páginas

- **Inicio.** Es la página más trabajada. De arriba abajo:
  - Una portada a pantalla completa. Los Vespinos, recortados y sin fondo, suben desde el borde inferior por un arco, se posan sobre un sol retro a rayas y bajan por el otro lado. Cambian cada 4 segundos, marcados por una barrita que se llena, y se paran si pasas el ratón por encima. Detrás se ve una foto difuminada del Vespino que toca, bajo una capa oscura.
  - Una cinta de texto en movimiento.
  - "Qué hacemos": tres fotos grandes con su color (taller, carretera y sede).
  - "Cómo restauramos": una banda oscura. El Vespino pasa de chatarra gris a color mientras bajas por los cuatro pasos.
  - La historia del Vespino de 1968 a hoy: una fila de tarjetas que se desliza de lado, con un Vespino que avanza por una carretera según el año. En el ordenador también se puede arrastrar con el ratón.
  - Curiosidades, los últimos artículos del blog, dónde está la sede, la próxima quedada y una llamada final para unirse.
- **Quiénes somos:** la historia del club, la sede y las cifras.
- **Quedadas:** el listado y una página para cada una. Las que todavía no han pasado salen como "próximas" solas, según la fecha.
- **Blog:** artículos del club agrupados por meses, con un filtro por mes y una página para cada artículo.
- **Galería:** un mosaico de fotos con visor a pantalla completa y los créditos de cada foto.
- **Patrocinadores** y **Únete**.

La cabecera se queda fija arriba al hacer scroll. Al cambiar de página hay un fundido suave, y quien tiene activado "reducir movimiento" en su sistema ve la web sin animaciones.

## El estilo

La idea es una web moderna por dentro y retro por fuera, como los Vespinos de los 60 y 70 que restaura el club.

- **Colores:** verde y morado, los del club, con un blanco roto de fondo, un negro apagado para el texto y un verde claro de faro para los detalles. Están todos al principio de `src/styles.css`, en `:root`. Si cambias uno ahí, cambia en toda la web.
- **Letras:** siempre retro. Shrikhand para los titulares, Alfa Slab One para números, etiquetas y placas, y Zilla Slab para el texto. Las fuentes están instaladas en el proyecto, no se cargan de Google.
- **Reglas de diseño:** están en [DESIGN.md](DESIGN.md) y hay que leerlas antes de tocar la interfaz. Un test (`src/app/estilos.spec.ts`) falla si alguien usa una letra que no sea una de las tres.
- **Para quién es la web y qué se busca con ella:** está en [PRODUCT.md](PRODUCT.md).

## Ponerla en marcha

Hace falta [Node.js](https://nodejs.org) con npm.

```
npm install        # solo la primera vez
npm start          # servidor local en http://localhost:4200
```

Con `npm start` en marcha, cualquier cambio que guardes aparece solo en el navegador.

```
npm test -- --watch=false    # pasa los tests una vez
npm run build                # compila la web en dist/
npm run build:pages          # compila para GitHub Pages
```

## Cambiar el contenido

Los textos y las fotos no están dentro del código: viven en `src/app/datos/`, en archivos JSON que se pueden editar sin saber programar. Se abre el archivo, se cambia el texto entre comillas y se guarda. Ojo con las comas entre entradas: si falta o sobra una, la web no compila y el error dice en qué línea está.

| Archivo | Qué contiene |
|---|---|
| `club.json` | Nombre, lema, descripción, sede, Instagram, cifras, "Qué hacemos", los pasos de la restauración, las curiosidades y las palabras de la cinta |
| `quedadas.json` | Una entrada por quedada |
| `blog.json` | Los artículos del blog |
| `galeria.json` | Las fotos de la galería, con su tamaño, pie y créditos |
| `historia.json` | Los años de la historia del Vespino que salen en la portada |
| `recortes.json` | Los Vespinos sin fondo del carrusel de la portada |
| `patrocinadores.json` | Los patrocinadores |

### Añadir una quedada

Copia una entrada de `quedadas.json`, pégala debajo (separada con una coma) y cambia los datos:

```json
{
  "slug": "ruta-de-primavera",
  "titulo": "Ruta de primavera",
  "fecha": "2027-03-14",
  "lugar": "Por confirmar",
  "resumen": "Ruta en grupo con parada para comer.",
  "texto": ["Primer párrafo.", "Segundo párrafo."],
  "foto": "img/vespinos/vespino-04.jpg",
  "provisional": false
}
```

El `slug` es el final de la dirección (`/quedadas/ruta-de-primavera`), en minúsculas y con guiones. La fecha va como `año-mes-día`. Cuando pasa la fecha, la quedada deja de ser "próxima" sin que tengas que tocar nada.

### Escribir un artículo del blog

Igual que una quedada, pero en `blog.json`:

```json
{
  "slug": "ruta-solidaria-de-navidad",
  "titulo": "Así fue la ruta solidaria de Navidad",
  "fecha": "2026-12-20",
  "resumen": "Una frase que se lee en la tarjeta del blog.",
  "texto": ["Primer párrafo.", "Segundo párrafo."],
  "foto": "img/vespinos/vespino-06.jpg"
}
```

El blog ordena y agrupa los artículos por mes a partir de la `fecha`, así que no importa en qué orden estén en el archivo. La `foto` es opcional y tiene que estar también en `galeria.json`. Los artículos con `"provisional": true` llevan la etiqueta "Ejemplo".

### Añadir fotos

1. Copia las fotos a `public/img/`. Mejor en JPG o WebP y que no pasen de unos 1600 píxeles de ancho.
2. Añade una entrada en `galeria.json` con la ruta, el ancho y el alto en píxeles y un pie de foto.

El tamaño tiene que ser el real, para que la página no dé saltos mientras cargan las fotos.

### Cambiar los Vespinos de la portada

El carrusel usa fotos recortadas, sin fondo, en formato WebP transparente, guardadas en `public/img/recortes/`. Cada una tiene su entrada en `recortes.json` con su tamaño, su nombre y, en `fondo`, la foto original, que es la que sale difuminada detrás. Puedes poner tantos Vespinos como quieras: el círculo se reparte solo.

## Contenido de ejemplo

Faltan cosas reales del club, y mientras tanto la web usa material de relleno marcado para que nadie lo confunda con información verdadera.

- **Logo:** el de la cabecera es provisional, un rótulo dibujado en SVG dentro de `src/app/app.html`. El logo oficial está en `public/img/logo/`, pero todavía no se usa.
- **Fotos:** las de `public/img/vespinos/` y `public/img/recortes/` son fotos reales de Vespinos con licencia libre, sacadas de Wikimedia Commons. Sus autores y licencias están en `galeria.json` y `recortes.json` y se muestran en la web, como piden esas licencias. Los recortes son fotos modificadas (se les ha quitado el fondo), y la web lo indica. Cuando lleguen las fotos del club, se cambian las rutas y se borran los créditos de las que se sustituyan.
- **Quedadas, artículos y patrocinadores:** los de ejemplo llevan la etiqueta "ejemplo". En quedadas y blog desaparece al quitar `"provisional": true`. En galería, patrocinadores y únete hay que borrar a mano el `<p class="etiqueta">` del archivo correspondiente en `src/app/paginas/`.

Lo que sí es real sale de la noticia de El Español del 7 de octubre de 2025 y del listado del Ayuntamiento de Málaga: la sede, los unos 150 Vespinos y la inauguración de octubre de 2025. Los datos de la historia del Vespino vienen de Wikipedia.

Quedan por decidir el grupo de Facebook, el horario de la sede y la cuota de socio.

## Publicar

La web se publica sola en GitHub Pages: cada vez que se sube un cambio a la rama `main`, GitHub la compila y la actualiza en unos minutos. Solo hace falta configurarlo una vez, en el repositorio: **Settings → Pages → Source = GitHub Actions**.

`build:pages` compila con la base `/vespinos-malaga/`, porque la web vive en una subcarpeta de GitHub Pages, y copia `index.html` como `404.html` para que recargar una página interior no dé error.

## Estructura

```
src/
  app/
    paginas/      una página o pieza por archivo (inicio, blog, carrusel, historia…)
    datos/        los JSON de contenido y el código que los lee
    app.html      cabecera, logo y pie
  styles.css      colores, letras y estilos de toda la web
public/img/       fotos, recortes y logo
scripts/          el 404 para GitHub Pages
```

## El club

Instagram: [@vespinos_de_malaga](https://www.instagram.com/vespinos_de_malaga/)
Sede: calle Shanti Andía, 13, local 2, 29006 Málaga
