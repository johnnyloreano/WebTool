import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeucinaComponent } from './leucina.component';

describe('LeucinaComponent', () => {
  let component: LeucinaComponent;
  let fixture: ComponentFixture<LeucinaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeucinaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeucinaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
