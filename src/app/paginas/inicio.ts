import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CLUB, quedadasProximas, formatearFecha } from '../datos/datos';
import { Matricula } from './matricula';
import { Rotador } from './rotador';
import { Cronologia } from './cronologia';

@Component({
  selector: 'app-inicio',
  imports: [RouterLink, Matricula, Rotador, Cronologia],
  template: `
    <div class="campo">
      <section class="hero">
        <div class="hero-texto">
          <p class="kicker">Club de Vespino · Teatinos, Málaga</p>
          <h1>{{ club.nombre }}</h1>
          <p class="lema">{{ club.lema }}</p>
          <p class="hero-parrafo">{{ club.descripcion[0] }}</p>
          <p class="acciones">
            <a class="boton" routerLink="/unete">Únete al club</a>
            <a class="boton boton-claro" routerLink="/quedadas">Ver quedadas</a>
          </p>
          <dl class="hero-datos">
            @for (d of club.datos; track d.valor) {
              <div><dt>{{ d.valor }}</dt><dd>{{ d.texto }}</dd></div>
            }
          </dl>
        </div>
        <div class="hero-foto">
          <div class="marco">
            <app-rotador />
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

    <section class="bloque bloque-crono">
      <h2>Así ha cambiado el Vespino</h2>
      <p class="intro">De 1968 a hoy: baja por la página y sigue al Vespino por la carretera de los años.</p>
      <app-cronologia />
      <p><a class="enlace" routerLink="/galeria">Ver la galería de fotos</a></p>
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
  protected readonly proxima = quedadasProximas()[0];
  protected readonly formatearFecha = formatearFecha;
}
