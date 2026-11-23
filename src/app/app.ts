import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CLUB } from './datos/datos';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
})
export class App {
  protected readonly club = CLUB;
  protected readonly anio = new Date().getFullYear();
  protected readonly enlaces = [
    { ruta: '/quienes-somos', texto: 'Quiénes somos' },
    { ruta: '/quedadas', texto: 'Quedadas' },
    { ruta: '/galeria', texto: 'Galería' },
    { ruta: '/patrocinadores', texto: 'Patrocinadores' },
  ];
}
