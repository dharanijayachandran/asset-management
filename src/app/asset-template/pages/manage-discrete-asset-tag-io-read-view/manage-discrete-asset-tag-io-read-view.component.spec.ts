import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageDiscreteAssetTagIoReadViewComponent } from './manage-discrete-asset-tag-io-read-view.component';

describe('ManageDiscreteAssetTagIoReadViewComponent', () => {
  let component: ManageDiscreteAssetTagIoReadViewComponent;
  let fixture: ComponentFixture<ManageDiscreteAssetTagIoReadViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageDiscreteAssetTagIoReadViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageDiscreteAssetTagIoReadViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
