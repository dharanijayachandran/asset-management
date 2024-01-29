import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetReadViewComponent } from './asset-read-view.component';

describe('AssetReadViewComponent', () => {
  let component: AssetReadViewComponent;
  let fixture: ComponentFixture<AssetReadViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetReadViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetReadViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
