import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetTemplateReadViewComponent } from './asset-template-read-view.component';

describe('AssetTemplateReadViewComponent', () => {
  let component: AssetTemplateReadViewComponent;
  let fixture: ComponentFixture<AssetTemplateReadViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetTemplateReadViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetTemplateReadViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
