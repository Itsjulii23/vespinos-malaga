import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { formatearFecha, quedadasPasadas, quedadasProximas } from '../datos/datos';
import { Matricula } from './matricula';

@Component({
  selector: 'app-quedadas',
  imports: [RouterLink, Matricula],
  template: `
    <header class="cabeza"><h1>Quedadas</h1></header>
    <section class="pagina">

      @for (g of grupos; track g.titulo) {
        <h2>{{ g.titulo }}</h2>
        @if (g.items.length === 0) {
          <p class="vacio">Todavía no hay ninguna quedada fijada. Síguenos en Instagram para enterarte antes que nadie.</p>
        }
        @for (q of g.items; track q.slug) {
          <article class="quedada">
            <app-matricula [fecha]="q.fecha" />
            <div>
              <h3><a [routerLink]="['/quedadas', q.slug]">{{ q.titulo }}</a></h3>
              <p class="meta">{{ q.fechaTexto ?? formatearFecha(q.fecha) }}. {{ q.lugar }}</p>
              <p>{{ q.resumen }}</p>
              @if (q.provisional) {
                <p class="etiqueta">Texto de ejemplo</p>
              }
            </div>
          </article>
        }
      }
    </section>
  `,
})
export class Quedadas {
  protected readonly grupos = [
    { titulo: 'Próximas', items: quedadasProximas() },
    { titulo: 'Anteriores', items: quedadasPasadas() },
  ];
  protected readonly formatearFecha = formatearFecha;
}
