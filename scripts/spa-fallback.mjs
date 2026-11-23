import { copyFileSync } from 'node:fs';
import { resolve } from 'node:path';

// GitHub Pages sirve 404.html en rutas desconocidas (p. ej. recargar /vespino/maqueta).
const carpeta = resolve(import.meta.dirname, '..', 'dist', 'web', 'browser');
copyFileSync(resolve(carpeta, 'index.html'), resolve(carpeta, '404.html'));
console.log('404.html creado');
