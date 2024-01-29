import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscreteTagPreviewComponent } from './discrete-tag-preview.component';

describe('DiscreteTagPreviewComponent', () => {
  let component: DiscreteTagPreviewComponent;
  let fixture: ComponentFixture<DiscreteTagPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiscreteTagPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscreteTagPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
