import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SerinaComponent } from './serina.component';

describe('SerinaComponent', () => {
  let component: SerinaComponent;
  let fixture: ComponentFixture<SerinaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SerinaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SerinaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
