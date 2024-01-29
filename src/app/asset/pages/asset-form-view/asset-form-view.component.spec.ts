import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetFormViewComponent } from './asset-form-view.component';

describe('AssetFormViewComponent', () => {
  let component: AssetFormViewComponent;
  let fixture: ComponentFixture<AssetFormViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetFormViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetFormViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
