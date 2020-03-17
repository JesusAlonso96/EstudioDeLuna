import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignarUsuariosSucursalesComponent } from './asignar-usuarios-sucursales.component';

describe('AsignarUsuariosSucursalesComponent', () => {
  let component: AsignarUsuariosSucursalesComponent;
  let fixture: ComponentFixture<AsignarUsuariosSucursalesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AsignarUsuariosSucursalesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsignarUsuariosSucursalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
