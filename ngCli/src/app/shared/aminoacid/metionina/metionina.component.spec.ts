import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MetioninaComponent } from './metionina.component';

describe('MetioninaComponent', () => {
  let component: MetioninaComponent;
  let fixture: ComponentFixture<MetioninaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MetioninaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetioninaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
