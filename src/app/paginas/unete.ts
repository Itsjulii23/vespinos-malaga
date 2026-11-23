import { Component } from '@angular/core';
import { CLUB } from '../datos/datos';

@Component({
  selector: 'app-unete',
  template: `
    <header class="cabeza"><h1>Únete al club</h1></header>
    <section class="pagina">
      <div class="texto">
        <p>Si tienes un Vespino, quieres restaurar uno o simplemente te gusta, puedes venir a conocernos.</p>
        <p>
          Escríbenos por Instagram en
          <a class="enlace" [href]="club.instagram" target="_blank" rel="noopener">{{ club.instagramUsuario }}</a>
          o pásate por la sede:
        </p>
        <p><strong>{{ club.sede.direccion }}</strong><br />{{ club.sede.codigoPostal }} {{ club.sede.zona }}</p>
        <p class="etiqueta">Falta añadir el horario de la sede y la cuota de socio</p>
      </div>
      <p><a class="boton" [href]="club.instagram" target="_blank" rel="noopener">Escribir por Instagram</a></p>
    </section>
  `,
})
export class Unete {
  protected readonly club = CLUB;
}
