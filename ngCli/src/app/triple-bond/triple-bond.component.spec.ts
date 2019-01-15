import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TripleBondComponent } from './triple-bond.component';

describe('TripleBondComponent', () => {
  let component: TripleBondComponent;
  let fixture: ComponentFixture<TripleBondComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TripleBondComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TripleBondComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
