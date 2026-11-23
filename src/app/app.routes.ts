import { Routes } from '@angular/router';
import { Inicio } from './paginas/inicio';
import { QuienesSomos } from './paginas/quienes-somos';
import { Quedadas } from './paginas/quedadas';
import { QuedadaDetalle } from './paginas/quedada-detalle';
import { Galeria } from './paginas/galeria';
import { Patrocinadores } from './paginas/patrocinadores';
import { Unete } from './paginas/unete';

const marca = 'Vespinos de Málaga';

export const routes: Routes = [
  { path: '', component: Inicio, title: `${marca}, club de Vespino` },
  { path: 'quienes-somos', component: QuienesSomos, title: `Quiénes somos | ${marca}` },
  { path: 'quedadas', component: Quedadas, title: `Quedadas | ${marca}` },
  { path: 'quedadas/:slug', component: QuedadaDetalle, title: `Quedada | ${marca}` },
  { path: 'galeria', component: Galeria, title: `Galería | ${marca}` },
  { path: 'patrocinadores', component: Patrocinadores, title: `Patrocinadores | ${marca}` },
  { path: 'unete', component: Unete, title: `Únete | ${marca}` },
  { path: '**', redirectTo: '' },
];
