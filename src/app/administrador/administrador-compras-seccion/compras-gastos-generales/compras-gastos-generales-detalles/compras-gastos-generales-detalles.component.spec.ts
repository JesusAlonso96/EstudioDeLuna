import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComprasGastosGeneralesDetallesComponent } from './compras-gastos-generales-detalles.component';

describe('ComprasGastosGeneralesDetallesComponent', () => {
  let component: ComprasGastosGeneralesDetallesComponent;
  let fixture: ComponentFixture<ComprasGastosGeneralesDetallesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComprasGastosGeneralesDetallesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComprasGastosGeneralesDetallesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
