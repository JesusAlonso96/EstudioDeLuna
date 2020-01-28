import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupervisorPerfilComponent } from './supervisor-perfil.component';

describe('SupervisorPerfilComponent', () => {
  let component: SupervisorPerfilComponent;
  let fixture: ComponentFixture<SupervisorPerfilComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupervisorPerfilComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupervisorPerfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
