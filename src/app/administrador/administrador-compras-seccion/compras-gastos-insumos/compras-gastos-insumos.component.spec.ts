import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComprasGastosInsumosComponent } from './compras-gastos-insumos.component';

describe('ComprasGastosInsumosComponent', () => {
  let component: ComprasGastosInsumosComponent;
  let fixture: ComponentFixture<ComprasGastosInsumosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComprasGastosInsumosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComprasGastosInsumosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
