import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DoubleBondComponent } from './double-bond.component';

describe('DoubleBondComponent', () => {
  let component: DoubleBondComponent;
  let fixture: ComponentFixture<DoubleBondComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DoubleBondComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DoubleBondComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
