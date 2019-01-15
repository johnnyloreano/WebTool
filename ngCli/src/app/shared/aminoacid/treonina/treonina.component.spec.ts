import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TreoninaComponent } from './treonina.component';

describe('TreoninaComponent', () => {
  let component: TreoninaComponent;
  let fixture: ComponentFixture<TreoninaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TreoninaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TreoninaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
