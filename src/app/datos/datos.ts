import club from './club.json';
import quedadasJson from './quedadas.json';
import patrocinadoresJson from './patrocinadores.json';
import galeriaJson from './galeria.json';
import historiaJson from './historia.json';
import blogJson from './blog.json';
import recortesJson from './recortes.json';

export interface Quedada {
  slug: string;
  titulo: string;
  fecha: string;
  fechaTexto?: string;
  lugar: string;
  resumen: string;
  texto: string[];
  foto: string;
  provisional: boolean;
}

export interface Patrocinador {
  nombre: string;
  web: string;
  descripcion: string;
}

export interface Foto {
  src: string;
  ancho: number;
  alto: number;
  pie: string;
  autor?: string;
  licencia?: string;
  fuente?: string;
  /** Foto original, para el fondo difuminado de la portada. */
  fondo?: string;
}

export interface Hito {
  anio: string;
  titulo: string;
  texto: string;
  foto?: string;
}

export interface Articulo {
  slug: string;
  titulo: string;
  fecha: string;
  fechaTexto?: string;
  resumen: string;
  texto: string[];
  foto?: string;
  provisional?: boolean;
}

/** Artículos del blog, del más reciente al más antiguo. */
export const BLOG: Articulo[] = [...(blogJson as Articulo[])].sort((a, b) => b.fecha.localeCompare(a.fecha));

export interface GrupoMes {
  clave: string;
  titulo: string;
  articulos: Articulo[];
}

/** Artículos agrupados por mes, del mes más reciente al más antiguo. */
export function articulosPorMes(articulos: Articulo[] = BLOG): GrupoMes[] {
  const grupos: GrupoMes[] = [];
  for (const a of articulos) {
    const clave = a.fecha.slice(0, 7);
    let g = grupos.find((x) => x.clave === clave);
    if (!g) {
      const titulo = new Intl.DateTimeFormat('es-ES', { month: 'long', year: 'numeric' }).format(new Date(`${clave}-15T12:00:00`));
      g = { clave, titulo: titulo.charAt(0).toUpperCase() + titulo.slice(1), articulos: [] };
      grupos.push(g);
    }
    g.articulos.push(a);
  }
  return grupos;
}

/** La foto de la galería que tiene esa ruta, con su tamaño y pie. */
export function fotoDe(src?: string): Foto | undefined {
  return GALERIA.find((f) => f.src === src);
}

/** Vespinos recortados, sin fondo, para el carrusel de la portada. */
export const RECORTES: Foto[] = recortesJson;

/** El Vespino recortado que tiene esa ruta. */
export function recorteDe(src: string): Foto | undefined {
  return RECORTES.find((f) => f.src === src);
}

export const CLUB = club;
export const HISTORIA: Hito[] = historiaJson;
export const PATROCINADORES: Patrocinador[] = patrocinadoresJson;
export const GALERIA: Foto[] = galeriaJson;

/** Todas las quedadas, de la más reciente a la más antigua. */
export const QUEDADAS: Quedada[] = [...(quedadasJson as Quedada[])].sort((a, b) =>
  b.fecha.localeCompare(a.fecha),
);

const hoy = () => new Date().toISOString().slice(0, 10);

/** Quedadas que aún no han pasado, la más cercana primero. */
export function quedadasProximas(): Quedada[] {
  return QUEDADAS.filter((q) => q.fecha >= hoy()).reverse();
}

export function quedadasPasadas(): Quedada[] {
  return QUEDADAS.filter((q) => q.fecha < hoy());
}

export function formatearFecha(iso: string): string {
  return new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }).format(
    new Date(`${iso}T12:00:00`),
  );
}

/** Piezas de la matrícula: día, mes abreviado y año. */
export function partesFecha(iso: string): { dia: string; mes: string; anio: string } {
  const f = new Date(`${iso}T12:00:00`);
  return {
    dia: String(f.getDate()),
    mes: new Intl.DateTimeFormat('es-ES', { month: 'short' }).format(f).replace('.', '').toUpperCase(),
    anio: String(f.getFullYear()),
  };
}
