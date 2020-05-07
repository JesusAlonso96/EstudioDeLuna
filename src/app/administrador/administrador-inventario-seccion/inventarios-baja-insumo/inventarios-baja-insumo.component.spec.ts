import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventariosBajaInsumoComponent } from './inventarios-baja-insumo.component';

describe('InventariosBajaInsumoComponent', () => {
  let component: InventariosBajaInsumoComponent;
  let fixture: ComponentFixture<InventariosBajaInsumoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventariosBajaInsumoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventariosBajaInsumoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
