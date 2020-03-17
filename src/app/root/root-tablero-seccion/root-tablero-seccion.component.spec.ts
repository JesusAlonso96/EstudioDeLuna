import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RootTableroSeccionComponent } from './root-tablero-seccion.component';

describe('RootTableroSeccionComponent', () => {
  let component: RootTableroSeccionComponent;
  let fixture: ComponentFixture<RootTableroSeccionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RootTableroSeccionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RootTableroSeccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
