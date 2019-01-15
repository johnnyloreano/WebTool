import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcidoGlutamicoComponent } from './acido-glutamico.component';

describe('AcidoGlutamicoComponent', () => {
  let component: AcidoGlutamicoComponent;
  let fixture: ComponentFixture<AcidoGlutamicoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcidoGlutamicoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcidoGlutamicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
