import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlaninaComponent } from './alanina.component';

describe('AlaninaComponent', () => {
  let component: AlaninaComponent;
  let fixture: ComponentFixture<AlaninaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlaninaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlaninaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
