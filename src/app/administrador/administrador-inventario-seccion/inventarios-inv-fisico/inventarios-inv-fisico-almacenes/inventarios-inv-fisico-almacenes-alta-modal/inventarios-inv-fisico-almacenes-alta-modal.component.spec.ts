import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventariosInvFisicoAlmacenesAltaModalComponent } from './inventarios-inv-fisico-almacenes-alta-modal.component';

describe('InventariosInvFisicoAlmacenesAltaModalComponent', () => {
  let component: InventariosInvFisicoAlmacenesAltaModalComponent;
  let fixture: ComponentFixture<InventariosInvFisicoAlmacenesAltaModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventariosInvFisicoAlmacenesAltaModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventariosInvFisicoAlmacenesAltaModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
