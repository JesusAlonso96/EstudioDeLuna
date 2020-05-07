import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventariosAlmacenesTraspasosPendientesComponent } from './inventarios-almacenes-traspasos-pendientes.component';

describe('InventariosAlmacenesTraspasosPendientesComponent', () => {
  let component: InventariosAlmacenesTraspasosPendientesComponent;
  let fixture: ComponentFixture<InventariosAlmacenesTraspasosPendientesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventariosAlmacenesTraspasosPendientesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventariosAlmacenesTraspasosPendientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
