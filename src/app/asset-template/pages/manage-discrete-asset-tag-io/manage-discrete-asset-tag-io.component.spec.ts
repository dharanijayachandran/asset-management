import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageDiscreteAssetTagIoComponent } from './manage-discrete-asset-tag-io.component';

describe('ManageDiscreteAssetTagIoComponent', () => {
  let component: ManageDiscreteAssetTagIoComponent;
  let fixture: ComponentFixture<ManageDiscreteAssetTagIoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageDiscreteAssetTagIoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageDiscreteAssetTagIoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
