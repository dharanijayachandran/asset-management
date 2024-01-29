import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlarmConfigListComponent } from './alarm-config-list.component';

describe('AlarmConfigListComponent', () => {
  let component: AlarmConfigListComponent;
  let fixture: ComponentFixture<AlarmConfigListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlarmConfigListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlarmConfigListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
