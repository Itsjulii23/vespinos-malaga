import { Component, computed, input } from '@angular/core';
import { partesFecha } from '../datos/datos';

/** Matrícula de ciclomotor con la fecha de una quedada. */
@Component({
  selector: 'app-matricula',
  template: `
    <div class="matricula" role="img" [attr.aria-label]="'Fecha: ' + f().dia + ' ' + f().mes + ' ' + f().anio">
      <span class="matricula-prov">MA</span>
      <span class="matricula-dia">{{ f().dia }}</span>
      <span class="matricula-resto">{{ f().mes }}<br />{{ f().anio }}</span>
    </div>
  `,
})
export class Matricula {
  readonly fecha = input.required<string>();
  protected readonly f = computed(() => partesFecha(this.fecha()));
}
