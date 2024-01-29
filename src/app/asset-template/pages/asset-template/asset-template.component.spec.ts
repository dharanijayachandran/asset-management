import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetTemplateComponent } from './asset-template.component';

describe('AssetTemplateComponent', () => {
  let component: AssetTemplateComponent;
  let fixture: ComponentFixture<AssetTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
