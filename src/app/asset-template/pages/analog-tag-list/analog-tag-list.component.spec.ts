import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalogTagListComponent } from './analog-tag-list.component';

describe('AnalogTagListComponent', () => {
  let component: AnalogTagListComponent;
  let fixture: ComponentFixture<AnalogTagListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnalogTagListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalogTagListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
