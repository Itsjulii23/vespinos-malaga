import { GALERIA, HISTORIA, QUEDADAS, formatearFecha, partesFecha, quedadasPasadas, quedadasProximas } from './datos';

describe('datos del club', () => {
  it('las quedadas tienen slugs únicos', () => {
    const slugs = QUEDADAS.map((q) => q.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('separa las quedadas futuras de las pasadas sin perder ninguna', () => {
    expect(quedadasProximas().length + quedadasPasadas().length).toBe(QUEDADAS.length);
    const hoy = new Date().toISOString().slice(0, 10);
    expect(quedadasProximas().every((q) => q.fecha >= hoy)).toBe(true);
    expect(quedadasPasadas().every((q) => q.fecha < hoy)).toBe(true);
  });

  it('la próxima quedada es la más cercana', () => {
    const fechas = quedadasProximas().map((q) => q.fecha);
    expect(fechas).toEqual([...fechas].sort());
  });

  it('cada foto de la galería tiene medidas y pie', () => {
    for (const f of GALERIA) {
      expect(f.ancho).toBeGreaterThan(0);
      expect(f.alto).toBeGreaterThan(0);
      expect(f.pie.length).toBeGreaterThan(0);
    }
  });

  it('la historia va por orden de año y sus fotos existen en la galería', () => {
    const anios = HISTORIA.map((h) => h.anio);
    expect(anios).toEqual([...anios].sort());
    for (const h of HISTORIA.filter((x) => x.foto)) {
      expect(GALERIA.some((f) => f.src === h.foto)).toBe(true);
    }
  });

  it('formatea las fechas en español', () => {
    expect(formatearFecha('2026-12-20')).toBe('20 de diciembre de 2026');
    expect(partesFecha('2026-12-20')).toEqual({ dia: '20', mes: 'DIC', anio: '2026' });
  });
});
