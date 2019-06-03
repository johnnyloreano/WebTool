import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreViewerComponent } from './pre-viewer.component';

describe('PreViewerComponent', () => {
  let component: PreViewerComponent;
  let fixture: ComponentFixture<PreViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreViewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
