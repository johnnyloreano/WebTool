import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CisteinaComponent } from './cisteina.component';

describe('CisteinaComponent', () => {
  let component: CisteinaComponent;
  let fixture: ComponentFixture<CisteinaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CisteinaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CisteinaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
