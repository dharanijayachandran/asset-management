import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageAlarmDiscreteAssetTagListComponent } from './manage-alarm-discrete-asset-tag-list.component';

describe('ManageAlarmDiscreteAssetTagListComponent', () => {
  let component: ManageAlarmDiscreteAssetTagListComponent;
  let fixture: ComponentFixture<ManageAlarmDiscreteAssetTagListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageAlarmDiscreteAssetTagListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageAlarmDiscreteAssetTagListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
