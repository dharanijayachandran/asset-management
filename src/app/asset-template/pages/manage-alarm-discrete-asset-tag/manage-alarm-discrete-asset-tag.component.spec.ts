import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageAlarmDiscreteAssetTagComponent } from './manage-alarm-discrete-asset-tag.component';

describe('ManageAlarmDiscreteAssetTagComponent', () => {
  let component: ManageAlarmDiscreteAssetTagComponent;
  let fixture: ComponentFixture<ManageAlarmDiscreteAssetTagComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageAlarmDiscreteAssetTagComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageAlarmDiscreteAssetTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
