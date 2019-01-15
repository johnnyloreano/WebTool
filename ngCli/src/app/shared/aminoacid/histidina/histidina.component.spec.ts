import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistidinaComponent } from './histidina.component';

describe('HistidinaComponent', () => {
  let component: HistidinaComponent;
  let fixture: ComponentFixture<HistidinaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistidinaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistidinaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
