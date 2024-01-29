import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscreteTagReadViewComponent } from './discrete-tag-read-view.component';

describe('DiscreteTagReadViewComponent', () => {
  let component: DiscreteTagReadViewComponent;
  let fixture: ComponentFixture<DiscreteTagReadViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiscreteTagReadViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscreteTagReadViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
