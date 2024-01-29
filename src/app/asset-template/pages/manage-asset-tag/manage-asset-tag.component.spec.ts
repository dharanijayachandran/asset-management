import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageAssetTagComponent } from './manage-asset-tag.component';

describe('ManageAssetTagComponent', () => {
  let component: ManageAssetTagComponent;
  let fixture: ComponentFixture<ManageAssetTagComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageAssetTagComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageAssetTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
