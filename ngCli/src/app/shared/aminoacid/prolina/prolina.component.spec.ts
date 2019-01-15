import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProlinaComponent } from './prolina.component';

describe('ProlinaComponent', () => {
  let component: ProlinaComponent;
  let fixture: ComponentFixture<ProlinaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProlinaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProlinaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
