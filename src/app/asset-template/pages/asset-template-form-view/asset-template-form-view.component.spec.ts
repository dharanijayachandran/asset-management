import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetTemplateFormViewComponent } from './asset-template-form-view.component';

describe('AssetTemplateFormViewComponent', () => {
  let component: AssetTemplateFormViewComponent;
  let fixture: ComponentFixture<AssetTemplateFormViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetTemplateFormViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetTemplateFormViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
