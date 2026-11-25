import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Articulo, fotoDe, partesFecha } from '../datos/datos';

/** Tarjeta de un artículo del blog: toda la tarjeta es el enlace. */
@Component({
  selector: 'app-tarjeta-articulo',
  imports: [RouterLink],
  template: `
    <a class="articulo-enlace" [routerLink]="['/blog', articulo().slug]">
      <div class="articulo-foto">
        @if (foto(); as f) {
          <img [src]="f.src" alt="" loading="lazy" [width]="f.ancho" [height]="f.alto" />
        }
        <span class="articulo-fecha"><b>{{ fecha().dia }}</b>{{ fecha().mes }}</span>
        @if (articulo().provisional) {
          <span class="articulo-ejemplo">Ejemplo</span>
        }
      </div>
      <div class="articulo-cuerpo">
        <h3>{{ articulo().titulo }}</h3>
        <p>{{ articulo().resumen }}</p>
        <span class="articulo-leer">
          Leer artículo
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15M13 6l6 6-6 6" /></svg>
        </span>
      </div>
    </a>
  `,
})
export class TarjetaArticulo {
  readonly articulo = input.required<Articulo>();
  protected readonly foto = computed(() => fotoDe(this.articulo().foto));
  protected readonly fecha = computed(() => partesFecha(this.articulo().fecha));
}
