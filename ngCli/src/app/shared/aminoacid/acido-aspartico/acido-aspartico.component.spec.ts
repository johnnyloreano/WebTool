import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcidoAsparticoComponent } from './acido-aspartico.component';

describe('AcidoAsparticoComponent', () => {
  let component: AcidoAsparticoComponent;
  let fixture: ComponentFixture<AcidoAsparticoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcidoAsparticoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcidoAsparticoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
