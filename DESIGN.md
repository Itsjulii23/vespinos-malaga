# Design

Reglas de diseño de la web de Vespinos de Málaga. Cada regla lleva su porqué y la frase del usuario que la originó.

## Typography

- **La tipografía es siempre retro. Los titulares usan `--titular` (Shrikhand), los números y etiquetas de placa usan `--placa` (Alfa Slab One) y el texto usa `--cuerpo` (Barlow). Nunca una sans moderna neutra (Inter, Figtree, Bricolage Grotesque, la fuente del sistema) como voz de titular.**
  Why: el club restaura Vespinos de los años 60 y 70 y su web tiene que oler a esa época (inferido y confirmado por el usuario al aprobar la regla).
  Las fuentes nuevas se instalan en el proyecto con `@fontsource/*` y se importan desde `src/styles.css`; no se cargan desde Google Fonts.
  Check: `src/app/estilos.spec.ts` falla si un `font` o `font-family` no usa uno de los tres tokens.
  <!-- 2026-11-23: "una web moderna y me gustaría que la tipografía sea retro" -->
