import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { PortadaComponent } from './portada.component';

describe('PortadaComponent', () => {
  async function crear() {
    await TestBed.configureTestingModule({
      imports: [PortadaComponent],
      providers: [provideRouter([])],
    }).compileComponents();
    const fixture = TestBed.createComponent(PortadaComponent);
    await fixture.whenStable();
    return fixture.nativeElement as HTMLElement;
  }

  it('muestra un botón "Ver en 3D" que lleva a /maqueta', async () => {
    const el = await crear();
    const boton = el.querySelector('a[href="/maqueta"]');
    expect(boton?.textContent).toContain('Ver en 3D');
  });

  it('muestra la ficha técnica con 49,77 cc y 38,4 × 43 mm', async () => {
    const texto = (await crear()).textContent ?? '';
    expect(texto).toContain('49,77 cc');
    expect(texto).toContain('38,4 × 43 mm');
  });
});
