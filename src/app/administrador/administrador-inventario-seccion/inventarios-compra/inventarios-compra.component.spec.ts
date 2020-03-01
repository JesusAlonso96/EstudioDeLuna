import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventariosCompraComponent } from './inventarios-compra.component';

describe('InventariosCompraComponent', () => {
  let component: InventariosCompraComponent;
  let fixture: ComponentFixture<InventariosCompraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventariosCompraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventariosCompraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
