import { RECORTES, BLOG, articulosPorMes, GALERIA, HISTORIA, QUEDADAS, fotoDe, formatearFecha, partesFecha, quedadasPasadas, quedadasProximas } from './datos';

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

  it('el blog tiene slugs únicos, va del más nuevo al más antiguo y sus fotos existen', () => {
    const slugs = BLOG.map((a) => a.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    const fechas = BLOG.map((a) => a.fecha);
    expect(fechas).toEqual([...fechas].sort().reverse());
    for (const a of BLOG.filter((x) => x.foto)) {
      expect(fotoDe(a.foto)).toBeDefined();
    }
  });

  it('los Vespinos recortados tienen medidas, pie y créditos', () => {
    for (const r of RECORTES) {
      expect(r.ancho).toBeGreaterThan(0);
      expect(r.pie.length).toBeGreaterThan(0);
      expect(r.autor && r.licencia && r.fuente).toBeTruthy();
    }
  });

  it('formatea las fechas en español', () => {
    expect(formatearFecha('2026-12-20')).toBe('20 de diciembre de 2026');
    expect(partesFecha('2026-12-20')).toEqual({ dia: '20', mes: 'DIC', anio: '2026' });
  });

  it('agrupa el blog por meses, del más reciente al más antiguo, sin perder artículos', () => {
    const grupos = articulosPorMes();
    expect(grupos.map((g) => g.clave)).toEqual([...grupos.map((g) => g.clave)].sort().reverse());
    expect(grupos.reduce((n, g) => n + g.articulos.length, 0)).toBe(BLOG.length);
    expect(grupos[0].titulo).toMatch(/^[A-ZÁÉÍÓÚ]\S* de \d{4}$/);
    for (const g of grupos) for (const a of g.articulos) expect(a.fecha.startsWith(g.clave)).toBe(true);
  });
});
