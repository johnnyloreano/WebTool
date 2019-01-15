import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AsparaginaComponent } from './asparagina.component';

describe('AsparaginaComponent', () => {
  let component: AsparaginaComponent;
  let fixture: ComponentFixture<AsparaginaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AsparaginaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsparaginaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
