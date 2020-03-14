import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerInsumosOrdenDeCompraComponent } from './ver-insumos-orden-de-compra.component';

describe('VerInsumosOrdenDeCompraComponent', () => {
  let component: VerInsumosOrdenDeCompraComponent;
  let fixture: ComponentFixture<VerInsumosOrdenDeCompraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerInsumosOrdenDeCompraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerInsumosOrdenDeCompraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
