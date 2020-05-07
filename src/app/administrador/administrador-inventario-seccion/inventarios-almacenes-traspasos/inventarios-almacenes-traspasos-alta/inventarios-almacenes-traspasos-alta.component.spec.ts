import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventariosAlmacenesTraspasosAltaComponent } from './inventarios-almacenes-traspasos-alta.component';

describe('InventariosAlmacenesTraspasosAltaComponent', () => {
  let component: InventariosAlmacenesTraspasosAltaComponent;
  let fixture: ComponentFixture<InventariosAlmacenesTraspasosAltaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventariosAlmacenesTraspasosAltaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventariosAlmacenesTraspasosAltaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
