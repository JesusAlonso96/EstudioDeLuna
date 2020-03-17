import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RootSucursalesSeccionComponent } from './root-sucursales-seccion.component';

describe('RootSucursalesSeccionComponent', () => {
  let component: RootSucursalesSeccionComponent;
  let fixture: ComponentFixture<RootSucursalesSeccionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RootSucursalesSeccionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RootSucursalesSeccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
