import { Component, computed, signal } from '@angular/core';
import { articulosPorMes } from '../datos/datos';
import { TarjetaArticulo } from './tarjeta-articulo';

@Component({
  selector: 'app-blog',
  imports: [TarjetaArticulo],
  template: `
    <header class="cabeza"><h1>Blog</h1></header>
    <section class="pagina pagina-ancha">
      <p class="intro">Novedades del club, historia del Vespino y consejos de restauración.</p>

      <nav class="filtro-meses" aria-label="Filtrar por mes">
        <button type="button" [class.activo]="!mes()" [attr.aria-pressed]="!mes()" (click)="mes.set(null)">
          Todos <span>{{ total }}</span>
        </button>
        @for (g of grupos; track g.clave) {
          <button type="button" [class.activo]="mes() === g.clave" [attr.aria-pressed]="mes() === g.clave" (click)="mes.set(g.clave)">
            {{ g.titulo }} <span>{{ g.articulos.length }}</span>
          </button>
        }
      </nav>

      @for (g of visibles(); track g.clave) {
        <section class="grupo-mes" [attr.aria-labelledby]="'mes-' + g.clave">
          <h2 class="grupo-titulo" [id]="'mes-' + g.clave">{{ g.titulo }}</h2>
          <ul class="articulos">
            @for (a of g.articulos; track a.slug) {
              <li class="articulo"><app-tarjeta-articulo [articulo]="a" /></li>
            }
          </ul>
        </section>
      }
    </section>
  `,
})
export class Blog {
  protected readonly grupos = articulosPorMes();
  protected readonly total = this.grupos.reduce((n, g) => n + g.articulos.length, 0);
  protected readonly mes = signal<string | null>(null);
  protected readonly visibles = computed(() => {
    const m = this.mes();
    return m ? this.grupos.filter((g) => g.clave === m) : this.grupos;
  });
}
