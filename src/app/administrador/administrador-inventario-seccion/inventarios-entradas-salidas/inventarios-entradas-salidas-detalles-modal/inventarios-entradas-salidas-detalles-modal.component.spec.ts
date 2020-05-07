import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventariosEntradasSalidasDetallesModalComponent } from './inventarios-entradas-salidas-detalles-modal.component';

describe('InventariosEntradasSalidasDetallesModalComponent', () => {
  let component: InventariosEntradasSalidasDetallesModalComponent;
  let fixture: ComponentFixture<InventariosEntradasSalidasDetallesModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventariosEntradasSalidasDetallesModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventariosEntradasSalidasDetallesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
