import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComprasGastosInsumosPendientesComponent } from './compras-gastos-insumos-pendientes.component';

describe('ComprasGastosInsumosPendientesComponent', () => {
  let component: ComprasGastosInsumosPendientesComponent;
  let fixture: ComponentFixture<ComprasGastosInsumosPendientesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComprasGastosInsumosPendientesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComprasGastosInsumosPendientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
