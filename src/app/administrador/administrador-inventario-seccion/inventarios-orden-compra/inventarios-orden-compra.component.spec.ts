import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventariosOrdenCompraComponent } from './inventarios-orden-compra.component';

describe('InventariosOrdenCompraComponent', () => {
  let component: InventariosOrdenCompraComponent;
  let fixture: ComponentFixture<InventariosOrdenCompraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventariosOrdenCompraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventariosOrdenCompraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
