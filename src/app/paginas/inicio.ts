import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BLOG, CLUB, RECORTES, fotoDe, recorteDe, quedadasProximas, formatearFecha } from '../datos/datos';
import { Rotador } from './rotador';
import { Cronologia } from './cronologia';
import { TarjetaArticulo } from './tarjeta-articulo';

@Component({
  selector: 'app-inicio',
  imports: [RouterLink, Rotador, Cronologia, TarjetaArticulo],
  template: `
    <div class="campo">
      <div class="campo-fondo" aria-hidden="true">
        @for (m of recortes; track m.src; let i = $index) {
          <img [src]="m.fondo" alt="" [class.visible]="i === activo()" />
        }
      </div>
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
          <app-rotador (cambia)="activo.set($event)" />
        </div>
      </section>
    </div>

    <div class="cinta" aria-hidden="true">
      <div class="cinta-pista">
        @for (vuelta of [1, 2, 3, 4]; track vuelta) {
          @for (p of club.cinta; track p) {
            <span>{{ p }}</span>
          }
        }
      </div>
    </div>

    <section class="bloque">
      <div class="bloque-cab">
        <h2>Qué hacemos</h2>
        <p>Un club de gente que no deja que un Vespino se quede parado.</p>
      </div>
      <ul class="hacemos">
        @for (h of club.queHacemos; track h.titulo; let i = $index) {
          <li>
            @if (fotoDe(h.foto); as f) {
              <img [src]="f.src" alt="" loading="lazy" [width]="f.ancho" [height]="f.alto" />
            }
            <div class="hacemos-texto">
              <span class="hacemos-etiqueta">0{{ i + 1 }} · {{ h.etiqueta }}</span>
              <h3>{{ h.titulo }}</h3>
              <p>{{ h.texto }}</p>
            </div>
          </li>
        }
      </ul>
    </section>

    <section class="restaura">
      <div class="restaura-dentro">
        <div class="restaura-moto" aria-hidden="true">
          @if (recorteDe('img/recortes/vespino-lujo-s.webp'); as f) {
            <img [src]="f.src" alt="" loading="lazy" [width]="f.ancho" [height]="f.alto" />
          }
          <p><span>Chatarra</span><span>Carretera</span></p>
        </div>
        <div class="restaura-texto">
          <h2>Cómo restauramos un Vespino</h2>
          <p class="intro">De la chatarra a la carretera, en cuatro pasos. Baja y mira cómo recupera el color.</p>
          <ol class="pasos">
            @for (p of club.restauracion; track p.titulo) {
              <li><h3>{{ p.titulo }}</h3><p>{{ p.texto }}</p></li>
            }
          </ol>
        </div>
      </div>
    </section>

    <section class="bloque bloque-crono">
      <h2>Así ha cambiado el Vespino</h2>
      <p class="intro">De 1968 a hoy: desliza hacia los lados y sigue al Vespino por la carretera de los años.</p>
      <app-cronologia />
      <p><a class="enlace" routerLink="/galeria">Ver la galería de fotos</a></p>
    </section>

    <section class="bloque">
      <h2>¿Sabías que…?</h2>
      <ul class="curiosidades">
        @for (c of club.curiosidades; track c.valor) {
          <li><strong>{{ c.valor }}</strong><span>{{ c.texto }}</span></li>
        }
      </ul>
    </section>

    <section class="bloque">
      <h2>Del blog</h2>
      <ul class="articulos">
        @for (a of ultimos; track a.slug) {
          <li class="articulo"><app-tarjeta-articulo [articulo]="a" /></li>
        }
      </ul>
      <p><a class="enlace" routerLink="/blog">Ver todos los artículos</a></p>
    </section>

    <section class="bloque donde">
      <h2>Dónde estamos</h2>
      <p>{{ club.sede.direccion }}, {{ club.sede.codigoPostal }} {{ club.sede.zona }}.</p>
      <p>{{ club.sede.nota }}</p>
      <p><a class="enlace" [href]="club.instagram" rel="noopener">Síguenos en Instagram: {{ club.instagramUsuario }}</a></p>
    </section>

    @if (proxima; as q) {
      <section class="bloque banda banda-faro">
        <h2>Próxima quedada</h2>
        <p class="banda-texto"><strong>{{ q.titulo }}</strong>, {{ formatearFecha(q.fecha) }}. {{ q.resumen }}</p>
        <p><a class="boton" [routerLink]="['/quedadas', q.slug]">Ver detalles</a></p>
      </section>
    }

    <section class="bloque llamada">
      <h2>¿Tienes un Vespino o te gustaría tener uno?</h2>
      <p>Pásate por la sede, charla con nosotros y entérate de la próxima quedada.</p>
      <p class="acciones">
        <a class="boton" routerLink="/unete">Únete al club</a>
        <a class="boton boton-claro" [href]="club.instagram" rel="noopener">Instagram</a>
      </p>
    </section>
  `,
})
export class Inicio {
  protected readonly club = CLUB;
  protected readonly proxima = quedadasProximas()[0];
  protected readonly ultimos = BLOG.slice(0, 3);
  protected readonly fotoDe = fotoDe;
  protected readonly recorteDe = recorteDe;
  protected readonly recortes = RECORTES;
  protected readonly activo = signal(0);
  protected readonly formatearFecha = formatearFecha;
}
