import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

// Regla de DESIGN.md (Typography): toda la tipografía sale de los tres tokens retro.
const TOKENS = ['--titular', '--placa', '--cuerpo'];

describe('tipografía retro', () => {
  const css = readFileSync(resolve(process.cwd(), 'src', 'styles.css'), 'utf8');
  const declaraciones = [...css.matchAll(/(?:^|[\s;{])(font-family|font)\s*:\s*([^;}]+)/g)].map((m) => m[2].trim());

  it('hay declaraciones de fuente que comprobar', () => {
    expect(declaraciones.length).toBeGreaterThan(0);
  });

  it('cada font y font-family usa uno de los tokens de DESIGN.md', () => {
    const fuera = declaraciones.filter(
      (valor) => valor !== 'inherit' && !TOKENS.some((t) => valor.includes(`var(${t})`)),
    );
    expect(fuera).toEqual([]);
  });
});
