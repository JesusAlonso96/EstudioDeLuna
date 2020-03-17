import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarSucursalesComponent } from './agregar-sucursales.component';

describe('AgregarSucursalesComponent', () => {
  let component: AgregarSucursalesComponent;
  let fixture: ComponentFixture<AgregarSucursalesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgregarSucursalesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgregarSucursalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
