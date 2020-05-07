import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventariosInvFisicoHistorialExistenciasModalComponent } from './inventarios-inv-fisico-historial-existencias-modal.component';

describe('InventariosInvFisicoHistorialExistenciasModalComponent', () => {
  let component: InventariosInvFisicoHistorialExistenciasModalComponent;
  let fixture: ComponentFixture<InventariosInvFisicoHistorialExistenciasModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventariosInvFisicoHistorialExistenciasModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventariosInvFisicoHistorialExistenciasModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
