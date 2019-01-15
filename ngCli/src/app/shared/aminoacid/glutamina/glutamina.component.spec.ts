import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GlutaminaComponent } from './glutamina.component';

describe('GlutaminaComponent', () => {
  let component: GlutaminaComponent;
  let fixture: ComponentFixture<GlutaminaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GlutaminaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GlutaminaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
