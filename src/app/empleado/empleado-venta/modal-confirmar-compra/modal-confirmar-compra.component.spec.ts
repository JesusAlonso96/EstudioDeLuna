import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalConfirmarCompraComponent } from './modal-confirmar-compra.component';

describe('ModalConfirmarCompraComponent', () => {
  let component: ModalConfirmarCompraComponent;
  let fixture: ComponentFixture<ModalConfirmarCompraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalConfirmarCompraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalConfirmarCompraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
