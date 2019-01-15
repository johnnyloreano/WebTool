import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TriptofanoComponent } from './triptofano.component';

describe('TriptofanoComponent', () => {
  let component: TriptofanoComponent;
  let fixture: ComponentFixture<TriptofanoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TriptofanoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TriptofanoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
