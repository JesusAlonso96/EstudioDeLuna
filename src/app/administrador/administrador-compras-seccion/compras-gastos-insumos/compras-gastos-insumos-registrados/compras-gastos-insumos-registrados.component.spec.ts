import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComprasGastosInsumosRegistradosComponent } from './compras-gastos-insumos-registrados.component';

describe('ComprasGastosInsumosRegistradosComponent', () => {
  let component: ComprasGastosInsumosRegistradosComponent;
  let fixture: ComponentFixture<ComprasGastosInsumosRegistradosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComprasGastosInsumosRegistradosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComprasGastosInsumosRegistradosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
