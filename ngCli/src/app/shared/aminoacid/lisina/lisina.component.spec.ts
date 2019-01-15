import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LisinaComponent } from './lisina.component';

describe('LisinaComponent', () => {
  let component: LisinaComponent;
  let fixture: ComponentFixture<LisinaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LisinaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LisinaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
