import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValinaComponent } from './valina.component';

describe('ValinaComponent', () => {
  let component: ValinaComponent;
  let fixture: ComponentFixture<ValinaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValinaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValinaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
