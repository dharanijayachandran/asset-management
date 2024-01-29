import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetTemplateViewComponent } from './asset-template-view.component';

describe('AssetTemplateViewComponent', () => {
  let component: AssetTemplateViewComponent;
  let fixture: ComponentFixture<AssetTemplateViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetTemplateViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetTemplateViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
