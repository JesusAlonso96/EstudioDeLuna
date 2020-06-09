import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CajaAltaCorteCajaComponent } from './caja-alta-corte-caja.component';

describe('CajaAltaCorteCajaComponent', () => {
  let component: CajaAltaCorteCajaComponent;
  let fixture: ComponentFixture<CajaAltaCorteCajaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CajaAltaCorteCajaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CajaAltaCorteCajaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
