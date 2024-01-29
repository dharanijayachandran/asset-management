import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageDiscreteAssetTagIoPreviewComponent } from './manage-discrete-asset-tag-io-preview.component';

describe('ManageDiscreteAssetTagIoPreviewComponent', () => {
  let component: ManageDiscreteAssetTagIoPreviewComponent;
  let fixture: ComponentFixture<ManageDiscreteAssetTagIoPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageDiscreteAssetTagIoPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageDiscreteAssetTagIoPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
