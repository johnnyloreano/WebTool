import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AminoacidComponent } from './aminoacid.component';

describe('AminoacidComponent', () => {
  let component: AminoacidComponent;
  let fixture: ComponentFixture<AminoacidComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AminoacidComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AminoacidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
