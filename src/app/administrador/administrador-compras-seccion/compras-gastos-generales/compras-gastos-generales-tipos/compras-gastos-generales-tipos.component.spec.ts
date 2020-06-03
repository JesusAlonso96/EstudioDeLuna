import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComprasGastosGeneralesTiposComponent } from './compras-gastos-generales-tipos.component';

describe('ComprasGastosGeneralesTiposComponent', () => {
  let component: ComprasGastosGeneralesTiposComponent;
  let fixture: ComponentFixture<ComprasGastosGeneralesTiposComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComprasGastosGeneralesTiposComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComprasGastosGeneralesTiposComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
