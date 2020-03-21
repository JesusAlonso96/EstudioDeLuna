import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CajaDetallesComponent } from './caja-detalles.component';

describe('CajaDetallesComponent', () => {
  let component: CajaDetallesComponent;
  let fixture: ComponentFixture<CajaDetallesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CajaDetallesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CajaDetallesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
