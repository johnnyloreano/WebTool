import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FenilalaninaComponent } from './fenilalanina.component';

describe('FenilalaninaComponent', () => {
  let component: FenilalaninaComponent;
  let fixture: ComponentFixture<FenilalaninaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FenilalaninaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FenilalaninaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
