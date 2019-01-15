import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TirosinaComponent } from './tirosina.component';

describe('TirosinaComponent', () => {
  let component: TirosinaComponent;
  let fixture: ComponentFixture<TirosinaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TirosinaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TirosinaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
