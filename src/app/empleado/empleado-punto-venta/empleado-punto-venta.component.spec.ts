import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpleadoPuntoVentaComponent } from './empleado-punto-venta.component';

describe('EmpleadoPuntoVentaComponent', () => {
  let component: EmpleadoPuntoVentaComponent;
  let fixture: ComponentFixture<EmpleadoPuntoVentaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmpleadoPuntoVentaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpleadoPuntoVentaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
