import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscreteTagFormComponent } from './discrete-tag-form.component';

describe('DiscreteTagFormComponent', () => {
  let component: DiscreteTagFormComponent;
  let fixture: ComponentFixture<DiscreteTagFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiscreteTagFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscreteTagFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
