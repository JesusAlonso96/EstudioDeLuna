import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventariosEntradasSalidasComponent } from './inventarios-entradas-salidas.component';

describe('InventariosEntradasSalidasComponent', () => {
  let component: InventariosEntradasSalidasComponent;
  let fixture: ComponentFixture<InventariosEntradasSalidasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventariosEntradasSalidasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventariosEntradasSalidasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
