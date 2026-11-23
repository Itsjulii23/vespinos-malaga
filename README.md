# Vespinos de Málaga

Web en Angular. Es un proyecto independiente del modelado 3D: la maqueta del Vespino vive en [Itsjulii23/vespino](https://github.com/Itsjulii23/vespino) y esta web la enseña dentro de un iframe en la ruta `/maqueta`.

```
npm install
npm start                    # servidor local
npm test -- --watch=false
npm run build:pages          # build para GitHub Pages (base /vespinos-malaga/)
```

Se publica sola en GitHub Pages con cada cambio en `main` (Settings → Pages → Source = GitHub Actions).
