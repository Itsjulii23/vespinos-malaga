import { Component, inject } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-maqueta',
  imports: [RouterLink],
  templateUrl: './maqueta.component.html',
  styleUrl: './maqueta.component.css',
})
export class MaquetaComponent {
  // La maqueta es otro proyecto (repo vespino) publicado en su propia página.
  protected readonly url: SafeResourceUrl = inject(DomSanitizer).bypassSecurityTrustResourceUrl(
    'https://itsjulii23.github.io/vespino/',
  );
}
