import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AltaTipoGastoGeneralComponent } from './alta-tipo-gasto-general.component';

describe('AltaTipoGastoGeneralComponent', () => {
  let component: AltaTipoGastoGeneralComponent;
  let fixture: ComponentFixture<AltaTipoGastoGeneralComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AltaTipoGastoGeneralComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AltaTipoGastoGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
