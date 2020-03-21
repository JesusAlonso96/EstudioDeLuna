import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RootAltaUsuariosComponent } from './root-alta-usuarios.component';

describe('RootAltaUsuariosComponent', () => {
  let component: RootAltaUsuariosComponent;
  let fixture: ComponentFixture<RootAltaUsuariosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RootAltaUsuariosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RootAltaUsuariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
