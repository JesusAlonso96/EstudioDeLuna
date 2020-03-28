import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AltaCajaComponent } from './alta-caja.component';

describe('AltaCajaComponent', () => {
  let component: AltaCajaComponent;
  let fixture: ComponentFixture<AltaCajaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AltaCajaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AltaCajaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
