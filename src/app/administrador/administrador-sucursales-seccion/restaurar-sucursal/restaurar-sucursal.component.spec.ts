import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RestaurarSucursalComponent } from './restaurar-sucursal.component';

describe('RestaurarSucursalComponent', () => {
  let component: RestaurarSucursalComponent;
  let fixture: ComponentFixture<RestaurarSucursalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RestaurarSucursalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RestaurarSucursalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
