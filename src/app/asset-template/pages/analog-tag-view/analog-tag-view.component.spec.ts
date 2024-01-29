import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalogTagViewComponent } from './analog-tag-view.component';

describe('AnalogTagViewComponent', () => {
  let component: AnalogTagViewComponent;
  let fixture: ComponentFixture<AnalogTagViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnalogTagViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalogTagViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
