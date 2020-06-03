import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarGastoGeneralComponent } from './editar-gasto-general.component';

describe('EditarGastoGeneralComponent', () => {
  let component: EditarGastoGeneralComponent;
  let fixture: ComponentFixture<EditarGastoGeneralComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditarGastoGeneralComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarGastoGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
