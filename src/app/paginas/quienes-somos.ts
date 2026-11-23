import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CLUB, GALERIA } from '../datos/datos';

@Component({
  selector: 'app-quienes-somos',
  imports: [RouterLink],
  template: `
    <header class="cabeza"><h1>Quiénes somos</h1></header>
    <section class="pagina">
      <div class="dos">
        <div class="texto">
          @for (p of club.descripcion; track p) {
            <p>{{ p }}</p>
          }
          <p><a class="enlace" routerLink="/unete">Cómo hacerte socio</a></p>
        </div>
        <img class="foto" [src]="foto.src" alt="Foto provisional de la sede" [width]="foto.ancho" [height]="foto.alto" />
      </div>
    </section>

    <section class="bloque bloque-fino">
      <dl class="cifras">
        @for (d of club.datos; track d.valor) {
          <div>
            <dt>{{ d.valor }}</dt>
            <dd>{{ d.texto }}</dd>
          </div>
        }
      </dl>
    </section>

    <section class="bloque">
      <h2>La sede</h2>
      <p>{{ club.sede.direccion }}, {{ club.sede.codigoPostal }} {{ club.sede.zona }}.</p>
      <p>{{ club.sede.nota }}</p>
    </section>
  `,
})
export class QuienesSomos {
  protected readonly club = CLUB;
  protected readonly foto = GALERIA[1];
}
