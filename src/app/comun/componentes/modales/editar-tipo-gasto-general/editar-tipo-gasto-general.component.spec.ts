import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarTipoGastoGeneralComponent } from './editar-tipo-gasto-general.component';

describe('EditarTipoGastoGeneralComponent', () => {
  let component: EditarTipoGastoGeneralComponent;
  let fixture: ComponentFixture<EditarTipoGastoGeneralComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditarTipoGastoGeneralComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarTipoGastoGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
