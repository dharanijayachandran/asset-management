import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadAssetTagsComponent } from './download-asset-tags.component';

describe('DownloadAssetTagsComponent', () => {
  let component: DownloadAssetTagsComponent;
  let fixture: ComponentFixture<DownloadAssetTagsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DownloadAssetTagsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadAssetTagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
