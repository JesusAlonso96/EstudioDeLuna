import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarGastoInsumoComponent } from './editar-gasto-insumo.component';

describe('EditarGastoInsumoComponent', () => {
  let component: EditarGastoInsumoComponent;
  let fixture: ComponentFixture<EditarGastoInsumoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditarGastoInsumoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarGastoInsumoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
