import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BLOG, fotoDe, formatearFecha } from '../datos/datos';

@Component({
  selector: 'app-blog-detalle',
  imports: [RouterLink],
  template: `
    <section class="pagina">
      <p><a class="enlace" routerLink="/blog">Todos los artículos</a></p>
      @if (a(); as a) {
        <p class="meta">{{ a.fechaTexto ?? formatearFecha(a.fecha) }}</p>
        <h1>{{ a.titulo }}</h1>
        @if (a.provisional) {
          <p class="etiqueta">Artículo de ejemplo</p>
        }
        @if (fotoDe(a.foto); as f) {
          <img class="foto foto-ancha" [src]="f.src" [alt]="f.pie" [width]="f.ancho" [height]="f.alto" />
        }
        <div class="texto">
          @for (p of a.texto; track p) {
            <p>{{ p }}</p>
          }
        </div>
      } @else {
        <h1>No encontramos ese artículo</h1>
        <p>Puede que el enlace esté mal. Mira la <a class="enlace" routerLink="/blog">lista de artículos</a>.</p>
      }
    </section>
  `,
})
export class BlogDetalle {
  readonly slug = input.required<string>();
  protected readonly a = computed(() => BLOG.find((x) => x.slug === this.slug()));
  protected readonly fotoDe = fotoDe;
  protected readonly formatearFecha = formatearFecha;
}
