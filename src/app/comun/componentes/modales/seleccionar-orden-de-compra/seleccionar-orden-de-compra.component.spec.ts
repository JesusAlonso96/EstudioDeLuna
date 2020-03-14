import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeleccionarOrdenDeCompraComponent } from './seleccionar-orden-de-compra.component';

describe('SeleccionarOrdenDeCompraComponent', () => {
  let component: SeleccionarOrdenDeCompraComponent;
  let fixture: ComponentFixture<SeleccionarOrdenDeCompraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeleccionarOrdenDeCompraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeleccionarOrdenDeCompraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
