import club from './club.json';
import quedadasJson from './quedadas.json';
import patrocinadoresJson from './patrocinadores.json';
import galeriaJson from './galeria.json';

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
}

export const CLUB = club;
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
