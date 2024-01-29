import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalogTagPreviewComponent } from './analog-tag-preview.component';

describe('AnalogTagPreviewComponent', () => {
  let component: AnalogTagPreviewComponent;
  let fixture: ComponentFixture<AnalogTagPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnalogTagPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalogTagPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
