import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscreteTagListComponent } from './discrete-tag-list.component';

describe('DiscreteTagListComponent', () => {
  let component: DiscreteTagListComponent;
  let fixture: ComponentFixture<DiscreteTagListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiscreteTagListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscreteTagListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
