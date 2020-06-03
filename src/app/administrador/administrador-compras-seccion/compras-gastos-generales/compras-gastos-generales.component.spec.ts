import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComprasGastosGeneralesComponent } from './compras-gastos-generales.component';

describe('ComprasGastosGeneralesComponent', () => {
  let component: ComprasGastosGeneralesComponent;
  let fixture: ComponentFixture<ComprasGastosGeneralesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComprasGastosGeneralesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComprasGastosGeneralesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
