import { Routes } from '@angular/router';
import { MaquetaComponent } from './maqueta/maqueta.component';
import { PortadaComponent } from './portada/portada.component';

export const routes: Routes = [
  { path: '', component: PortadaComponent },
  { path: 'maqueta', component: MaquetaComponent },
  { path: '**', redirectTo: '' },
];
