import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateAssetTagComponent } from './generate-asset-tag.component';

describe('GenerateAssetTagComponent', () => {
  let component: GenerateAssetTagComponent;
  let fixture: ComponentFixture<GenerateAssetTagComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenerateAssetTagComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerateAssetTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
