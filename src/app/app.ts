import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CLUB } from './datos/datos';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  host: { '(window:scroll)': 'alHacerScroll()' },
})
export class App {
  protected readonly club = CLUB;
  /** La cabecera se queda fija arriba; al bajar se hace más fina y gana sombra. */
  protected readonly conScroll = signal(false);

  protected alHacerScroll() {
    const abajo = scrollY > 24;
    if (abajo !== this.conScroll()) this.conScroll.set(abajo);
  }

  protected readonly anio = new Date().getFullYear();
  protected readonly enlaces = [
    { ruta: '/quienes-somos', texto: 'Quiénes somos' },
    { ruta: '/quedadas', texto: 'Quedadas' },
    { ruta: '/blog', texto: 'Blog' },
    { ruta: '/galeria', texto: 'Galería' },
    { ruta: '/patrocinadores', texto: 'Patrocinadores' },
  ];
}
