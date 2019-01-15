import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArgininaComponent } from './arginina.component';

describe('ArgininaComponent', () => {
  let component: ArgininaComponent;
  let fixture: ComponentFixture<ArgininaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArgininaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArgininaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
