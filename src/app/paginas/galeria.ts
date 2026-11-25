import { Component, ElementRef, signal, viewChild } from '@angular/core';
import { GALERIA } from '../datos/datos';

@Component({
  selector: 'app-galeria',
  template: `
    <header class="cabeza"><h1>Galería</h1></header>
    <section class="pagina pagina-ancha">
      <p class="intro">Vespinos del club, rutas y quedadas. Pulsa una foto para verla grande.</p>
      <p class="etiqueta">Fotos de ejemplo de Wikimedia Commons hasta que el club mande las suyas</p>
      <ul class="mosaico">
        @for (f of fotos; track f.src; let i = $index) {
          <li>
            <button type="button" (click)="abrir(i)" [attr.aria-label]="'Ampliar: ' + f.pie">
              <img [src]="f.src" [alt]="f.pie" loading="lazy" [width]="f.ancho" [height]="f.alto" />
            </button>
          </li>
        }
      </ul>
      <details class="creditos">
        <summary>Créditos de las fotos</summary>
        <ul>
          @for (f of fotos; track f.src) {
            <li>{{ f.pie }}: <a [href]="f.fuente">{{ f.autor }}</a>, {{ f.licencia }}</li>
          }
        </ul>
      </details>
    </section>

    <dialog #visor class="visor" (keydown)="teclas($event)" (click)="clicFondo($event)" aria-label="Foto ampliada">
      <figure>
        <img [src]="actual().src" [alt]="actual().pie" />
        <figcaption>{{ actual().pie }} ({{ indice() + 1 }} de {{ fotos.length }})<small>Foto: {{ actual().autor }}, {{ actual().licencia }}</small></figcaption>
      </figure>
      <button type="button" class="visor-cerrar" (click)="cerrar()" aria-label="Cerrar">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5l14 14M19 5L5 19" /></svg>
      </button>
      <button type="button" class="visor-ant" (click)="mover(-1)" aria-label="Foto anterior">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 4l-8 8 8 8" /></svg>
      </button>
      <button type="button" class="visor-sig" (click)="mover(1)" aria-label="Foto siguiente">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 4l8 8-8 8" /></svg>
      </button>
    </dialog>
  `,
})
export class Galeria {
  protected readonly fotos = GALERIA;
  protected readonly indice = signal(0);
  private readonly visor = viewChild.required<ElementRef<HTMLDialogElement>>('visor');

  protected actual() {
    return this.fotos[this.indice()];
  }

  protected abrir(i: number) {
    this.indice.set(i);
    this.visor().nativeElement.showModal();
  }

  protected cerrar() {
    this.visor().nativeElement.close();
  }

  protected mover(paso: number) {
    const n = this.fotos.length;
    this.indice.update((i) => (i + paso + n) % n);
  }

  protected teclas(e: KeyboardEvent) {
    if (e.key === 'ArrowLeft') this.mover(-1);
    if (e.key === 'ArrowRight') this.mover(1);
  }

  /** Un clic en el fondo oscuro, fuera de la foto, cierra el visor. */
  protected clicFondo(e: MouseEvent) {
    if (e.target === this.visor().nativeElement) this.cerrar();
  }
}
