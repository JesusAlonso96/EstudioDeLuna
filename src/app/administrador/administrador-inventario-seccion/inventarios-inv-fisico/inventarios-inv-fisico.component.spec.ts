import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventariosInvFisicoComponent } from './inventarios-inv-fisico.component';

describe('InventariosInvFisicoComponent', () => {
  let component: InventariosInvFisicoComponent;
  let fixture: ComponentFixture<InventariosInvFisicoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventariosInvFisicoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventariosInvFisicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
