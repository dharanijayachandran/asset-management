import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalogTagReadViewComponent } from './analog-tag-read-view.component';

describe('AnalogTagReadViewComponent', () => {
  let component: AnalogTagReadViewComponent;
  let fixture: ComponentFixture<AnalogTagReadViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnalogTagReadViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalogTagReadViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
