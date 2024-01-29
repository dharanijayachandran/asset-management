import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscreteTagViewComponent } from './discrete-tag-view.component';

describe('DiscreteTagViewComponent', () => {
  let component: DiscreteTagViewComponent;
  let fixture: ComponentFixture<DiscreteTagViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiscreteTagViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscreteTagViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
