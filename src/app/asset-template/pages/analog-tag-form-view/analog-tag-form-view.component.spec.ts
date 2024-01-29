import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalogTagFormViewComponent } from './analog-tag-form-view.component';

describe('AnalogTagFormViewComponent', () => {
  let component: AnalogTagFormViewComponent;
  let fixture: ComponentFixture<AnalogTagFormViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnalogTagFormViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalogTagFormViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
