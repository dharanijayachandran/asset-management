import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageAlarmAnalogAssetTagListComponent } from './manage-alarm-analog-asset-tag-list.component';

describe('ManageAlarmAnalogAssetTagListComponent', () => {
  let component: ManageAlarmAnalogAssetTagListComponent;
  let fixture: ComponentFixture<ManageAlarmAnalogAssetTagListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageAlarmAnalogAssetTagListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageAlarmAnalogAssetTagListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
