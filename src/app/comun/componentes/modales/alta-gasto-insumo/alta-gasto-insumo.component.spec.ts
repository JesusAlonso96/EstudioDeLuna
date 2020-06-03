import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AltaGastoInsumoComponent } from './alta-gasto-insumo.component';

describe('AltaGastoInsumoComponent', () => {
  let component: AltaGastoInsumoComponent;
  let fixture: ComponentFixture<AltaGastoInsumoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AltaGastoInsumoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AltaGastoInsumoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
