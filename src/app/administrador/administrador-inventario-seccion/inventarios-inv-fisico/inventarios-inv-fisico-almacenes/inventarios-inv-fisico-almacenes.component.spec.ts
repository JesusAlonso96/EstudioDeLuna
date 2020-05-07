import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventariosInvFisicoAlmacenesComponent } from './inventarios-inv-fisico-almacenes.component';

describe('InventariosInvFisicoAlmacenesComponent', () => {
  let component: InventariosInvFisicoAlmacenesComponent;
  let fixture: ComponentFixture<InventariosInvFisicoAlmacenesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventariosInvFisicoAlmacenesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventariosInvFisicoAlmacenesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
