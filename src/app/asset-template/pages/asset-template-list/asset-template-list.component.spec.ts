import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetTemplateListComponent } from './asset-template-list.component';

describe('AssetTemplateListComponent', () => {
  let component: AssetTemplateListComponent;
  let fixture: ComponentFixture<AssetTemplateListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetTemplateListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetTemplateListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
