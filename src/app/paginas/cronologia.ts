import { AfterViewInit, Component, DestroyRef, ElementRef, inject, signal, viewChild } from '@angular/core';
import { GALERIA, HISTORIA } from '../datos/datos';

/** Línea del tiempo horizontal del Vespino: las tarjetas se deslizan de lado y el Vespino recorre la carretera. */
@Component({
  selector: 'app-cronologia',
  template: `
    <div class="crono" #crono>
      <div class="crono-pista" #pista tabindex="0" role="region" aria-label="Historia del Vespino, año a año">
        <ol class="crono-lista">
          @for (h of hitos; track h.anio; let i = $index) {
            <li [class.activa]="i === actual()">
              <div class="crono-tarjeta">
                <p class="crono-anio">{{ h.anio }}</p>
                <h3>{{ h.titulo }}</h3>
                <p>{{ h.texto }}</p>
                @if (h.foto; as src) {
                  @if (foto(src); as f) {
                    <img [src]="f.src" [alt]="f.pie" loading="lazy" [width]="f.ancho" [height]="f.alto" draggable="false" />
                  }
                }
              </div>
            </li>
          }
        </ol>
      </div>

      <div class="crono-carretera">
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
        <div class="crono-paradas">
          @for (h of hitos; track h.anio; let i = $index) {
            <button type="button" [style.--i]="i / (hitos.length - 1)" [class.activa]="i === actual()"
                    (click)="ir(i)" [attr.aria-label]="'Ir a ' + h.anio + ': ' + h.titulo">{{ h.anio }}</button>
          }
        </div>
      </div>

      <p class="crono-aviso" [class.oculto]="tocado()" aria-hidden="true">
        <svg viewBox="0 0 24 24"><path d="M9 11V5.5a1.5 1.5 0 0 1 3 0V11m0-1.5a1.5 1.5 0 0 1 3 0V11m0-1a1.5 1.5 0 0 1 3 0v4.5a6 6 0 0 1-6 6h-1a6 6 0 0 1-4.6-2.2L4 15.5a1.6 1.6 0 0 1 2.4-2L9 15.5" /></svg>
        Desliza para avanzar
      </p>
    </div>
  `,
})
export class Cronologia implements AfterViewInit {
  protected readonly hitos = HISTORIA;
  protected readonly actual = signal(0);
  /** Pasa a true la primera vez que alguien desliza: entonces se apaga el aviso. */
  protected readonly tocado = signal(false);
  private readonly crono = viewChild.required<ElementRef<HTMLElement>>('crono');
  private readonly pista = viewChild.required<ElementRef<HTMLElement>>('pista');
  private readonly destruir = inject(DestroyRef);

  protected foto(src: string) {
    return GALERIA.find((f) => f.src === src);
  }

  /** Lleva la pista hasta la tarjeta de ese año, sin mover la página en vertical. */
  protected ir(i: number) {
    const n = this.hitos.length;
    const li = this.pista().nativeElement.querySelectorAll('li')[Math.min(n - 1, Math.max(0, i))];
    const suave = !matchMedia('(prefers-reduced-motion: reduce)').matches;
    li?.scrollIntoView({ inline: 'start', block: 'nearest', behavior: suave ? 'smooth' : 'auto' });
  }

  ngAfterViewInit() {
    const crono = this.crono().nativeElement;
    const pista = this.pista().nativeElement;
    let pendiente = false;

    const pintar = () => {
      pendiente = false;
      const max = pista.scrollWidth - pista.clientWidth;
      const p = max > 0 ? Math.min(1, Math.max(0, pista.scrollLeft / max)) : 0;
      crono.style.setProperty('--progreso', String(p));
      this.actual.set(Math.round(p * (this.hitos.length - 1)));
      if (pista.scrollLeft > 8) this.tocado.set(true);
    };
    const pedir = () => {
      if (!pendiente) {
        pendiente = true;
        requestAnimationFrame(pintar);
      }
    };

    pintar();
    pista.addEventListener('scroll', pedir, { passive: true });

    // Con ratón también se puede arrastrar la pista; en el móvil ya se desliza con el dedo.
    let x0 = 0;
    let s0 = 0;
    let arrastrando = false;
    pista.addEventListener('pointerdown', (e) => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      arrastrando = true;
      x0 = e.clientX;
      s0 = pista.scrollLeft;
      pista.setPointerCapture(e.pointerId);
    });
    pista.addEventListener('pointermove', (e) => {
      if (!arrastrando) return;
      const dx = e.clientX - x0;
      if (Math.abs(dx) > 4) pista.classList.add('arrastrando');
      pista.scrollLeft = s0 - dx;
    });
    const soltar = () => {
      if (!arrastrando) return;
      arrastrando = false;
      // Al soltar, la pista se encaja en la tarjeta más cercana.
      const antes = pista.scrollLeft;
      pista.classList.remove('arrastrando');
      const despues = pista.scrollLeft;
      pista.scrollLeft = antes;
      pista.scrollTo({ left: despues, behavior: 'smooth' });
    };
    pista.addEventListener('pointerup', soltar);
    pista.addEventListener('pointercancel', soltar);
    addEventListener('resize', pedir);
    this.destruir.onDestroy(() => removeEventListener('resize', pedir));
  }
}
