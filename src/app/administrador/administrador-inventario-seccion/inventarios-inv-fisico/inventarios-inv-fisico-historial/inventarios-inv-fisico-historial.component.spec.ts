import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventariosInvFisicoHistorialComponent } from './inventarios-inv-fisico-historial.component';

describe('InventariosInvFisicoHistorialComponent', () => {
  let component: InventariosInvFisicoHistorialComponent;
  let fixture: ComponentFixture<InventariosInvFisicoHistorialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventariosInvFisicoHistorialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventariosInvFisicoHistorialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
