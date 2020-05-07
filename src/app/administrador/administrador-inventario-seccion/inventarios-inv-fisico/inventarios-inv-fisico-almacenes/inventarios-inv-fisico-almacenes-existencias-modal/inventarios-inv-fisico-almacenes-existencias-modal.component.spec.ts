import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventariosInvFisicoAlmacenesExistenciasModalComponent } from './inventarios-inv-fisico-almacenes-existencias-modal.component';

describe('InventariosInvFisicoAlmacenesExistenciasModalComponent', () => {
  let component: InventariosInvFisicoAlmacenesExistenciasModalComponent;
  let fixture: ComponentFixture<InventariosInvFisicoAlmacenesExistenciasModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventariosInvFisicoAlmacenesExistenciasModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventariosInvFisicoAlmacenesExistenciasModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
