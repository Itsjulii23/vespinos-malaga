import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CLUB, GALERIA, quedadasProximas, formatearFecha } from '../datos/datos';
import { Matricula } from './matricula';

@Component({
  selector: 'app-inicio',
  imports: [RouterLink, Matricula],
  template: `
    <div class="campo">
      <section class="hero">
        <div class="hero-texto">
          <h1>{{ club.nombre }}</h1>
          <p class="lema">{{ club.lema }}</p>
          <p class="acciones">
            <a class="boton" routerLink="/unete">Únete al club</a>
            <a class="boton boton-claro" routerLink="/quedadas">Ver quedadas</a>
          </p>
        </div>
        <div class="hero-foto">
          <div class="marco">
            <img [src]="portada.src" alt="Foto provisional de un Vespino" width="900" height="1125" />
            <i></i>
          </div>
          @if (proxima; as q) {
            <a class="hero-placa" [routerLink]="['/quedadas', q.slug]" [attr.aria-label]="'Próxima quedada: ' + q.titulo">
              <app-matricula [fecha]="q.fecha" />
              <span class="hero-placa-texto">Próxima quedada: {{ q.titulo }}</span>
            </a>
          }
        </div>
      </section>
    </div>

    <section class="bloque">
      <h2>Qué hacemos</h2>
      <div class="tres">
        <article>
          <h3>Restauramos</h3>
          <p>Rescatamos Vespinos viejos y los dejamos listos para circular, pieza a pieza.</p>
        </article>
        <article>
          <h3>Salimos de ruta</h3>
          <p>Rutas en grupo, quedadas y salidas solidarias por Málaga y alrededores.</p>
        </article>
        <article>
          <h3>Nos juntamos en la sede</h3>
          <p>Charlamos y compartimos consejos de restauración en Teatinos.</p>
        </article>
      </div>
    </section>

    <section class="bloque bloque-fino">
      <h2>Fotos del club</h2>
      <ul class="tira">
        @for (f of fotos; track f.src) {
          <li><img [src]="f.src" [alt]="'Foto provisional: ' + f.pie" loading="lazy" [width]="f.ancho" [height]="f.alto" /></li>
        }
      </ul>
      <p><a class="enlace" routerLink="/galeria">Ver toda la galería</a></p>
    </section>

    @if (proxima; as q) {
      <section class="bloque banda banda-faro">
        <h2>Próxima quedada</h2>
        <p class="banda-texto"><strong>{{ q.titulo }}</strong>, {{ formatearFecha(q.fecha) }}. {{ q.resumen }}</p>
        <p><a class="boton" [routerLink]="['/quedadas', q.slug]">Ver detalles</a></p>
      </section>
    }
  `,
})
export class Inicio {
  protected readonly club = CLUB;
  protected readonly portada = GALERIA[3];
  protected readonly fotos = GALERIA.slice(1, 6);
  protected readonly proxima = quedadasProximas()[0];
  protected readonly formatearFecha = formatearFecha;
}
