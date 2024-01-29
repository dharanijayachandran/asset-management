import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetTemplatePreviewComponent } from './asset-template-preview.component';

describe('AssetTemplatePreviewComponent', () => {
  let component: AssetTemplatePreviewComponent;
  let fixture: ComponentFixture<AssetTemplatePreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetTemplatePreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetTemplatePreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
