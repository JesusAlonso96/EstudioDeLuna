import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventariosAlmacenesTraspasosComponent } from './inventarios-almacenes-traspasos.component';

describe('InventariosAlmacenesTraspasosComponent', () => {
  let component: InventariosAlmacenesTraspasosComponent;
  let fixture: ComponentFixture<InventariosAlmacenesTraspasosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventariosAlmacenesTraspasosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventariosAlmacenesTraspasosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
