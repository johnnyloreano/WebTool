import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GlicinaComponent } from './glicina.component';

describe('GlicinaComponent', () => {
  let component: GlicinaComponent;
  let fixture: ComponentFixture<GlicinaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GlicinaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GlicinaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
