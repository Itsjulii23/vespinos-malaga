// Genera las fotos provisionales (SVG) de la galería y las quedadas.
// Cuando el club pase fotos reales, se sustituyen estos archivos y se corrige galeria.json.
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const carpeta = resolve(import.meta.dirname, '..', 'public', 'img', 'provisional');
mkdirSync(carpeta, { recursive: true });

const paletas = [
  ['#2F7D4F', '#17131D'], ['#5B2D86', '#F1C232'], ['#17131D', '#2F7D4F'],
  ['#F1C232', '#5B2D86'], ['#3E8F63', '#F2F5F0'], ['#7440A3', '#17131D'],
];
const formatos = [[1200, 900], [900, 1200], [1200, 1200], [1600, 900], [1200, 900], [900, 1200],
  [1200, 1200], [1200, 900], [1600, 900], [900, 1200], [1200, 900], [1200, 1200]];

formatos.forEach(([w, h], i) => {
  const [fondo, tinta] = paletas[i % paletas.length];
  const r = Math.min(w, h) * 0.22;
  const n = String(i + 1).padStart(2, '0');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
<rect width="${w}" height="${h}" fill="${fondo}"/>
<circle cx="${w / 2}" cy="${h / 2 - h * 0.05}" r="${r}" fill="none" stroke="${tinta}" stroke-width="${r * 0.18}" opacity=".85"/>
<circle cx="${w / 2}" cy="${h / 2 - h * 0.05}" r="${r * 0.45}" fill="${tinta}" opacity=".85"/>
<text x="${w / 2}" y="${h - h * 0.12}" text-anchor="middle" font-family="system-ui, sans-serif" font-size="${Math.round(h * 0.055)}" font-weight="700" fill="${tinta}">Foto provisional ${n}</text>
</svg>`;
  writeFileSync(resolve(carpeta, `foto-${n}.svg`), svg);
});
console.log(`${formatos.length} fotos provisionales en ${carpeta}`);
