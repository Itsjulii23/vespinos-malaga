import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PATROCINADORES } from '../datos/datos';

@Component({
  selector: 'app-patrocinadores',
  imports: [RouterLink],
  template: `
    <header class="cabeza"><h1>Patrocinadores</h1></header>
    <section class="pagina">
      <p class="intro">Gracias a las empresas y comercios que nos ayudan a mantener la sede, las rutas y las restauraciones.</p>
      <p class="etiqueta">Patrocinadores de ejemplo hasta tener los reales</p>
      <ul class="logos">
        @for (p of patrocinadores; track p.nombre) {
          <li>
            <span class="logo-hueco">{{ p.nombre }}</span>
            <p>{{ p.descripcion }}</p>
          </li>
        }
      </ul>
    </section>

    <section class="bloque banda">
      <h2>¿Quieres patrocinar al club?</h2>
      <p class="banda-texto">Escríbenos por Instagram o pásate por la sede y lo hablamos.</p>
      <p><a class="boton" routerLink="/unete">Cómo contactar</a></p>
    </section>
  `,
})
export class Patrocinadores {
  protected readonly patrocinadores = PATROCINADORES;
}
