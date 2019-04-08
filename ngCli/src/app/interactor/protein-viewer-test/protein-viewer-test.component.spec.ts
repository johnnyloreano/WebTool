import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProteinViewerTestComponent } from './protein-viewer-test.component';

describe('ProteinViewerTestComponent', () => {
  let component: ProteinViewerTestComponent;
  let fixture: ComponentFixture<ProteinViewerTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProteinViewerTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProteinViewerTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
