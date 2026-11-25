import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { GALERIA } from '../datos/datos';

/** Vespinos que se relevan solos cada pocos segundos: el actual gira y sale, y entra el siguiente. */
@Component({
  selector: 'app-rotador',
  template: `
    <div class="rotador" (mouseenter)="pausa.set(true)" (mouseleave)="pausa.set(false)"
         (focusin)="pausa.set(true)" (focusout)="pausa.set(false)">
      <ul>
        @for (f of fotos; track f.src; let i = $index) {
          <li [class.activa]="i === actual()" [class.saliendo]="i === anterior()" [attr.aria-hidden]="i !== actual()">
            <img [src]="f.src" [alt]="f.pie" [width]="f.ancho" [height]="f.alto" [attr.loading]="i === 0 ? null : 'lazy'" />
            <p class="rotador-pie">{{ f.pie }}</p>
          </li>
        }
      </ul>
      <div class="rotador-puntos">
        @for (f of fotos; track f.src; let i = $index) {
          <button type="button" (click)="ir(i)" [class.activo]="i === actual()"
                  [attr.aria-label]="'Ver: ' + f.pie" [attr.aria-current]="i === actual()"></button>
        }
      </div>
    </div>
  `,
})
export class Rotador implements OnInit {
  protected readonly fotos = [0, 1, 2, 7, 4].map((i) => GALERIA[i]);
  protected readonly actual = signal(0);
  protected readonly anterior = signal(-1);
  protected readonly pausa = signal(false);
  private readonly destruir = inject(DestroyRef);

  ngOnInit() {
    // Quien prefiere menos movimiento no ve el cambio automático; puede usar los puntos.
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = setInterval(() => {
      if (!this.pausa()) this.ir((this.actual() + 1) % this.fotos.length);
    }, 4500);
    this.destruir.onDestroy(() => clearInterval(id));
  }

  protected ir(i: number) {
    if (i === this.actual()) return;
    this.anterior.set(this.actual());
    this.actual.set(i);
  }
}
