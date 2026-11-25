import { Component, effect, output, signal } from '@angular/core';
import { RECORTES } from '../datos/datos';

/** Carrusel circular: cada Vespino, sin fondo, sube desde abajo por un círculo, pasa por arriba y vuelve a bajar. */
@Component({
  selector: 'app-rotador',
  template: `
    <div class="rotador" role="group" aria-roledescription="carrusel" aria-label="Vespinos" [style.--paso]="360 / motos.length + 'deg'"
         [class.parado]="pausa()"
         (mouseenter)="pausa.set(true)" (mouseleave)="pausa.set(false)"
         (focusin)="pausa.set(true)" (focusout)="pausa.set(false)">
      <p class="rotador-pie">
        <span class="rotador-num">0{{ actual() + 1 }}<small>/0{{ motos.length }}</small></span>
        <span class="rotador-nombre">{{ motos[actual()].pie }}</span>
        <small class="rotador-credito">Foto: {{ motos[actual()].autor }}, {{ motos[actual()].licencia }}. Recortada.</small>
      </p>
      <div class="rotador-mandos">
        <button type="button" class="rotador-flecha" (click)="mover(-1)" aria-label="Vespino anterior">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 4l-8 8 8 8" /></svg>
        </button>
        <div class="rotador-puntos">
          @for (f of motos; track f.src; let i = $index) {
            <button type="button" (click)="ir(i)" [class.activo]="i === actual()" (animationend)="alTerminar($event)"
                    [attr.aria-label]="'Ver: ' + f.pie" [attr.aria-current]="i === actual()"></button>
          }
        </div>
        <button type="button" class="rotador-flecha" (click)="mover(1)" aria-label="Vespino siguiente">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 4l8 8-8 8" /></svg>
        </button>
      </div>
      <div class="rotador-escena">
        @for (f of motos; track f.src; let i = $index) {
          <figure [style.--o]="posicion(i)" [class.al-frente]="i === actual()" [class.lejos]="posicion(i) >= 2 || posicion(i) <= -2" [attr.aria-hidden]="i !== actual()">
            <img [src]="f.src" [alt]="f.pie" [width]="f.ancho" [height]="f.alto" [attr.loading]="i === 0 ? null : 'lazy'" />
          </figure>
        }
      </div>
    </div>
  `,
})
export class Rotador {
  protected readonly motos = RECORTES;
  /** Vueltas acumuladas, para que al pasar de la última a la primera no vuelva hacia atrás. */
  protected readonly giro = signal(0);
  protected readonly pausa = signal(false);
  /** Avisa de qué Vespino está delante, para que la portada cambie el fondo a juego. */
  readonly cambia = output<number>();

  constructor() {
    effect(() => this.cambia.emit(this.actual()));
  }

  protected actual() {
    const n = this.motos.length;
    return ((this.giro() % n) + n) % n;
  }

  /** Sitio de cada moto en la diagonal: 0 es el centro, -1 la que espera abajo y +1 la que ya se va arriba. */
  protected posicion(i: number) {
    const n = this.motos.length;
    let o = (this.actual() - i) % n;
    if (o > n / 2) o -= n;
    if (o < -n / 2) o += n;
    return o;
  }

  /**
   * El punto activo se llena en 4 segundos (CSS); al terminar pasa al siguiente Vespino.
   * Así la barra y el giro van siempre a la par, y al pausar se para todo.
   * Con movimiento reducido la barra no se anima y el paso es solo manual.
   */
  protected alTerminar(e: AnimationEvent) {
    if (e.animationName === 'cuenta') this.mover(1);
  }

  protected mover(paso: number) {
    this.giro.update((g) => g + paso);
  }

  protected ir(i: number) {
    const n = this.motos.length;
    let d = i - this.actual();
    if (d > n / 2) d -= n;
    if (d < -n / 2) d += n;
    this.mover(d);
  }
}
