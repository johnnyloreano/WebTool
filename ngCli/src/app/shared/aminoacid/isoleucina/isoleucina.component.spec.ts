import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IsoleucinaComponent } from './isoleucina.component';

describe('IsoleucinaComponent', () => {
  let component: IsoleucinaComponent;
  let fixture: ComponentFixture<IsoleucinaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IsoleucinaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IsoleucinaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
