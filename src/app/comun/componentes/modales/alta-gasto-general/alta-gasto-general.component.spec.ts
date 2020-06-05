import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AltaGastoGeneralComponent } from './alta-gasto-general.component';

describe('AltaGastoGeneralComponent', () => {
  let component: AltaGastoGeneralComponent;
  let fixture: ComponentFixture<AltaGastoGeneralComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AltaGastoGeneralComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AltaGastoGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
