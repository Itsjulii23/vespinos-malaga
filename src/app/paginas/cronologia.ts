import { AfterViewInit, Component, DestroyRef, ElementRef, inject, viewChild } from '@angular/core';
import { GALERIA, HISTORIA } from '../datos/datos';

/** Línea del tiempo del Vespino: un Vespino baja por la carretera según se hace scroll. */
@Component({
  selector: 'app-cronologia',
  template: `
    <div class="crono" #crono>
      <div class="crono-via" aria-hidden="true">
        <svg class="crono-vespino" viewBox="0 0 60 120" width="60" height="120">
          <rect x="25" y="4" width="10" height="28" rx="5" class="v-rueda" />
          <path d="M17 26 C17 14 43 14 43 26 L45 62 C45 72 15 72 15 62 Z" class="v-cuerpo" />
          <ellipse cx="30" cy="46" rx="10" ry="17" class="v-sillin" />
          <rect x="25" y="86" width="10" height="28" rx="5" class="v-rueda" />
          <rect x="21" y="82" width="18" height="22" rx="9" class="v-guardabarros" />
          <rect x="3" y="68" width="54" height="6" rx="3" class="v-manillar" />
          <circle cx="5" cy="71" r="4" class="v-rueda" />
          <circle cx="55" cy="71" r="4" class="v-rueda" />
          <circle cx="30" cy="78" r="6" class="v-faro" />
        </svg>
      </div>
      <ol>
        @for (h of hitos; track h.anio) {
          <li>
            <div class="crono-tarjeta">
              <p class="crono-anio">{{ h.anio }}</p>
              <h3>{{ h.titulo }}</h3>
              <p>{{ h.texto }}</p>
              @if (h.foto; as src) {
                @if (foto(src); as f) {
                  <img [src]="f.src" [alt]="f.pie" loading="lazy" [width]="f.ancho" [height]="f.alto" />
                }
              }
            </div>
          </li>
        }
      </ol>
    </div>
  `,
})
export class Cronologia implements AfterViewInit {
  protected readonly hitos = HISTORIA;
  private readonly crono = viewChild.required<ElementRef<HTMLElement>>('crono');
  private readonly destruir = inject(DestroyRef);

  protected foto(src: string) {
    return GALERIA.find((f) => f.src === src);
  }

  ngAfterViewInit() {
    const el = this.crono().nativeElement;
    const paradas = [...el.querySelectorAll<HTMLElement>('li')];
    let pendiente = false;

    const pintar = () => {
      pendiente = false;
      const r = el.getBoundingClientRect();
      // El Vespino va en el punto de la línea que está a la altura del centro de la pantalla.
      const y = innerHeight * 0.5 - r.top;
      el.style.setProperty('--progreso', String(Math.min(1, Math.max(0, y / r.height))));
      for (const li of paradas) li.classList.toggle('alcanzado', li.offsetTop + 24 < y);
    };
    const pedir = () => {
      if (!pendiente) {
        pendiente = true;
        requestAnimationFrame(pintar);
      }
    };

    pintar();
    addEventListener('scroll', pedir, { passive: true });
    addEventListener('resize', pedir);
    this.destruir.onDestroy(() => {
      removeEventListener('scroll', pedir);
      removeEventListener('resize', pedir);
    });
  }
}
