import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CajaHistorialCorteCajaComponent } from './caja-historial-corte-caja.component';

describe('CajaHistorialCorteCajaComponent', () => {
  let component: CajaHistorialCorteCajaComponent;
  let fixture: ComponentFixture<CajaHistorialCorteCajaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CajaHistorialCorteCajaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CajaHistorialCorteCajaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
