import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageAlarmAnalogAssetTagComponent } from './manage-alarm-analog-asset-tag.component';

describe('ManageAlarmAnalogAssetTagComponent', () => {
  let component: ManageAlarmAnalogAssetTagComponent;
  let fixture: ComponentFixture<ManageAlarmAnalogAssetTagComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageAlarmAnalogAssetTagComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageAlarmAnalogAssetTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
