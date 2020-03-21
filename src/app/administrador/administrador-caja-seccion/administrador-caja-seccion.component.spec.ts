import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministradorCajaSeccionComponent } from './administrador-caja-seccion.component';

describe('AdministradorCajaSeccionComponent', () => {
  let component: AdministradorCajaSeccionComponent;
  let fixture: ComponentFixture<AdministradorCajaSeccionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdministradorCajaSeccionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdministradorCajaSeccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
