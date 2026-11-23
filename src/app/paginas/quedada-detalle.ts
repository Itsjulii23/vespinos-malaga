import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { QUEDADAS, formatearFecha } from '../datos/datos';
import { Matricula } from './matricula';

@Component({
  selector: 'app-quedada-detalle',
  imports: [RouterLink, Matricula],
  template: `
    <section class="pagina">
      <p><a class="enlace" routerLink="/quedadas">Todas las quedadas</a></p>
      @if (q(); as q) {
        <div class="detalle-cab">
          <app-matricula [fecha]="q.fecha" />
          <div>
            <h1>{{ q.titulo }}</h1>
            <p class="meta">{{ q.fechaTexto ?? formatearFecha(q.fecha) }}. {{ q.lugar }}</p>
            @if (q.provisional) {
              <p class="etiqueta">Texto y fecha de ejemplo</p>
            }
          </div>
        </div>
        <img class="foto foto-ancha" [src]="q.foto" [alt]="'Foto provisional: ' + q.titulo" width="1200" height="900" />
        <div class="texto">
          @for (p of q.texto; track p) {
            <p>{{ p }}</p>
          }
        </div>
      } @else {
        <h1>No encontramos esa quedada</h1>
        <p>Puede que el enlace esté mal. Mira la <a class="enlace" routerLink="/quedadas">lista de quedadas</a>.</p>
      }
    </section>
  `,
})
export class QuedadaDetalle {
  readonly slug = input.required<string>();
  protected readonly q = computed(() => QUEDADAS.find((x) => x.slug === this.slug()));
  protected readonly formatearFecha = formatearFecha;
}
